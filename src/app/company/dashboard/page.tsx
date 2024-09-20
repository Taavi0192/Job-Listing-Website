
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';

export default async function CompanyDashboard() {
  const session = await getServerSession(authOptions);

  // Company-specific content
  return (
    <div>
      <h1>Company Dashboard</h1>
      <p>Welcome to the Company Dashboard, {session.user.name}!</p>
    </div>
  );
}
