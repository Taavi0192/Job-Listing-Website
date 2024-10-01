// app/api/student/mentorship/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Ensure the user is authenticated and a student
    if (!session || session.user.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { alumniId } = await req.json();

    if (!ObjectId.isValid(alumniId)) {
      return NextResponse.json({ error: 'Invalid alumni ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Store the mentorship relationship
    await db.collection('mentorships').insertOne({
      studentId: new ObjectId(session.user.id),
      alumniId: new ObjectId(alumniId),
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Mentor selected successfully!' });
  } catch (error) {
    console.error('Error selecting mentor:', error);
    return NextResponse.json({ error: 'Failed to select mentor' }, { status: 500 });
  }
}
