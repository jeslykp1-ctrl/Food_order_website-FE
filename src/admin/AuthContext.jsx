import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check for existing token on initial load
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAuthToken(token);
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    }
  };

  const login = (token) => {
    localStorage.setItem('adminToken', token);
    setAuthToken(token);
    verifyToken(token);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAuthToken(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ authToken, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};