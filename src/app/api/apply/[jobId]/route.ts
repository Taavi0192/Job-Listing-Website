import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// POST request to apply to a job
export async function POST(req: Request, { params }: { params: { jobId: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const { applicantName, applicantEmail, resumeUrl } = await req.json();

    // Validate required fields
    if (!applicantName || !applicantEmail || !resumeUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if the jobId is valid
    const jobId = params.jobId;
    const job = await db.collection('jobs').findOne({ _id: new ObjectId(jobId) });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Insert the application into the 'applications' collection
    const result = await db.collection('applications').insertOne({
      jobId: jobId,
      applicantName,
      applicantEmail,
      resumeUrl,
      appliedAt: new Date(),
    });

    return NextResponse.json({ message: 'Application submitted successfully', applicationId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ error: 'Failed to apply for job' }, { status: 500 });
  }
}
