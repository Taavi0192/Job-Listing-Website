'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to the User Management System</h1>
      <p>Select your role to sign up:</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        <button onClick={() => router.push('/signup/student')} style={buttonStyle}>
          Student Sign-Up
        </button>
        <button onClick={() => router.push('/signup/faculty')} style={buttonStyle}>
          Faculty Sign-Up
        </button>
        <button onClick={() => router.push('/signup/company')} style={buttonStyle}>
          Company Sign-Up
        </button>
        <button onClick={() => router.push('/signup/alumni')} style={buttonStyle}>
          Alumni Sign-Up
        </button>
        <button onClick={() => router.push('/signup/ilc')} style={buttonStyle}>
          ILC Head Sign-Up
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};
