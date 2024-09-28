import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request, { params }: { params: { conversationId: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch all messages for the specific conversation
    const messages = await db.collection('messages').find({
      conversationId: new ObjectId(params.conversationId),
    }).toArray();

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
