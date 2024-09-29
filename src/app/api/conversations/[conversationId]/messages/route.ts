import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request, { params }: { params: { conversationId: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const url = new URL(req.url);
    const conversationId = params.conversationId;
    const searchTerm = url.searchParams.get('searchTerm'); // Optional search query

    const query: any = { conversationId: new ObjectId(conversationId), sent: true };

    // If a search term is provided, add it to the query
    if (searchTerm) {
      query.content = { $regex: searchTerm, $options: 'i' }; // Case-insensitive search using regex
    }

    const messages = await db.collection('messages').find(query).toArray();

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
