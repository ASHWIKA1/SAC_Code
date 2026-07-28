import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Trash2, Moon, Sun, ArrowUp, ArrowDown } from 'lucide-react';

export default function SystemEventLogBar() {
  const [logs, setLogs] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const logsEndRef = useRef(null);

  useEffect(() => {
    // Apply initial dark theme class to body
    if (isDarkMode) {
      document.body.classList.add('dark-theme-active');
      document.documentElement.style.setProperty('--bg-primary', '#0f172a');
      document.documentElement.style.setProperty('--text-primary', '#f8fafc');
    } else {
      document.body.classList.remove('dark-theme-active');
      document.documentElement.style.setProperty('--bg-primary', '#ffffff');
      document.documentElement.style.setProperty('--text-primary', '#0f172a');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const sse = new EventSource('/api/v1/canteen/realtime/stream');
    
    const handleNotification = (e) => {
      const newLog = {
        id: Date.now() + Math.random().toString(36).substr(2, 5),
        timestamp: new Date().toLocaleTimeString(),
        message: e.data
      };
      setLogs(prev => [...prev, newLog].slice(-100)); // Cap logs at 100
    };

    sse.addEventListener('SYSTEM_NOTIFICATION', handleNotification);
    
    // Add fallback simulation message on connect
    sse.onopen = () => {
      setLogs(prev => [
        ...prev, 
        { 
          id: 'init', 
          timestamp: new Date().toLocaleTimeString(), 
          message: '[SYSTEM] Real-time event communication channel established.' 
        }
      ]);
    };

    sse.onerror = (err) => {
      console.error("SSE Connection Error in Log Bar", err);
    };

    return () => {
      sse.close();
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom of logs
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 9999,
        background: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderTop: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
        color: isDarkMode ? '#f8fafc' : '#0f172a',
        fontFamily: 'monospace',
        fontSize: '12px',
        transition: 'all 0.3s ease',
        height: isOpen ? '160px' : '40px',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header bar */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px',
          background: isDarkMode ? '#1e293b' : '#f1f5f9',
          borderBottom: isOpen ? `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}` : 'none',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={16} color="#7c32ff" />
          <span style={{ fontWeight: 'bold', fontSize: '11px', letterSpacing: '0.5px' }}>
            CROSS-MODULE SYSTEM EVENT CONSOLE
          </span>
          <span 
            style={{ 
              background: '#7c32ff', 
              color: '#fff', 
              borderRadius: '12px', 
              padding: '2px 8px', 
              fontSize: '10px' 
            }}
          >
            {logs.length} events
          </span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} onClick={e => e.stopPropagation()}>
          {/* Dark / Light Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isDarkMode ? '#e2e8f0' : '#475569',
              padding: '2px',
              display: 'flex',
              alignItems: 'center'
            }}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Clear Logs Button */}
          {isOpen && (
            <button 
              onClick={clearLogs}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isDarkMode ? '#94a3b8' : '#64748b',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Clear Console"
            >
              <Trash2 size={15} />
            </button>
          )}

          {/* Minimize / Maximize */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              padding: '2px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {isOpen ? <ArrowDown size={15} /> : <ArrowUp size={15} />}
          </button>
        </div>
      </div>

      {/* Logs Content Area */}
      {isOpen && (
        <div 
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px 16px',
            background: isDarkMode ? '#090d16' : '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: '#64748b', padding: '12px 0', fontSize: '11px', fontStyle: 'italic' }}>
              Waiting for cross-module actions (checkout, student status changes, or LMS milestones)...
            </div>
          ) : (
            logs.map(log => (
              <div 
                key={log.id} 
                style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  alignItems: 'flex-start',
                  lineHeight: '1.4',
                  fontSize: '11.5px',
                  color: log.message.includes('Low Balance') ? '#f43f5e' : 
                         log.message.includes('LMS Reward') ? '#10b981' : 
                         log.message.includes('Suspended') ? '#f59e0b' : 
                         isDarkMode ? '#e2e8f0' : '#334155'
                }}
              >
                <span style={{ color: '#64748b', flexShrink: 0 }}>[{log.timestamp}]</span>
                <span>{log.message}</span>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      )}
    </div>
  );
}
