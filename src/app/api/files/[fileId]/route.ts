import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId, GridFSBucket } from 'mongodb';

export async function GET(req: Request, { params }: { params: { fileId: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    const fileId = new ObjectId(params.fileId);

    const file = await db.collection('uploads.files').findOne({ _id: fileId });

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const downloadStream = bucket.openDownloadStream(fileId);

    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    // Set correct content type from the stored metadata
    const contentType = file.metadata?.contentType || 'application/octet-stream';

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType, // Use the correct MIME type (e.g., application/pdf for PDFs)
        'Content-Disposition': `attachment; filename="${file.filename}"`, // Optional: Suggest filename for download
      },
    });
  } catch (error) {
    console.error('Failed to fetch file:', error);
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}
