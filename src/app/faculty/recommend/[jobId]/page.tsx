'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RecommendJob({ params }: { params: { jobId: string } }) {
  const router = useRouter();
  const [students, setStudents] = useState([]); // Store the list of students
  const [selectedStudentId, setSelectedStudentId] = useState(''); // Store the selected student
  const [reason, setReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch the list of students when the component loads
  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
    };

    fetchStudents();
  }, []);

  const submitRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId: params.jobId, // Automatically pass the jobId from the URL params
        studentId: selectedStudentId, // Pass the selected student's ID
        reason,
      }),
    });

    if (res.ok) {
      setSuccessMessage('Recommendation submitted successfully');
      setSelectedStudentId('');
      setReason('');
    } else {
      setSuccessMessage('Failed to submit recommendation');
    }
  };

  return (
    <div>
      <h1>Recommend a Student for this Job</h1>
      <form onSubmit={submitRecommendation}>
        {/* Dropdown for selecting a student */}
        <label htmlFor="student">Select a Student:</label>
        <select
          id="student"
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          required
        >
          <option value="" disabled>Select a student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} ({student.email})
            </option>
          ))}
        </select>

        {/* Reason for recommendation */}
        <textarea
          placeholder="Reason for recommendation"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
        <button type="submit">Submit Recommendation</button>
      </form>

      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}
