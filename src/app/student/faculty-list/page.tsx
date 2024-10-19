// app/student/faculty-list/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function FacultyList() {
  const { data: session } = useSession();
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchFacultyMembers = async () => {
      const res = await fetch('/api/faculty');
      const data = await res.json();
      setFacultyMembers(data);
    };

    fetchFacultyMembers();
  }, []);

  const sendSupervisorRequest = async (facultyId: string) => {
    const res = await fetch('/api/fyp-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: session?.user?.id,
        facultyId: facultyId,
      }),
    });

    if (res.ok) {
      setMessage('Request sent successfully!');
    } else {
      setMessage('Failed to send request.');
    }
  };

  return (
    <div>
      <h1>Available Faculty Members</h1>
      {message && <p>{message}</p>}
      {facultyMembers.length === 0 ? (
        <p>No faculty members available.</p>
      ) : (
        <ul>
          {facultyMembers.map((faculty) => (
            <li key={faculty._id}>
              <p>{faculty.name}</p>
              <button onClick={() => sendSupervisorRequest(faculty._id)}>Send Request</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
