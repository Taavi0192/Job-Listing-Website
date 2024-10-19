// app/profile/student/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function StudentProfile() {
  const { data: session, status } = useSession();
  const [mentor, setMentor] = useState(null);
  const [supervisor, setSupervisor] = useState(null);

  useEffect(() => {
    if (status === 'authenticated') {
      // Fetch mentor (alumni) information
      const fetchMentor = async () => {
        try {
          const res = await fetch(`/api/students/mentor`);
          const data = await res.json();
          setMentor(data.mentor || null);
        } catch (error) {
          console.error('Error fetching mentor:', error);
        }
      };

      // Fetch supervisor (faculty) information
      const fetchSupervisor = async () => {
        try {
          const res = await fetch(`/api/supervisor/${session?.user?.id}`);
          const data = await res.json();
          setSupervisor(data.supervisor || null);
        } catch (error) {
          console.error('Error fetching supervisor:', error);
        }
      };

      fetchMentor();
      fetchSupervisor();
    }
  }, [status, session]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    return <p>Unauthorized</p>;
  }

  return (
    <div>
      <h1>Student Profile</h1>
      <p><strong>Name:</strong> {session.user.name}</p>
      <p><strong>Email:</strong> {session.user.email}</p>
      <p><strong>Role:</strong> {session.user.role}</p>

      {/* Mentor (Alumni) Information */}
      <h3>Mentor Information</h3>
      {mentor ? (
        <div>
          <p><strong>Name:</strong> {mentor.name}</p>
          <p><strong>Email:</strong> {mentor.email}</p>
          <p><strong>Approved At:</strong> {new Date(mentor.approvedAt).toLocaleString()}</p>
        </div>
      ) : (
        <p>No mentor selected yet.</p>
      )}

      {/* Supervisor (Faculty) Information */}
      <h3>Supervisor Information</h3>
      {supervisor ? (
        <div>
          <p><strong>Faculty Name:</strong> {supervisor.facultyName}</p>
          <p><strong>Faculty Email:</strong> {supervisor.facultyEmail}</p>
          <p><strong>Assigned At:</strong> {new Date(supervisor.assignedAt).toLocaleString()}</p>
        </div>
      ) : (
        <p>No supervisor assigned yet.</p>
      )}
    </div>
  );
}
