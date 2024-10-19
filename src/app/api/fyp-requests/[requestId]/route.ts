// app/api/fyp-requests/[requestId]/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request, { params }: { params: { requestId: string } }) {
  try {
    const { decision } = await req.json();

    if (!['approve', 'reject'].includes(decision)) {
      return NextResponse.json({ error: 'Invalid decision' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    if (!ObjectId.isValid(params.requestId)) {
      return NextResponse.json({ error: 'Invalid Request ID' }, { status: 400 });
    }

    // Find the request details
    const request = await db.collection('fyp-requests').findOne({ _id: new ObjectId(params.requestId) });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (decision === 'approve') {
      // Store the supervisor-student relationship
      await db.collection('supervisor-student').insertOne({
        studentId: new ObjectId(request.studentId),
        facultyId: new ObjectId(request.facultyId),
        assignedAt: new Date(),
      });
    }

    // Delete the request after approval/rejection
    await db.collection('fyp-requests').deleteOne({ _id: new ObjectId(params.requestId) });

    return NextResponse.json({ message: `Request ${decision}d and ${decision === 'approve' ? 'student assigned to supervisor' : 'deleted'} successfully.` });
  } catch (error) {
    console.error('Error processing decision:', error);
    return NextResponse.json({ error: 'Failed to process decision' }, { status: 500 });
  }
}
