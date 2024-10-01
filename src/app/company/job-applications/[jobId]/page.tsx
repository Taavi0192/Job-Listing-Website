// app/company/job-applications/[jobId]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function JobApplications({ params }: { params: { jobId: string } }) {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await fetch(`/api/company/jobs/${params.jobId}/applications`);
      const data = await res.json();
      setApplications(data);
    };

    fetchApplications();
  }, [params.jobId]);

  const handleDecision = async (applicationId: string, decision: 'approve' | 'reject') => {
    const res = await fetch(`/api/company/jobs/${params.jobId}/applications/${applicationId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision }),
    });

    if (res.ok) {
      setMessage(`Application ${decision}d successfully.`);
      // Reload applications to reflect updated status
      const updatedApplications = applications.filter(app => app._id !== applicationId);
      setApplications(updatedApplications);
    } else {
      setMessage('Error processing the decision.');
    }
  };

  return (
    <div>
      <h1>Job Applications for Job ID: {params.jobId}</h1>
      {message && <p>{message}</p>}
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul>
          {applications.map((application) => (
            <li key={application._id}>
              <p><strong>Applicant:</strong> {application.applicantName} ({application.applicantEmail})</p>
              <p><strong>Applied At:</strong> {new Date(application.appliedAt).toLocaleString()}</p>
              <button onClick={() => handleDecision(application._id, 'approve')}>Approve</button>
              <button onClick={() => handleDecision(application._id, 'reject')} style={{ marginLeft: '10px' }}>Reject</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
