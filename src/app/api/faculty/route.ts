// app/api/faculty/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch all users with a role of 'faculty'
    const facultyMembers = await db.collection('users').find({ role: 'faculty' }).toArray();

    return NextResponse.json(facultyMembers);
  } catch (error) {
    console.error('Error fetching faculty members:', error);
    return NextResponse.json({ error: 'Failed to fetch faculty members' }, { status: 500 });
  }
}
