import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import '../theme.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      const data = await registerUser(username, email, password);
      if (data?.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('email', data.user.email);
        navigate('/dashboard');
      } else {
        setError(data?.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="brand-mark">
        <span role="img" aria-label="steering-wheel">🛞</span>
      </div>
      <h2 style={{ textAlign: 'center' }}>Create your account</h2>
      <p className="tagline" style={{ textAlign: 'center' }}>Join the community of classic car enthusiasts.</p>
      <hr className="hr" />

      {error && <p className="error" style={{ marginBottom: 12 }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Pick a display name"
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Password:</label>
          <div className="pw-row">
            <input
              id="password"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
            />
            <button
              type="button"
              className="pw-toggle"
              aria-label={showPw ? 'Hide password' : 'Show password'}
              onClick={() => setShowPw((s) => !s)}
            >
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, marginTop: 16 }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create Account'}
          </button>
          <Link className="btn-outline" to="/">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
