
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';

export default async function FacultyDashboard() {
  const session = await getServerSession(authOptions);


  // Faculty-specific content
  return (
    <div>
      <h1>Faculty Dashboard</h1>
      <p>Welcome to the Faculty Dashboard, {session.user.name}!</p>
    </div>
  );
}
