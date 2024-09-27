import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET request to fetch job details by jobId
export async function GET(req: Request, { params }: { params: { jobId: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const job = await db.collection('jobs').findOne({ _id: new ObjectId(params.jobId) });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch job details' }, { status: 500 });
  }
}
