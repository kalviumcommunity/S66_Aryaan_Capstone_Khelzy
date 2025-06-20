import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './common/Loading';

const OAuthCallback = () => {
  const [status, setStatus] = useState('Verifying your authentication...');
  const navigate = useNavigate();
  const { login } = useAuth();
  
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // If we got here, the cookies are already set by the server
        // Just need to update our auth context state
        await login();
        setStatus('Authentication successful! Redirecting...');
        setTimeout(() => navigate('/home'), 3000);
      } catch (error) {
        console.error('Authentication verification failed:', error);
        setStatus('Authentication failed. Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    verifyAuth();
  }, [login, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <Loading />
      <p className="text-center mt-4 text-white text-lg">{status}</p>
    </div>
  );
};

export default OAuthCallback;