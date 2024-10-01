'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JobListings() {
  const { data: session, status } = useSession();
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
    router.push(`/jobs/${jobId}`); // Redirect to job details page to apply
  };

  const handleRecommend = (jobId: string) => {
    // Logic to recommend a job to a student
    router.push(`/faculty/recommend/${jobId}`); // Redirect to recommendation form
  };

  const handlePostJob = () => {
    if (isCompany){
      router.push('/company/Job-Post'); // Redirect to job posting form
    }
    if (isAlumni){
      router.push('/alumni/jobs'); // Redirect to job posting form
    }
  };

  const handleViewRecommendations = (jobId: string) => {
    router.push(`/recommendations/${jobId}`); // Redirect to recommendations page for this job
  };

  const handleViewApplications = (jobId: string) => {
    router.push(`/company/job-applications/${jobId}`); // Redirect to recommendations page for this job
  };

  const isStudentOrAlumni = session?.user.role === 'student' || session?.user.role === 'alumni';
  const isCompany = session?.user.role === 'company';
  const isFaculty = session?.user.role === 'faculty';
  const isAlumni = session?.user.role === 'alumni';

  return (
    <div>
      <h1>Job Listings</h1>

      {/* Conditionally render the Post Job button for companies */}
      {isCompany && <button onClick={handlePostJob}>Post New Job</button>}

      {/* Conditionally render the Post Job button for companies */}
      {isAlumni && <button onClick={handlePostJob}>Post New Job</button>}

      {jobs.map((job) => (
        <div key={job._id}>
          <h3>{job.title}</h3>
          <p>{job.company}</p>
          <p>{job.category}</p>
          <p>{job.location}</p>
          
          {/* Conditionally render different actions based on user role */}
          {isStudentOrAlumni && <button onClick={() => handleApply(job._id)}>Apply Now</button>}
          {isCompany && session.user.id === job.companyId && (
            <button onClick={() => handleViewRecommendations(job._id)}>
              View Recommendations
            </button>
          )}
          {isCompany && session.user.id === job.companyId && (
            <button onClick={() => handleViewApplications(job._id)}>
              View Applications
            </button>
          )}
          {isFaculty && <button onClick={() => handleRecommend(job._id)}>Recommend Job</button>}
        </div>
      ))}
    </div>
  );
}
