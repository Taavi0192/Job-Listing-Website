// app/api/faculty/approved-mentorships/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Ensure the user is authenticated and is a faculty member
    if (!session || session.user.role !== 'faculty') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Fetch mentorships approved by this faculty member
    const mentorships = await db.collection('mentorships').find({ facultyId: new ObjectId(session.user.id) }).toArray();

    // Fetch student details
    const studentIds = mentorships.map((mentorship) => mentorship.studentId);
    const students = await db.collection('users').find({ _id: { $in: studentIds } }).toArray();

    // Map mentorships to include student details
    const approvedStudents = mentorships.map((mentorship) => {
      const student = students.find((s) => s._id.toString() === mentorship.studentId.toString());
      return {
        mentorshipId: mentorship._id,
        studentId: mentorship.studentId,
        studentName: student ? student.name : 'Unknown',
        studentEmail: student ? student.email : 'Unknown',
        approvedAt: mentorship.approvedAt,
      };
    });

    return NextResponse.json(approvedStudents);
  } catch (error) {
    console.error('Error fetching approved mentorships:', error);
    return NextResponse.json({ error: 'Failed to fetch approved mentorships' }, { status: 500 });
  }
}
