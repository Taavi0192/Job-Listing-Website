import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const session = await getServerSession();
    const url = new URL(req.url);
    const participantId = url.searchParams.get('participantId');

    if (!session || !participantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!ObjectId.isValid(session.user.id) || !ObjectId.isValid(participantId)) {
      return NextResponse.json({ error: 'Invalid user or participant ID' }, { status: 400 });
    }

    // Check if there's an existing conversation between the current user and the selected participant
    const existingConversation = await db.collection('conversations').findOne({
      participants: { $all: [session.user.id, participantId] },
    });

    if (existingConversation) {
      return NextResponse.json({ conversationId: existingConversation._id });
    } else {
      return NextResponse.json({ conversationId: null });
    }
  } catch (error) {
    console.error('Error checking conversation:', error);
    return NextResponse.json({ error: 'Failed to check conversation' }, { status: 500 });
  }
}
