'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RecommendJob({ params }: { params: { jobId: string } }) {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [reason, setReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const submitRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId: params.jobId, // Automatically pass the jobId from the URL params
        studentId,
        reason,
      }),
    });

    if (res.ok) {
      setSuccessMessage('Recommendation submitted successfully');
      setStudentId('');
      setReason('');
    } else {
      setSuccessMessage('Failed to submit recommendation');
    }
  };

  return (
    <div>
      <h1>Recommend a Student for this Job</h1>
      <form onSubmit={submitRecommendation}>
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
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
