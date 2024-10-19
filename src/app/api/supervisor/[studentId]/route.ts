// app/api/supervisor/[studentId]/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request, { params }: { params: { studentId: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Validate student ID
    if (!ObjectId.isValid(params.studentId)) {
      console.log('Invalid Student ID:', params.studentId);
      return NextResponse.json({ error: 'Invalid Student ID' }, { status: 400 });
    }

    // Find the supervisor-student relationship for the student
    const supervisor = await db.collection('supervisor-student').findOne({
      studentId: new ObjectId(params.studentId),
    });

    console.log('Supervisor data:', supervisor); // Logging supervisor data

    // If no supervisor found, return null
    if (!supervisor) {
      return NextResponse.json({ supervisor: null });
    }

    // Fetch the faculty details based on the facultyId
    const faculty = await db.collection('users').findOne({
      _id: new ObjectId(supervisor.facultyId),
    });

    console.log('Faculty data:', faculty); // Logging faculty data

    // If no faculty details found, return null
    if (!faculty) {
      return NextResponse.json({ supervisor: null });
    }

    // Return supervisor and faculty details
    return NextResponse.json({
      supervisor: {
        facultyId: supervisor.facultyId,
        facultyName: faculty.name,
        facultyEmail: faculty.email,
        assignedAt: supervisor.assignedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching supervisor:', error);
    return NextResponse.json({ error: 'Failed to fetch supervisor' }, { status: 500 });
  }
}
