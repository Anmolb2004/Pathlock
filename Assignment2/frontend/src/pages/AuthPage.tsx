import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.ts';
import api from '../lib/api.ts';
import type { AuthResponse } from '../types/index.ts';
import { LayoutDashboard, Loader2, AlertCircle } from 'lucide-react';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const response = await api.post<AuthResponse>(endpoint, { username, password });
      
      const { userId, token } = response.data;
      setAuth({ userId, username: response.data.username }, token);
      
      navigate('/'); 
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        const messages = Object.values(validationErrors).flat();
        setError(messages.join(', '));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      }
       else {
        setError(isLogin ? 'Login failed. Check credentials.' : `Registration failed.`);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* --- STYLE (DARK) --- */
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="flex items-center gap-2 mb-8">
        <LayoutDashboard size={32} className="text-indigo-500" />
        <h1 className="text-3xl font-bold text-white">Mini Project Manager</h1>
      </div>

      {/* --- STYLE (DARK) --- */}
      <div className="p-8 bg-gray-800 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              /* --- STYLE (DARK) --- */
              className="mt-1 block w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              /* --- STYLE (DARK) --- */
              className="mt-1 block w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              minLength={8}
            />
          </div>

          {error && (
            /* --- STYLE (DARK) --- */
            <div className="flex items-center p-3 bg-red-900 bg-opacity-30 rounded-lg border border-red-700">
              <AlertCircle className="text-red-400 mr-2" size={18} />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            /* --- STYLE (DARK) --- */
            className="w-full flex justify-center py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-150 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (isLogin ? 'Sign In' : 'Register')}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-8">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            /* --- STYLE (DARK) --- */
            className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline ml-1"
          >
            {isLogin ? 'Register now' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;