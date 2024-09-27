import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: Request) {
  const session: Session | null = await getServerSession(authOptions);

  const client = await clientPromise;
  const db = client.db();

  const isCompany = session?.user.role === 'company';

  // Companies see only their posted jobs
  const jobs = isCompany
    ? await db.collection('jobs').find({ companyId: session.user.id }).toArray()
    : await db.collection('jobs').find().toArray(); // Everyone else sees all jobs

  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  const session: Session | null = await getServerSession(authOptions);
  if (!session || session.user.role !== 'company') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const client = await clientPromise;
  const db = client.db();
  const jobData = await req.json();

  if (!jobData.title || !jobData.category || !jobData.location) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Insert job into the jobs collection with companyId attached
  const result = await db.collection('jobs').insertOne({
    title: jobData.title,
    company: session.user.name,
    category: jobData.category,
    location: jobData.location,
    description: jobData.description,
    companyId: session.user.id, // Associate job with the company
    createdAt: new Date(),
  });

  return NextResponse.json({ message: 'Job posted successfully', jobId: result.insertedId }, { status: 201 });
}
