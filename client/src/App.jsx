import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css'
import Login from './Pages/Login'
import Home from './Pages/Home'
import FaceAuth from './Pages/FaceAuth'
import LandingPage from './Pages/LandingPage';
import { ThemeProvider } from './context/ThemeContext';
import TopChart from './Pages/TopChart';
import Desc from './Pages/Desc';
import AllGames from './Pages/AllGames';
import { API_URL, fetchOptions } from './config';
import GameByTag from './components/GameByTag';
import { DotLottieReact } from '@lottiefiles/dotlottie-react'


// Handle auth callback
const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  return <div>Loading...</div>;
};

const verifyAuth = async () => {
  try {
    const responses = await Promise.allSettled([
      fetch(`${API_URL}/user/check`, {
        ...fetchOptions,
        method: 'GET',
        credentials: 'include',
        headers: {
          ...fetchOptions.headers,
          ...(document.cookie.includes('token=') && {
            'Authorization': `Bearer ${document.cookie.split('; ')
              .find(row => row.startsWith('token='))
              ?.split('=')[1]}`
          })
        }
      }),
      fetch(`${API_URL}/faceAuth/verify-auth`, {
        ...fetchOptions,
        method: 'GET',
        credentials: 'include'
      })
    ]);

    // Check for successful responses and parse JSON
    const validResponses = await Promise.all(
      responses
        .filter(r => r.status === 'fulfilled' && r.value.ok)
        .map(r => r.value.json().catch(() => ({ authenticated: false })))
    );

    return validResponses.some(data => data.authenticated !== false);

  } catch (error) {
    console.error('Auth verification failed:', error);
    return false;
  }
};

// ProtectedRoute component to check authentication
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    let timeoutId;
    
    const verify = async () => {
      const startTime = Date.now();
      try {
        const isAuthenticated = await verifyAuth();
        
        if (!isAuthenticated) {
          setIsVerifying(false); // Immediately update state
          navigate('/login', { replace: true });
          return;
        }

        const elapsedTime = Date.now() - startTime;
        const remainingDelay = Math.max(0, 2000 - elapsedTime);
        
        timeoutId = setTimeout(() => {
          setIsVerifying(false);
        }, remainingDelay);
      } catch (error) {
        console.error('Authentication verification error:', error);
        setIsVerifying(false);
        navigate('/login', { replace: true });
      }
    };

    verify();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate]);

  if (isVerifying) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}>
        <DotLottieReact
          src="https://lottie.host/376c2d63-c220-4987-b922-67d602ba3510/DCVf0jB4V9.lottie"
          loop
          autoplay
          style={{
            width: '200px',  // Adjust size as needed
            height: '200px'  // Adjust size as needed
          }}
        />
        <div style={{ marginTop: '20px', fontSize: '1.2rem' }}>
          Verifying authentication...
        </div>
      </div>
    );
  }

  return children;
};


// AuthRoute component to prevent authenticated users from accessing login/auth pages
const AuthRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const isAuthenticated = await verifyAuth();
        if (isAuthenticated) {
          navigate('/home', { replace: true });
          return;
        }
        console.log(isAuthenticated);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsVerifying(false);
      }
    };

    check();
  }, [navigate]);

  if (isVerifying) {
    return <div>Checking authentication...</div>;
  }

  return children;
};

// AuthRoute.propTypes = {
//   children: PropTypes.node isRequired,
// };

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/login" element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } />
          <Route path="/face-auth" element={
            <AuthRoute>
              <FaceAuth />
            </AuthRoute>
          } />

          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path='/top-charts' element={
            <ProtectedRoute>
              <TopChart />
            </ProtectedRoute>
          } />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/games/:id" element={<Desc />} />
          <Route path='/landing' element={<LandingPage/>}/>
          <Route path='/games/filter/:category' element={
            <ProtectedRoute>
              <GameByTag />
            </ProtectedRoute>
          }/>
          <Route path='/games' element={
            <ProtectedRoute>
              <AllGames />
            </ProtectedRoute>
          }/>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
