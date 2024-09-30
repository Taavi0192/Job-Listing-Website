// app/api/alumni/events/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const eventData = await req.json();

    // Ensure alumniId is valid
    if (!ObjectId.isValid(eventData.alumniId)) {
      return NextResponse.json({ error: 'Invalid alumni ID' }, { status: 400 });
    }

    // Insert event into the database
    await db.collection('events').insertOne({
      eventName: eventData.eventName,
      eventDate: new Date(eventData.eventDate),
      eventType: eventData.eventType,
      eventLink: eventData.eventLink || null,
      eventLocation: eventData.eventLocation || null,
      alumniId: new ObjectId(eventData.alumniId),
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Event scheduled successfully' });
  } catch (error) {
    console.error('Error scheduling event:', error);
    return NextResponse.json({ error: 'Failed to schedule event' }, { status: 500 });
  }
}
