import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Create a new Axios instance
const api = axios.create({
  baseURL: '/api', // Vite proxy will handle this
});

// --- Interceptor ---
// This function runs before every request
api.interceptors.request.use(
  (config) => {
    // Get the token from our Zustand store
    const token = useAuthStore.getState().token;
    
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
