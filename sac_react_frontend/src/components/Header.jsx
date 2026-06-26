import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header({ onToggleSidebar, sidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'New Student Admitted', time: '5 min ago', icon: 'ti-user', read: false },
    { id: 2, title: 'Fee Invoice Generated', time: '1 hr ago',  icon: 'ti-money', read: false },
    { id: 3, title: 'Exam Schedule Published', time: '3 hr ago', icon: 'ti-clipboard', read: true },
    { id: 4, title: 'New Notice Posted', time: 'Yesterday', icon: 'ti-comment-alt', read: true },
  ]);
  const unread = notifications.filter(n => !n.read).length;

  const userRef = useRef();
  const notifRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user
    ? (user.name || 'Admin').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  const getRoleBadge = () => {
    const map = {
      ultra_super_admin: { label: 'Ultra Admin', color: '#7C32FF' },
      super_admin:       { label: 'Super Admin', color: '#A235EC' },
      admin:             { label: 'Admin',        color: '#C738D8' },
      teacher:           { label: 'Teacher',      color: '#23c277' },
      student:           { label: 'Student',      color: '#4d79ff' },
      parent:            { label: 'Parent',       color: '#ffba00' },
    };
    return map[user?.role] || { label: 'User', color: '#aaa' };
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="header_iner" style={{
      left: sidebarOpen ? 'var(--sidebar-width)' : 0,
      transition: 'left 0.3s ease'
    }}>
      {/* Left: Toggle + Breadcrumb */}
      <div className="header_left">
        <button className="sidebar-toggle-btn" onClick={onToggleSidebar} title="Toggle Sidebar">
          <span className="ti-menu" />
        </button>
        <div style={{ fontSize: 13, color: '#666' }}>
          <span style={{ fontWeight: 600, color: '#333' }}>SAC ERP</span>
          <span style={{ margin: '0 6px', color: '#ccc' }}>|</span>
          <span>developed by TIS</span>
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div className="header_right">
        <ul className="header_notification_warp">
          {/* Notification Bell */}
          <li ref={notifRef} style={{ position: 'relative' }}>
            <a onClick={() => setShowNotifications(v => !v)} style={{ cursor: 'pointer' }}>
              <span className="ti-bell" />
              {unread > 0 && <span className="notification_count">{unread}</span>}
            </a>
            {showNotifications && (
              <div className="dropdown-menu" style={{ width: 300, right: 0 }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: 600, fontSize: 13 }}>
                  Notifications <span style={{ color: '#7C32FF' }}>({unread} new)</span>
                </div>
                <ul>
                  {notifications.map(n => (
                    <li key={n.id}>
                      <a style={{ cursor: 'pointer', opacity: n.read ? 0.6 : 1 }}>
                        <span className={n.icon} style={{ color: '#7C32FF', fontSize: 16 }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600 }}>{n.title}</div>
                          <div style={{ fontSize: 11, color: '#aaa' }}>{n.time}</div>
                        </div>
                        {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7C32FF', flexShrink: 0, marginLeft: 'auto' }} />}
                      </a>
                    </li>
                  ))}
                  <li style={{ padding: '10px 16px', textAlign: 'center', borderTop: '1px solid #f0f0f0' }}>
                    <span style={{ fontSize: 12, color: '#7C32FF', cursor: 'pointer', fontWeight: 600 }}>View All Notifications</span>
                  </li>
                </ul>
              </div>
            )}
          </li>

          {/* Messages */}
          <li>
            <a style={{ cursor: 'pointer' }} title="Messages">
              <span className="ti-email" />
            </a>
          </li>
        </ul>

        {/* User Profile Dropdown */}
        <div className="header-user-wrap" ref={userRef} onClick={() => setShowUserMenu(v => !v)}>
          <div className="header-user-avatar">{initials}</div>
          <div className="header-user-info">
            <span className="user-name">{user?.name || 'Administrator'}</span>
            <span className="user-role" style={{ color: roleBadge.color }}>{roleBadge.label}</span>
          </div>
          <span className="ti-angle-down" style={{ fontSize: 10, color: '#aaa', marginLeft: 4 }} />

          {showUserMenu && (
            <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
              <ul>
                <li>
                  <a onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                    <span className="ti-id-badge" /> My Profile
                  </a>
                </li>
                <li>
                  <a onClick={() => navigate('/settings/general')} style={{ cursor: 'pointer' }}>
                    <span className="ti-settings" /> Settings
                  </a>
                </li>
                <li>
                  <a onClick={() => navigate('/update-password')} style={{ cursor: 'pointer' }}>
                    <span className="ti-lock" /> Change Password
                  </a>
                </li>
                <li className="divider" />
                <li>
                  <button onClick={handleLogout} style={{ color: '#ef5f5f' }}>
                    <span className="ti-power-off" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
