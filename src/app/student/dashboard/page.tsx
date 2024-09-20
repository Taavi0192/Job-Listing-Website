'use client';
import { signOut } from 'next-auth/react';

export default function StudentDashboard() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Student Dashboard</h1>
      <p>Welcome, Student Member!</p>
      <button onClick={() => signOut()} style={buttonStyle}>
        Logout
      </button>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#d9534f',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};
