
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';

export default async function AlumniDashboard() {
  const session = await getServerSession(authOptions);

  // Alumni-specific content
  return (
    <div>
      <h1>Alumni Dashboard</h1>
      <p>Welcome to the Alumni Dashboard, {session.user.name}!</p>
    </div>
  );
}
