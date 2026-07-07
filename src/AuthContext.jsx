import React, { createContext, useState, useEffect } from 'react';
import { auth } from './api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth.getMe()
        .then(res => setUser(res.data))
        .catch(err => {
          localStorage.removeItem('token');
          console.error('Failed to get user:', err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (email, name, password) => {
    try {
      setError(null);
      const res = await auth.signup(email, name, password);
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Signup failed';
      setError(message);
      throw new Error(message);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await auth.login(email, password);
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
