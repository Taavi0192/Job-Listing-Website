import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function FacultyDashboard() {
  const session = await getServerSession(authOptions);

  // Debugging: Ensure session is being recognized
  console.log('Session on Faculty Dashboard:', session);

  // If the user is not authenticated, redirect to login page
  if (!session) {
    redirect('/login');
  }

  // If the user is not a faculty member, redirect to home page or an error page
  if (session.user.role !== 'faculty') {
    redirect('/');
  }

  return (
    <div>
      <h1>Faculty Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
    </div>
  );
}
