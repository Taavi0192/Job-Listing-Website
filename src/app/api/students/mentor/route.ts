// app/api/student/mentor/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Fetch the mentorship relationship for the student
    const mentorship = await db.collection('mentorships').findOne({
      studentId: new ObjectId(session.user.id),
    });

    console.log('Mentorship data:', mentorship); // Logging mentorship data

    if (!mentorship) {
      return NextResponse.json({ mentor: null });
    }

    // Fetch the mentor (faculty) details
    const mentor = await db.collection('users').findOne({
      _id: new ObjectId(mentorship.alumniId),
    });

    console.log('Mentor data:', mentor); // Logging mentor data

    if (!mentor) {
      return NextResponse.json({ mentor: null });
    }

    return NextResponse.json({
      mentor: {
        name: mentor.name,
        email: mentor.email,
        approvedAt: mentorship.approvedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching mentor:', error);
    return NextResponse.json({ error: 'Failed to fetch mentor' }, { status: 500 });
  }
}
