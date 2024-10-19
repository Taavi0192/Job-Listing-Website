// app/api/fyp-requests/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const { studentId, facultyId } = await req.json();

    const client = await clientPromise;
    const db = client.db();

    if (!ObjectId.isValid(studentId) || !ObjectId.isValid(facultyId)) {
      return NextResponse.json({ error: 'Invalid student or faculty ID' }, { status: 400 });
    }

    // Insert the request into the 'fyp-requests' collection
    await db.collection('fyp-requests').insertOne({
      studentId: new ObjectId(studentId),
      facultyId: new ObjectId(facultyId),
      status: 'pending',
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Request sent successfully' });
  } catch (error) {
    console.error('Error sending request:', error);
    return NextResponse.json({ error: 'Failed to send request' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const facultyId = url.searchParams.get('facultyId');

    if (!ObjectId.isValid(facultyId)) {
      return NextResponse.json({ error: 'Invalid Faculty ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Fetch all requests sent to the specified faculty member
    const requests = await db.collection('fyp-requests').find({ facultyId: new ObjectId(facultyId) }).toArray();

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching supervisor requests:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}