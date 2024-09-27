import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '@/lib/mongodb';
// import User from '../../../../models/user';
import { compare } from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', required: true },
        password: { label: 'Password', type: 'password', required: true },
      },
      async authorize(credentials) {
        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db();

        // Find user by email
        const user = await db.collection('users').findOne({ email: credentials?.email });
        if (!user) {
          throw new Error('No user found with the given email.');
        }

        // Check password
        const isValid = await compare(credentials!.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password.');
        }

        // If authentication is successful, return the user
        return { id: user._id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Add role to token
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role; // Pass role to session
      session.user.id = token.id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
