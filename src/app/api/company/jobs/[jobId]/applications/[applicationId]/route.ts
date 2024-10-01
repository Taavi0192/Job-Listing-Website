// app/api/company/jobs/[jobId]/applications/[applicationId]/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request, { params }: { params: { jobId: string, applicationId: string } }) {
  try {
    const { decision } = await req.json();

    if (!['approve', 'reject'].includes(decision)) {
      return NextResponse.json({ error: 'Invalid decision' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    if (!ObjectId.isValid(params.jobId) || !ObjectId.isValid(params.applicationId)) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
    }

    // Update the application status (approve/reject)
    const result = await db.collection('applications').updateOne(
      { _id: new ObjectId(params.applicationId) },
      { $set: { status: decision } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (decision === 'approve') {
      // If approved, delete the job from the database
      await db.collection('jobs').deleteOne({ _id: new ObjectId(params.jobId) });
    }

    // Notify the applicant
    const application = await db.collection('applications').findOne({ _id: new ObjectId(params.applicationId) });
    if (application) {
      const applicantEmail = application.applicantEmail;
      console.log(`Notifying ${applicantEmail}: Your application was ${decision}.`);
    }

    return NextResponse.json({ message: `Application ${decision}d successfully.` });
  } catch (error) {
    console.error('Error processing application decision:', error);
    return NextResponse.json({ error: 'Failed to process decision' }, { status: 500 });
  }
}
