
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);


  // Student-specific content
  return (
    <div>
      <h1>Student Dashboard</h1>
      <p>Welcome to the Student Dashboard, {session.user.name}!</p>
    </div>
  );
}
