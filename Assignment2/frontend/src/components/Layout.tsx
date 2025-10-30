import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.ts';
import { LogOut, LayoutDashboard } from 'lucide-react';

const Layout = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/auth');
  };

  return (
    /* --- STYLE (DARK) --- */
    <div className="min-h-screen bg-gray-900">
      
      {/* --- STYLE (DARK) --- */ }
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          
          <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard size={24} className="text-indigo-500" />
            Project Manager
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300 hidden sm:block">
              Welcome, <span className="font-medium text-white">{user?.username || 'User'}</span>
            </span>
            {/* --- STYLE (DARK) --- */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-indigo-400 p-2 rounded-lg hover:bg-gray-700 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </nav>
      </header>

      {/* --- STYLE (DARK) --- */ }
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
