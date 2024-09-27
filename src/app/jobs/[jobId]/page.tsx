'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function JobDetails({ params }: { params: { jobId: string } }) {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      const res = await fetch(`/api/jobs/${params.jobId}`);
      const data = await res.json();
      setJob(data);
    };

    fetchJobDetails();
  }, [params.jobId]);

  const applyToJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/apply/${params.jobId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        applicantName,
        applicantEmail,
        resumeUrl,
      }),
    });

    if (res.ok) {
      alert('Applied successfully');
      router.push('/jobs'); // Redirect to job listings after successful application
    } else {
      alert('Failed to apply');
    }
  };

  if (!job) return <p>Loading job details...</p>;

  return (
    <div>
      <h1>{job.title}</h1>
      <p>{job.company}</p>
      <p>{job.category}</p>
      <p>{job.location}</p>
      <p>{job.description}</p>

      {/* Application Form */}
      <form onSubmit={applyToJob}>
        <input
          type="text"
          placeholder="Your Name"
          value={applicantName}
          onChange={(e) => setApplicantName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={applicantEmail}
          onChange={(e) => setApplicantEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Resume URL"
          value={resumeUrl}
          onChange={(e) => setResumeUrl(e.target.value)}
          required
        />
        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
}
