import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const { content, senderId, recipientId, conversationId } = await req.json();

    let convId = conversationId;

    // If no conversationId, create a new conversation
    if (!convId) {
      const conversation = await db.collection('conversations').insertOne({
        participants: [senderId, recipientId],
        createdAt: new Date(),
      });
      convId = conversation.insertedId;
    }

    // Store the message
    await db.collection('messages').insertOne({
      conversationId: new ObjectId(convId),
      senderId,
      content,
      createdAt: new Date(),
    });

    // Fetch all messages for the conversation
    const messages = await db.collection('messages').find({ conversationId: convId }).toArray();

    return NextResponse.json({ messages, conversationId: convId });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
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