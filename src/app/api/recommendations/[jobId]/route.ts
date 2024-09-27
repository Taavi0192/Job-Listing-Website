import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request, { params }: { params: { jobId: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Debugging: Check if jobId is correctly converted to ObjectId
    console.log('Job ID:', params.jobId);

    // Fetch all recommendations for the given jobId
    const recommendations = await db.collection('recommendations').aggregate([
      { $match: { jobId: params.jobId } },
      {
        $lookup: {
          from: 'users',
          localField: 'facultyId',
          foreignField: '_id',
          as: 'faculty',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student',
        },
      },
      {
        $project: {
          jobId: 1,
          reason: 1,
          recommendedAt: 1,
          'faculty.name': { $arrayElemAt: ['$faculty.name', 0] },  // Ensure name is properly accessed
          'faculty.email': { $arrayElemAt: ['$faculty.email', 0] }, // Access first element in array
          'student.name': { $arrayElemAt: ['$student.name', 0] },   // Same for student
          'student.email': { $arrayElemAt: ['$student.email', 0] }, // Access email
        },
      },
    ]).toArray();

    // Debugging: Log the recommendations returned
    console.log('Recommendations:', recommendations);

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}
