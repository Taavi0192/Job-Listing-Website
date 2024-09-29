import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { Session } from 'next-auth';

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const session: Session | null = await getServerSession(authOptions);
    
    // Check if session is available
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all conversations where the current user is a participant
    const conversations = await db.collection('conversations').find({
      participants: session.user.id,
    }).toArray();

    return NextResponse.json(conversations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const { participants } = await req.json();

    if (!participants || participants.length === 0) {
      return NextResponse.json({ error: 'No participants provided' }, { status: 400 });
    }

    // Check if a conversation with the same participants already exists
    const existingConversation = await db.collection('conversations').findOne({
      participants: { $all: participants },
    });

    if (existingConversation) {
      return NextResponse.json({ message: 'Conversation already exists', conversationId: existingConversation._id });
    }

    // If no existing conversation, create a new one
    const newConversation = await db.collection('conversations').insertOne({
      participants,
      createdAt: new Date(),
    });

    return NextResponse.json({ conversationId: newConversation.insertedId });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}
