// import { NextApiRequest, NextApiResponse } from 'next';
// import { hash } from 'bcryptjs';
// import clientPromise from '../../lib/mongodb';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { name, email, password, role } = req.body;

//     try {
//       const client = await clientPromise;
//       const db = client.db();

//       const hashedPassword = await hash(password, 12);
//       const newUser = {
//         name,
//         email,
//         password: hashedPassword,
//         role, // This could be 'student', 'faculty', 'company', etc.
//         profile: { bio: '', image: '' },
//         activity: [],
//       };

//       const result = await db.collection('users').insertOne(newUser);
//       res.status(201).json({ message: 'User created!', userId: result.insertedId });
//     } catch (error) {
//       res.status(500).json({ message: 'Something went wrong.' });
//     }
//   } else {
//     res.status(405).json({ message: 'Only POST requests allowed' });
//   }
// }
