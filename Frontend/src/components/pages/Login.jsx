import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const field = {
  display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16
};

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      nav('/');
    } catch (e) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, background: 'rgba(255,255,255,0.08)', borderRadius: 16, color: 'white' }}>
      <h2>Login</h2>
      {error && <div style={{ color: 'salmon', marginBottom: 12 }}>{error}</div>}
      <form onSubmit={onSubmit}>
        <div style={field}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div style={field}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button disabled={loading} type="submit">{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <p style={{ marginTop: 12 }}>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}

