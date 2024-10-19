// app/faculty/approved-students/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function ApprovedStudents() {
  const { data: session, status } = useSession();
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchApprovedStudents = async () => {
        const res = await fetch('/api/faculty/approved-mentorships');
        const data = await res.json();

        if (Array.isArray(data)) {
          setApprovedStudents(data);
        } else {
          setApprovedStudents([]);
        }
      };

      fetchApprovedStudents();
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
      <h1>Approved Students</h1>
      {message && <p>{message}</p>}
      {approvedStudents.length === 0 ? (
        <p>No approved students yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student Email</th>
              <th>Approved At</th>
            </tr>
          </thead>
          <tbody>
            {approvedStudents.map((student) => (
              <tr key={student.studentId}>
                <td>{student.studentName}</td>
                <td>{student.studentEmail}</td>
                <td>{new Date(student.approvedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
