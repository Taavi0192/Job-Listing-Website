'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JobListings() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data);
    };

    fetchJobs();
  }, []);

  const handleApply = (jobId: string) => {
    // Redirect to the job details page
    router.push(`/jobs/${jobId}`);
  };

  return (
    <div>
      <h1>Job Listings</h1>
      {jobs.map((job) => (
        <div key={job._id}>
          <h3>{job.title}</h3>
          <p>{job.company}</p>
          <p>{job.category}</p>
          <p>{job.location}</p>
          <button onClick={() => handleApply(job._id)}>Apply</button>
        </div>
      ))}
    </div>
  );
}
