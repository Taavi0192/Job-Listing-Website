import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs'; // Hash passwords before saving
import clientPromise from '../../../../lib/mongodb';
// import User from '../../../../models/user';

export async function POST(request: Request) {
  const { name, email, password, role } = await request.json();

  // Check if user already exists
  const client = await clientPromise;
  const db = client.db();

  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = await hash(password, 12);

  // Create new user
  const newUser = {
    name,
    email,
    password: hashedPassword, // Save hashed password
    role,
  };

  // Insert into MongoDB
  await db.collection('users').insertOne(newUser);

  return NextResponse.json({ message: 'User created successfully' });
}
