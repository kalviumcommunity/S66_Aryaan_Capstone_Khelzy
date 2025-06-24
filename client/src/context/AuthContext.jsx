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
  const [user, setUser] = useState(null);
  const [faceAuthError, setFaceAuthError] = useState(null);

  // Function to check authentication status
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/user/check`, {
        withCredentials: true // Important for sending cookies
      });
      
      setIsAuthenticated(response.data.success || false);
      if (response.data.user) {
        setUser(response.data.user);
      }
      return response.data.success || false;
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
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

  // Face authentication signup
  const faceAuthSignup = async (email, faceEmbedding) => {
    setFaceAuthError(null);
    try {
      const response = await axios.post(`${API_URL}/faceAuth/face/signup`, {
        email,
        faceEmbedding
      }, {
        withCredentials: true
      });
      
      return {
        success: true,
        message: response.data.message,
        isUpdate: response.data.isUpdate || false
      };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Face authentication signup failed';
      setFaceAuthError(errorMsg);
      return {
        success: false,
        message: errorMsg
      };
    }
  };

  // Face authentication login
  const faceAuthLogin = async (email, faceEmbedding) => {
    setFaceAuthError(null);
    try {
      const response = await axios.post(`${API_URL}/faceAuth/face/login`, {
        email,
        faceEmbedding
      }, {
        withCredentials: true
      });

      if (response.data.verified) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        return {
          success: true,
          similarity: response.data.similarity,
          message: response.data.message
        };
      } else {
        setFaceAuthError(response.data.message);
        return {
          success: false,
          similarity: response.data.similarity,
          message: response.data.message
        };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Face authentication login failed';
      setFaceAuthError(errorMsg);
      return {
        success: false,
        message: errorMsg
      };
    }
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
      setUser(null);
    }
  };

  const value = {
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus,
    user,
    faceAuthSignup,
    faceAuthLogin,
    faceAuthError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;