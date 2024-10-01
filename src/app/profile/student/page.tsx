// app/profile/student/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function StudentProfile() {
  const { data: session } = useSession();
  const [mentor, setMentor] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchMentor = async () => {
        const res = await fetch(`/api/students/mentor?studentId=${session.user.id}`);
        const data = await res.json();
        setMentor(data);
      };

      fetchMentor();
    }
  }, [session]);

  return (
    <div>
      <h1>Student Profile</h1>
      <p>Name: {session?.user?.name}</p>
      <p>Email: {session?.user?.email}</p>

      <h3>Mentor Information</h3>
      {mentor ? (
        <p>Mentor: {mentor.name} ({mentor.email})</p>
      ) : (
        <p>No mentor selected yet.</p>
      )}
    </div>
  );
}
