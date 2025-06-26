// Core imports
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  useLocation
} from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Loading from './components/common/Loading';
import ProtectedRoute from './components/ProtectedRoute';
import OAuthCallback from './components/OAuthCallBack';
import './App.css';

// Lazy loaded components
const Login = lazy(() => import('./Pages/Auth/Login'));
const Home = lazy(() => import('./Pages/Home'));
const FaceAuth = lazy(() => import('./Pages/Auth/FaceAuth'));
const LandingPage = lazy(() => import('./Pages/LandingPage'));
const TopChart = lazy(() => import('./Pages/Others/TopChart'));
const Desc = lazy(() => import('./Pages/Others/Desc'));
const AllGames = lazy(() => import('./Pages/Others/AllGames'));
const GameByTag = lazy(() => import('./components/GameByTag'));
const FavGames = lazy(() => import('./Pages/Others/FavGames'));

// Loading component
const PageLoader = () => <Loading />;

// Router configuration
const routerOptions = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

// Add AuthGuard component to prevent authenticated users from accessing login/landing
const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();
  

  if (isAuthenticated) {
    // If user is authenticated and tries to access login or landing, redirect to home
    return <Navigate to="/home" replace />;
  }

  return children;
};

// Modified ConditionalRoute
const ConditionalRoute = ({ path, element }) => {
  const { isAuthenticated } = useAuth();
  

  if (!isAuthenticated && path === '/home') {
    return <Navigate to="/landing" replace />;
  }

  return element;
};

function App() {
  return (
    <Router {...routerOptions}>
      <AuthProvider>
        <ThemeProvider>
          {/* Fixed background elements */}
          <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-purple-900" aria-hidden="true" />
          <div className="fixed inset-0 bg-grid-pattern opacity-5" aria-hidden="true" />
          
          <div className="min-h-screen text-white overflow-x-hidden relative">
            <div className="relative z-10 transition-all duration-300 ease-in-out">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Routes with Auth Guard */}
                  <Route path="/login" element={<AuthGuard><Login /></AuthGuard>} />
                  <Route path="/face-auth" element={<AuthGuard><FaceAuth /></AuthGuard>} />
                  <Route path="/auth/callback" element={<OAuthCallback />} />

                  {/* Landing Route with Auth Guard */}
                  <Route path="/landing" element={<AuthGuard><LandingPage /></AuthGuard>} />
                  <Route path="/" element={<AuthGuard><LandingPage /></AuthGuard>} />

                  {/* Protected Home Route */}
                  <Route path="/home" element={
                    <ConditionalRoute path="/home" element={
                      <ProtectedRoute><Home /></ProtectedRoute>
                    } />
                  } />

                  {/* Other Protected Routes */}
                  <Route path="/top-charts" element={<ProtectedRoute><TopChart /></ProtectedRoute>} />
                  <Route path="/games" element={<ProtectedRoute><AllGames /></ProtectedRoute>} />
                  <Route path="/games/:id" element={<ProtectedRoute><Desc /></ProtectedRoute>} />
                  <Route path="/games/filter/:category" element={<ProtectedRoute><GameByTag /></ProtectedRoute>} />
                  <Route path="/favorites" element={<ProtectedRoute><FavGames/></ProtectedRoute>} />
                </Routes>
              </Suspense>
            </div>
          </div>

          <Toaster/>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;