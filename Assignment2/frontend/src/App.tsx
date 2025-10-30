import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

// Pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import NotFoundPage from './pages/NotFoundPage';


// Components
import Layout from './components/Layout';
import api from './lib/api';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const { isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // This effect handles logout
    if (!isAuthenticated()) {
      // If auth state is cleared, redirect to login
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // This handles the "Authorization" header expiration
  // We'll set up a global listener for 401 errors
  // (This is a good-practice addition)
  useEffect(() => {
    const unintercept = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token is invalid or expired
          clearAuth();
        }
        return Promise.reject(error);
      }
    );
    // Clean up the interceptor when App unmounts
    return () => api.interceptors.response.eject(unintercept);
  }, [clearAuth]);


return (
    <Routes>
      {/* AuthPage is public */}
      <Route path="/auth" element={<AuthPage />} />

      {/* --- Protected Routes --- */}
      <Route element={<ProtectedRoute />}>
        {/* Wrap the protected pages with the Layout component */}
        <Route element={<Layout />}> 
          <Route path="/" element={<DashboardPage />} />
          <Route path="/project/:projectId" element={<ProjectDetailPage />} />
        </Route>
      </Route>
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// We need to import 'api' for the interceptor to work in App.tsx


// We also need to export 'App' wrapped in the Router
// To do that, we first need to edit main.tsx

export default App;