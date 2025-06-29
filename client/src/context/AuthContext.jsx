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
        withCredentials: true,
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

  // Simplified login function - just checks auth status after login
  const login = async () => {
    // Add a small delay to ensure cookies are set
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await checkAuthStatus();
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

  // Centralized logout function with comprehensive cleanup
  const logout = async () => {
    try {
      // Clear local storage and session storage first
      localStorage.clear();
      sessionStorage.clear();
      
      // Call logout API
      await axios.post(`${API_URL}/user/logout`, {}, {
        withCredentials: true,
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
      
      // Manual cookie clearing as comprehensive backup
      if (typeof document !== 'undefined') {
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substr(0, eqPos) : c;
          
          // Clear with multiple domain/path combinations to ensure complete removal
          const clearOptions = [
            `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`,
            `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`,
            `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`,
            `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;secure;samesite=none`,
            `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;secure;samesite=lax`
          ];
          
          clearOptions.forEach(option => {
            document.cookie = option;
          });
        });
      }
      
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