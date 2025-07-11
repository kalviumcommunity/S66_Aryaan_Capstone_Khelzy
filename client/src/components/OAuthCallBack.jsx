import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './common/Loading';

const OAuthCallback = () => {
  const [status, setStatus] = useState('Verifying your authentication...');
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated, setUser } = useAuth();
  
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Extract tokens and user data from URL parameters
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const refreshToken = urlParams.get('refreshToken');
        const userParam = urlParams.get('user');
        
        if (token && refreshToken && userParam) {
          // Store tokens in localStorage
          localStorage.setItem('authToken', token);
          localStorage.setItem('refreshToken', refreshToken);
          
          // Parse and set user data
          const userData = JSON.parse(decodeURIComponent(userParam));
          setUser(userData);
          setIsAuthenticated(true);
          
          setStatus('Authentication successful! Redirecting...');
          setTimeout(() => navigate('/home'), 2000);
        } else {
          throw new Error('Missing authentication data');
        }
      } catch (error) {
        console.error('Authentication verification failed:', error);
        setStatus('Authentication failed. Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    verifyAuth();
  }, [location.search, navigate, setIsAuthenticated, setUser]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <Loading />
      <p className="text-center mt-4 text-white text-lg">{status}</p>
    </div>
  );
};

export default OAuthCallback;