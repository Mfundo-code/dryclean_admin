import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, saveToken } from './api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await login(username, password);
      saveToken(data.access, data.refresh, data.username);
      navigate('/admin', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        <label style={styles.label}>Username</label>
        <input
          style={styles.input}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          required
        />
        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.btn} type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#F3F4F6',
  },
  card: {
    background: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,.12)',
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    color: '#1E3A8A',
    marginBottom: '28px',
    textAlign: 'center',
  },
  label: {
    fontSize: '0.85rem',
    color: '#6B7280',
    marginBottom: '4px',
  },
  input: {
    padding: '11px 12px',
    marginBottom: '18px',
    border: '1px solid #E5E7EB',
    borderRadius: '6px',
    fontSize: '1rem',
    outline: 'none',
  },
  error: {
    color: '#EF4444',
    marginBottom: '12px',
    fontSize: '0.9rem',
  },
  btn: {
    padding: '12px',
    background: '#1E3A8A',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '4px',
  },
};