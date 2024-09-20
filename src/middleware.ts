import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log('Token', token);

  // If there's no token (user is not authenticated), redirect to sign-in page
  if (!token) {
    console.log('xyz')
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Check the user role from the token and restrict access based on role
  const { role } = token;
  const pathname = req.nextUrl.pathname;

  console.log('user role from token', role)

  // Protect faculty routes
  if (pathname.startsWith('/faculty') && role !== 'faculty') {
    console.log('abcdef')
    return NextResponse.redirect(new URL('/access-denied', req.url));
  }

  // Protect company routes
  if (pathname.startsWith('/company') && role !== 'company') {
    return NextResponse.redirect(new URL('/access-denied', req.url));
  }

  // Protect ilc routes
  if (pathname.startsWith('/ilc') && role !== 'ilc') {
    return NextResponse.redirect(new URL('/access-denied', req.url));
  }

  // Protect alumni routes
  if (pathname.startsWith('/alumni') && role !== 'alumni') {
    return NextResponse.redirect(new URL('/access-denied', req.url));
  }

  // Protect student routes
  if (pathname.startsWith('/student') && role !== 'student') {
    return NextResponse.redirect(new URL('/access-denied', req.url));
  }

  // Add more role checks for other roles as needed

  return NextResponse.next();
}

// Define which paths you want the middleware to apply to
export const config = {
  matcher: ['/faculty/:path*', '/student/:path*', '/company/:path*', '/alumni/:path*', '/ilc/:path*'],
};
