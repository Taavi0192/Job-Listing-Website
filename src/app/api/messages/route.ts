import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId, GridFSBucket } from 'mongodb';

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const contentType = req.headers.get('content-type');

    let content = '';
    let senderId = '';
    let recipientId = '';
    let conversationId = '';
    let scheduleDate = '';
    let file: File | null = null;

    // Handle form data (for file uploads)
    if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      content = formData.get('content')?.toString() || '';
      senderId = formData.get('senderId')?.toString() || '';
      recipientId = formData.get('recipientId')?.toString() || '';
      conversationId = formData.get('conversationId')?.toString() || '';
      scheduleDate = formData.get('scheduleDate')?.toString() || '';
      file = formData.get('file') as File | null;
    } else {
      // Handle JSON data (for regular message posting)
      const { content: jsonContent, senderId: jsonSenderId, recipientId: jsonRecipientId, conversationId: jsonConversationId, scheduleDate: jsonScheduleDate } = await req.json();
      content = jsonContent;
      senderId = jsonSenderId;
      recipientId = jsonRecipientId;
      conversationId = jsonConversationId;
      scheduleDate = jsonScheduleDate || '';
    }

    if (!ObjectId.isValid(senderId)) {
      return NextResponse.json({ error: 'Invalid sender ID' }, { status: 400 });
    }
    
    if (!conversationId && !ObjectId.isValid(recipientId)) {
      return NextResponse.json({ error: 'Invalid recipient ID' }, { status: 400 });
    }    

    let fileId = null;

    // Handle file upload if a file is provided
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
      const uploadStream = bucket.openUploadStream(file.name, {
        metadata: { contentType: file.type },
      });
      uploadStream.end(buffer); // Upload the buffer to GridFS

      fileId = uploadStream.id;
    }

    let convId = conversationId;

    // If no conversationId, create a new conversation
    if (!convId) {
      const conversation = await db.collection('conversations').insertOne({
        participants: [senderId, recipientId], // Ensure participants array is added correctly
        createdAt: new Date(),
      });
      convId = conversation.insertedId;
    }

    const isScheduled = !!scheduleDate;

    // Store the message
    await db.collection('messages').insertOne({
      conversationId: new ObjectId(convId),
      senderId: senderId,
      content,
      fileId,
      scheduleDate: isScheduled ? new Date(scheduleDate) : null,
      createdAt: new Date(),
      sent: !isScheduled,
    });

    // Return the appropriate response
    if (!isScheduled) {
      const messages = await db.collection('messages').find({ conversationId: new ObjectId(conversationId), sent: true }).toArray();
      return NextResponse.json({ messages });
    } else {
      return NextResponse.json({ message: 'Message scheduled successfully' });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
