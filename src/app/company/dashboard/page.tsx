'use client';
import { signOut } from 'next-auth/react';

export default function CompanyDashboard() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Company Dashboard</h1>
      <p>Welcome, Company Member!</p>
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
