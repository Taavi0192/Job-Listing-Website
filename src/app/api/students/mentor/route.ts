// app/api/student/mentor/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const studentId = url.searchParams.get('studentId');

    if (!ObjectId.isValid(studentId)) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Find the mentorship relationship for the student
    const mentorship = await db.collection('mentorships').findOne({
      studentId: new ObjectId(studentId),
    });

    if (!mentorship) {
      return NextResponse.json({ error: 'No mentor found' }, { status: 404 });
    }

    // Fetch the mentor (alumni) details
    const mentor = await db.collection('users').findOne({
      _id: new ObjectId(mentorship.alumniId),
    });

    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });
    }

    return NextResponse.json({ name: mentor.name, email: mentor.email });
  } catch (error) {
    console.error('Error fetching mentor:', error);
    return NextResponse.json({ error: 'Failed to fetch mentor' }, { status: 500 });
  }
}
