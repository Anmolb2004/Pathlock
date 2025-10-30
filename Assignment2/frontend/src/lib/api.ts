import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Get the base URL from the environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create a new Axios instance
const api = axios.create({
  baseURL: API_BASE_URL, // Use the environment variable here
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