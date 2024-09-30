// app/api/alumni/success-story/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Fetch the success story for the authenticated alumni
    const successStory = await db.collection('alumniSuccessStories').findOne({
      alumniId: new ObjectId(session.user.id),
    });

    if (!successStory) {
      return NextResponse.json({ successStory: '' });
    }

    return NextResponse.json({ successStory: successStory.successStory });
  } catch (error) {
    console.error('Error fetching success story:', error);
    return NextResponse.json({ error: 'Failed to fetch success story' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const { successStory } = await req.json();

    // Validate the success story content
    if (!successStory || successStory.trim().length === 0) {
      return NextResponse.json({ error: 'Success story cannot be empty' }, { status: 400 });
    }

    // Update or insert the success story for the authenticated alumni
    await db.collection('alumniSuccessStories').updateOne(
      { alumniId: new ObjectId(session.user.id) },
      {
        $set: {
          successStory: successStory.trim(),
          updatedAt: new Date(),
        },
      },
      { upsert: true } // Insert if it doesn't exist, otherwise update
    );

    return NextResponse.json({ message: 'Success story updated successfully' });
  } catch (error) {
    console.error('Error posting success story:', error);
    return NextResponse.json({ error: 'Failed to update success story' }, { status: 500 });
  }
}
