import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../contexts/AuthContext';
import api from '../utils/api';

// Demo credentials for each role
const DEMO_USERS = [
  { email: 'ultra@sac.com',   password: 'ultra123',   role: ROLES.ULTRA_SUPER_ADMIN, name: 'Ultra Admin' },
  { email: 'super@sac.com',   password: 'super123',   role: ROLES.SUPER_ADMIN,       name: 'Super Admin' },
  { email: 'admin@sac.com',   password: 'admin123',   role: ROLES.ADMIN,             name: 'School Admin' },
  { email: 'teacher@sac.com', password: 'teacher123', role: ROLES.TEACHER,           name: 'John Teacher' },
  { email: 'student@sac.com', password: 'student123', role: ROLES.STUDENT,           name: 'Rahul Student' },
  { email: 'parent@sac.com',  password: 'parent123',  role: ROLES.PARENT,            name: 'Priya Parent' },
];

const ROLE_DASHBOARDS = {
  [ROLES.ULTRA_SUPER_ADMIN]: '/ultra/dashboard',
  [ROLES.SUPER_ADMIN]:       '/superadmin/dashboard',
  [ROLES.ADMIN]:             '/dashboard',
  [ROLES.TEACHER]:           '/teacher/dashboard',
  [ROLES.STUDENT]:           '/student/dashboard',
  [ROLES.PARENT]:            '/parent/dashboard',
};

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check demo credentials first (fallback when backend is unreachable)
    const demo = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (demo) {
      login({ ...demo, id: 1, school_id: 1 }, 'demo-token-' + demo.role);
      navigate(ROLE_DASHBOARDS[demo.role]);
      setLoading(false);
      return;
    }

    // Try real backend
    try {
      const res = await api.post('/api/v1/auth/login', { username: email, password });
      const { token, username, role, tenantId } = res.data;
      const user = { username, role, name: username, school_id: tenantId };
      login(user, token);
      
      // Determine dashboard route using normalized role
      let normalizedRole = role.toLowerCase().replace(/\s+/g, '_');
      if (normalizedRole === 'superadmin') normalizedRole = 'super_admin';
      if (normalizedRole === 'parents') normalizedRole = 'parent';
      
      navigate(ROLE_DASHBOARDS[normalizedRole] || '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-area">
      <div className="login-card">
        {/* Logo */}
        <div className="logo-container">
          <div style={{
            width: 70, height: 70, borderRadius: 14,
            background: 'linear-gradient(135deg, #7C32FF, #C738D8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto', color: '#fff', fontSize: 28, fontWeight: 800,
            boxShadow: '0 8px 20px rgba(124,50,255,0.35)'
          }}>SAC</div>
          <div style={{ marginTop: 12, fontWeight: 700, fontSize: 18, color: '#222' }}>SAC ERP</div>
          <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>developed by TIS</div>
        </div>

        <h5>Login Details</h5>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 16, textAlign: 'left' }}>
            <span className="ti-close" style={{ fontSize: 12 }} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="login-input-group">
            <span className="input-addon"><span className="ti-email" /></span>
            <input
              type="email"
              placeholder="Enter Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="login-input-group">
            <span className="input-addon"><span className="ti-lock" /></span>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="login-extras">
            <label>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
              Remember Me
            </label>
            <a href="#forgot">Forget Password?</a>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            <span className="ti-lock" />
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div style={{ marginTop: 24, padding: '14px', background: '#f8f8ff', borderRadius: 6, border: '1px solid #e8e4ff', textAlign: 'left' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#15803d', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>🟢 Live Database Credentials (MySQL)</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6, color: '#15803d', borderBottom: '1px dashed #bbf7d0', paddingBottom: 4 }}>
            <span style={{ fontWeight: 700 }}>School Admin (Live DB)</span>
            <span style={{ fontWeight: 600 }}>admin@sacgotek.com / password</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 12, color: '#15803d', borderBottom: '1px dashed #bbf7d0', paddingBottom: 4 }}>
            <span style={{ fontWeight: 700 }}>Super Admin (Live DB)</span>
            <span style={{ fontWeight: 600 }}>superadmin / password</span>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#7C32FF', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, marginTop: 12 }}>⚠️ Sandbox Demo Credentials (Offline)</div>
          {DEMO_USERS.map(u => (
            <div key={u.email} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3, color: '#555' }}>
              <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{u.role.replace(/_/g, ' ')}</span>
              <span style={{ color: '#999' }}>{u.email} / {u.password}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
