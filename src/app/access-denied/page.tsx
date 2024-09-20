'use client';
import { useRouter } from 'next/navigation';

export default function AccessDenied() {
  const router = useRouter();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Access Denied</h1>
      <p>You do not have permission to access this page.</p>
      <button 
        onClick={() => router.push('/')} 
        style={buttonStyle}>
        Go to Home
      </button>
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
