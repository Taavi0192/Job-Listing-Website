// app/alumni/jobs/page.tsx (Alumni Job Portal)
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AlumniJobPortal() {
  const { data: session } = useSession();
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('full-time'); // Full-time, part-time, etc.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const jobData = {
      jobTitle,
      jobDescription,
      location,
      jobType,
      alumniId: session?.user?.id,
    };

    const res = await fetch('/api/alumni/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    });

    if (res.ok) {
      alert('Job posted successfully!');
    } else {
      alert('Error posting job.');
    }
  };

  return (
    <div>
      <h1>Alumni Job Portal</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Job Title:
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Job Description:
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Job Type:
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
        </label>
        <br />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}
