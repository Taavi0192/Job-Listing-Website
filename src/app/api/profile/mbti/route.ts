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
