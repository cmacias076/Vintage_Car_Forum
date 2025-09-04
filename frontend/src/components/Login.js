import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import '../theme.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in both fields');
      return;
    }
    try {
      setLoading(true);
      const data = await loginUser(email, password);
      if (data?.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('email', data.user.email);
        navigate('/dashboard');
      } else {
        setError(data?.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('demo@example.com');
    setPassword('Passw0rd!');
  };

  return (
    <div className="auth-form">
      <div className="brand-mark">
        <span role="img" aria-label="steering-wheel">🛞</span>
      </div>
      <h2 style={{ textAlign: 'center' }}>Vintage Car Forum</h2>
      <p className="tagline" style={{ textAlign: 'center' }}>Classic rides, timeless answers.</p>
      <hr className="hr" />

      {error && <p className="error" style={{ marginBottom: 12 }}>{error}</p>}

      <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
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
            {loading ? 'Logging in…' : 'Login'}
          </button>
          <button type="button" className="btn-outline" onClick={fillDemo}>
            Use Demo Account
          </button>
        </div>
      </form>

      <p style={{ textAlign: 'center', marginTop: 18 }}>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
