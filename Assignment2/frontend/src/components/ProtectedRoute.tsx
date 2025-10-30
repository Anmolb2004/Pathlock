import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.ts'; // .ts added

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) {
    // If user is not logged in, redirect to the login page
    return <Navigate to="/auth" replace />;
  }

  // If user is logged in, show the child page (e.g., Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;