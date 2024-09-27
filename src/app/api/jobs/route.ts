import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; // Import the MongoDB connection

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(); // Get the default database

    const jobs = await db.collection('jobs').find().toArray(); // Fetch all jobs
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch job listings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(); // Get the default database

    const jobData = await req.json();

    // Validate required fields
    if (!jobData.title || !jobData.company || !jobData.category || !jobData.location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert the new job into the 'jobs' collection
    const result = await db.collection('jobs').insertOne({
      title: jobData.title,
      company: jobData.company,
      category: jobData.category,
      location: jobData.location,
      description: jobData.description,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Job posted successfully', jobId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error posting job:', error);
    return NextResponse.json({ error: 'Failed to post job' }, { status: 500 });
  }
}
