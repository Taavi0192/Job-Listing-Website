// app/student/mentorship/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Mentorship() {
  const { data: session } = useSession();
  const [alumni, setAlumni] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAlumni = async () => {
      const res = await fetch('/api/users'); // Fetch all alumni
      const data = await res.json();
      setAlumni(data);
    };

    fetchAlumni();
  }, []);

  const handleSelectMentor = async () => {
    const res = await fetch('/api/students/mentorship', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alumniId: selectedAlumni }),
    });

    if (res.ok) {
      setMessage('Mentor selected successfully!');
    } else {
      setMessage('Error selecting mentor.');
    }
  };

  return (
    <div>
      <h1>Select an Alumni as Your Mentor</h1>
      <select value={selectedAlumni} onChange={(e) => setSelectedAlumni(e.target.value)}>
        <option value="" disabled>Select an alumni</option>
        {alumni.map((alumnus) => (
          <option key={alumnus._id} value={alumnus._id}>
            {alumnus.name} ({alumnus.email})
          </option>
        ))}
      </select>
      <button onClick={handleSelectMentor} style={{ marginLeft: '10px' }}>
        Select Mentor
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
