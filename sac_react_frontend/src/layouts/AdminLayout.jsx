import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="main-wrapper">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Right area: header + content */}
      <div style={{
        marginLeft: sidebarOpen ? 'var(--sidebar-width)' : 0,
        flex: 1,
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Header onToggleSidebar={() => setSidebarOpen(v => !v)} sidebarOpen={sidebarOpen} />
        <div className="main_content_iner">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
