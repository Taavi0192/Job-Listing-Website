'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Profile() {
  const { data: session, status } = useSession(); // Use status to determine loading state
  const router = useRouter();
  const [mbtiResult, setMbtiResult] = useState('');

  useEffect(() => {
    // Redirect to login if the user is unauthenticated
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (status === 'authenticated') {
      // Fetch the saved MBTI result (mocked here, replace with API call)
      const fetchMbtiResult = async () => {
        try {
          const res = await fetch('/api/profile/mbti');
          const data = await res.json();
          setMbtiResult(data.mbti || 'No result yet');
        } catch (error) {
          console.error('Error fetching MBTI result:', error);
        }
      };

      fetchMbtiResult();
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // Only render the profile when authenticated
  return (
    <div>
      <h1>Profile</h1>
      {session && (
        <>
          <p>Name: {session.user.name}</p>
          <p>Email: {session.user.email}</p>
          <p>Role: {session.user.role}</p>

          <h3>Your MBTI Type: {mbtiResult}</h3>

          <button
            onClick={() => router.push('/mbti-test')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '20px',
            }}
          >
            Take MBTI Test
          </button>
        </>
      )}
    </div>
  );
}
