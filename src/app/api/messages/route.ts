import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { GridFSBucket } from "mongodb";

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const formData = await req.formData();
    const content = formData.get("content")?.toString() || "";
    const senderId = formData.get("senderId")?.toString() || "";
    const conversationId = formData.get("conversationId")?.toString() || "";
    const scheduleDate = formData.get('scheduleDate')?.toString() || '';
    const file = formData.get("file") as File | null;

    let fileId = null;

    // If a file is attached, handle file upload using GridFS
    if (file) {
      const arrayBuffer = await file.arrayBuffer(); // Convert file to array buffer
      const buffer = Buffer.from(arrayBuffer); // Convert array buffer to buffer

      const bucket = new GridFSBucket(db, { bucketName: "uploads" });
      const uploadStream = bucket.openUploadStream(file.name, {
        metadata: { contentType: file.type }, // Store the file's MIME type in metadata
      });
      uploadStream.end(buffer);  // Upload the buffer to GridFS

      fileId = uploadStream.id; // Store the GridFS file ID
    }

    let convId = conversationId;

    // If no conversationId, create a new conversation
    if (!convId) {
      const conversation = await db.collection("conversations").insertOne({
        participants: [senderId, recipientId],
        createdAt: new Date(),
      });
      convId = conversation.insertedId;
    }

    // Determine if the message is scheduled
    const isScheduled = !!scheduleDate;

    // Store the message
    await db.collection("messages").insertOne({
      conversationId: new ObjectId(convId),
      senderId,
      content,
      fileId,
      scheduleDate: isScheduled ? new Date(scheduleDate) : null, // Save the schedule date if present
      createdAt: new Date(),
      sent: !isScheduled, // If no schedule date, mark as sent; otherwise, mark as not sent
    });

    // // Fetch all messages for the conversation
    // const messages = await db
    //   .collection("messages")
    //   .find({ conversationId: convId })
    //   .toArray();

    // return NextResponse.json({ messages, conversationId: convId });

    // Only return the message if it is NOT scheduled
    if (!isScheduled) {
      const messages = await db.collection('messages').find({ conversationId: new ObjectId(conversationId) }).toArray();
      return NextResponse.json({ messages });
    } else {
      // For scheduled messages, return a success response without sending the message
      return NextResponse.json({ message: 'Message scheduled successfully' });
    }

  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

// // GET: Retrieving messages for a conversation
// export async function GET(req: Request) {
//   try {
//     const client = await clientPromise;
//     const db = client.db();
//     const url = new URL(req.url);
//     const conversationId = url.searchParams.get('conversationId');

//     if (!conversationId) {
//       return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
//     }

//     // Fetch all messages for the specific conversation
//     const messages = await db.collection('messages').find({
//       conversationId: new ObjectId(conversationId),
//     }).toArray();

//     return NextResponse.json(messages);
//   } catch (error) {
//     console.error('Failed to fetch messages:', error);
//     return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
//   }
// }
