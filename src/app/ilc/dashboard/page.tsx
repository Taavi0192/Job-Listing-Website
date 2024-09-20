
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';

export default async function ILCDashboard() {
  const session = await getServerSession(authOptions);


  // ILC-specific content
  return (
    <div>
      <h1>ILC Dashboard</h1>
      <p>Welcome to the ILC Dashboard, {session.user.name}!</p>
    </div>
  );
}
