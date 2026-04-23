import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@cms.local');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!loading && user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
    return <Navigate to="/student" replace />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const u = await login(email, password);
      if (u.role === 'admin') navigate('/admin');
      else if (u.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">C</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>CollegeMS</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Management System</div>
          </div>
        </div>
        <h1>Welcome back</h1>
        <p className="sub">Sign in with your institutional account to continue.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={onSubmit}>
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            className="inp"
            type="email"
            autoComplete="username"
            placeholder="you@institution.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            className="inp"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn" disabled={busy}>
            {busy ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderTopColor: '#fff', borderColor: 'rgba(255,255,255,0.3)' }} />
                Signing in…
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p className="muted" style={{ margin: '0 0 0.5rem' }}>
            Default: <strong>admin@cms.local</strong> / <strong>Admin@123</strong>
          </p>
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
