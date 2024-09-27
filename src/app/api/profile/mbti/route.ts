import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const { mbtiResult } = await req.json();

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();
  await db.collection('users').updateOne(
    { email: session.user.email },
    { $set: { mbti: mbtiResult } }
  );

  return NextResponse.json({ message: 'MBTI result saved successfully!' });
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  // Fetch the user's profile based on their email
  const user = await db.collection('users').findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Return the mbti field from the user
  return NextResponse.json({ mbti: user.mbti });
}