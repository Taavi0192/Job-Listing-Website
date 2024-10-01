// app/api/company/jobs/[jobId]/applications/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request, { params }: { params: { jobId: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();

    if (!ObjectId.isValid(params.jobId)) {
      return NextResponse.json({ error: 'Invalid Job ID' }, { status: 400 });
    }

    // Fetch all applications for the specified job
    const applications = await db.collection('applications').find({ jobId: new ObjectId(params.jobId) }).toArray();

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return NextResponse.json({ error: 'Failed to fetch job applications' }, { status: 500 });
  }
}
