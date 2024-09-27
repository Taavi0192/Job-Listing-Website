'use client';
import { useState, useEffect } from 'react';

export default function Recommendations({ params }: { params: { jobId: string } }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const res = await fetch(`/api/recommendations/${params.jobId}`);
      const data = await res.json();
      setRecommendations(data);
    };

    fetchRecommendations();
  }, [params.jobId]);

  return (
    <div>
      <h1>Recommendations for Job</h1>
      {recommendations.length === 0 ? (
        <p>No recommendations for this job yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Faculty Member</th>
              <th>Recommended Student/Alumni</th>
              <th>Reason</th>
              <th>Recommended At</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec, index) => (
              <tr key={index}>
                <td>{rec.faculty[0]?.name || 'Unknown'}</td>
                <td>{rec.student[0]?.name || 'Unknown'}</td>
                <td>{rec.reason}</td>
                <td>{new Date(rec.recommendedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
