import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Role hierarchy: ultra_super_admin > super_admin > admin > teacher > student > parent
export const ROLES = {
  ULTRA_SUPER_ADMIN: 'ultra_super_admin',
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
};

export const normalizeRole = (role) => {
  if (!role) return '';
  let r = role.toLowerCase().replace(/\s+/g, '_');
  if (r === 'superadmin' || r === 'super_admin') return 'super_admin';
  if (r === 'parents') return 'parent';
  return r;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sac_user');
    if (!saved) return null;
    try {
      const u = JSON.parse(saved);
      if (u) {
        u.role = normalizeRole(u.role);
      }
      return u;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('sac_token') || null);

  const login = (userData, authToken) => {
    if (userData) {
      userData.role = normalizeRole(userData.role);
    }
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('sac_user', JSON.stringify(userData));
    localStorage.setItem('sac_token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sac_user');
    localStorage.removeItem('sac_token');
  };

  const hasRole = (...roles) => user && roles.includes(user.role);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}
