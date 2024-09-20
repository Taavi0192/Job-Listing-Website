'use client';
import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Debugging: Log session status and session data
  console.log('Session Status:', status);
  console.log('Session Data:', session);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role) {
      const role = session?.user.role;
      console.log('User Role:', role);

      switch (role) {
        case 'student':
          router.push('/student/dashboard');
          break;
        case 'faculty':
          console.log('abc')
          router.push('/faculty/dashboard');
          router.refresh()
          break;
        case 'company':
          router.push('/company/dashboard');
          break;
        case 'alumni':
          router.push('/alumni/dashboard');
          break;
        case 'ilc':
          router.push('/ilc/dashboard');
          break;
        default:
          router.push('/');
      }
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    console.log(result);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.ok) {
      console.log('Login successful');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={inputStyle}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Login
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: '10px',
  margin: '10px 0',
  width: '100%',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

export default LoginPage;
