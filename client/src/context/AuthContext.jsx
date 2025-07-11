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

// Utility functions for localStorage token management
const getToken = () => localStorage.getItem('authToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setTokens = (token, refreshToken) => {
  localStorage.setItem('authToken', token);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};
const removeTokens = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
};

// Set up axios interceptor to include token in requests
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Remove withCredentials since we're using localStorage
    config.withCredentials = false;
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [faceAuthError, setFaceAuthError] = useState(null);

  // Function to check authentication status
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return false;
      }

      const response = await axios.get(`${API_URL}/user/check`, {
        timeout: 10000 // 10 second timeout
      });
      
      setIsAuthenticated(response.data.success || false);
      if (response.data.user) {
        setUser(response.data.user);
      }
      return response.data.success || false;
    } catch (error) {
      console.error('Auth check failed:', error);
      
      // Only set to false if it's a real auth failure, not a network error
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        setUser(null);
        removeTokens(); // Clear invalid tokens
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Login function to handle token-based authentication
  const login = async (credentials) => {
    try {
      if (credentials) {
        // Handle email/password login
        const response = await axios.post(`${API_URL}/user/login`, credentials);
        
        if (response.data.success && response.data.token) {
          setTokens(response.data.token, response.data.refreshToken);
          setIsAuthenticated(true);
          setUser(response.data.user);
          return response.data;
        }
        return response.data;
      } else {
        // Just check auth status (for OAuth callback)
        return await checkAuthStatus();
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Face authentication signup
  const faceAuthSignup = async (email, faceEmbedding) => {
    setFaceAuthError(null);
    try {
      const response = await axios.post(`${API_URL}/faceAuth/face/signup`, {
        email,
        faceEmbedding
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
      });

      if (response.data.verified) {
        // Store tokens in localStorage
        if (response.data.token) {
          setTokens(response.data.token, response.data.refreshToken);
        }
        
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

  // Centralized logout function with comprehensive cleanup
  const logout = async () => {
    try {
      // Clear localStorage tokens first
      removeTokens();
      
      // Call logout API (still useful for server-side cleanup if needed)
      await axios.post(`${API_URL}/user/logout`, {}, {
        timeout: 5000 // 5 second timeout
      });
      
      console.log('Logout API call successful');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with cleanup even if API call fails
    } finally {
      // Always perform cleanup regardless of API call success/failure
      
      // Update auth state
      setIsAuthenticated(false);
      setUser(null);
      
      console.log('Logout cleanup completed');
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