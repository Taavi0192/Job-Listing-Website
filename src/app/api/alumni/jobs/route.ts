// app/api/alumni/jobs/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Ensure user is authenticated and an alumni
    if (!session || session.user.role !== 'alumni') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const { jobTitle, jobDescription, location, jobType, alumniId } = await req.json();

    if (!jobTitle || !jobDescription || !location || !jobType) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await db.collection('jobs').insertOne({
      jobTitle,
      jobDescription,
      location,
      jobType,
      postedBy: alumniId,
      posterType: 'alumni', // Mark this as an alumni-posted job
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Job posted successfully' });
  } catch (error) {
    console.error('Error posting job:', error);
    return NextResponse.json({ error: 'Failed to post job' }, { status: 500 });
  }
}
