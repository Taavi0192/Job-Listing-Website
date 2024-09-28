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

    // Ensure participants array is provided
    if (!participants || participants.length === 0) {
      return NextResponse.json({ error: 'No participants provided' }, { status: 400 });
    }

    // Create a new conversation with the selected participants
    const newConversation = await db.collection('conversations').insertOne({
      participants,
      createdAt: new Date(),
    });

    // Return the updated list of conversations
    const updatedConversations = await db.collection('conversations').find({ participants: { $in: participants } }).toArray();
    return NextResponse.json(updatedConversations);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}