// app/faculty/supervisor-requests/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SupervisorRequests() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await fetch('/api/fyp-requests?facultyId=' + session?.user?.id);
      const data = await res.json();

      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        setRequests([]);  // Set to empty array if the response is not as expected
      }
    };

    fetchRequests();
  }, [session]);

  const handleDecision = async (requestId: string, decision: 'approve' | 'reject') => {
    const res = await fetch(`/api/fyp-requests/${requestId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision }),
    });

    if (res.ok) {
      setMessage(`Request ${decision}d successfully.`);
      setRequests(requests.filter((req) => req._id !== requestId)); // Remove handled request
    } else {
      setMessage('Error processing the decision.');
    }
  };

  return (
    <div>
      <h1>Supervisor Requests</h1>
      {message && <p>{message}</p>}
      {requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request._id}>
              <p>Student ID: {request.studentId}</p>
              <button onClick={() => handleDecision(request._id, 'approve')}>Approve</button>
              <button onClick={() => handleDecision(request._id, 'reject')} style={{ marginLeft: '10px' }}>Reject</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
