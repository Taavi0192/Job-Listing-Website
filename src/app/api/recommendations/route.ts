import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// POST request to recommend a student
export async function POST(req: Request) {
  try {
    const session: Session | null = await getServerSession(authOptions);
    if (!session || session.user.role !== 'faculty') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db();
    const { jobId, studentId, reason } = await req.json();

    if (!jobId || !studentId || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert recommendation into the recommendations collection
    const recommendation = {
      facultyId: session.user.id,
      jobId: jobId,
      studentId: studentId,
      reason,
      recommendedAt: new Date(),
    };

    await db.collection('recommendations').insertOne(recommendation);
    return NextResponse.json({ message: 'Recommendation submitted successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit recommendation' }, { status: 500 });
  }
}
