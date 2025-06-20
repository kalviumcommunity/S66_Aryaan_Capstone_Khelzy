import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to check authentication status
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/user/check`, {
        withCredentials: true // Important for sending cookies
      });
      
      setIsAuthenticated(response.data.success || false);
      return response.data.success || false;
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Simplified login function - just checks auth status after login
  const login = async () => {
    await checkAuthStatus();
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/user/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
    }
  };

  const value = {
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;