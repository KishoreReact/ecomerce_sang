import axios from 'axios';
import store from '../store';
import { startLoading, stopLoading } from '../actions/loadingActions';
import CONFIG from '../../config';
import { regenerateTokens } from './productService';


// Create axios instance
const api = axios.create({
  baseURL: CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token and start loading
api.interceptors.request.use(
  (config) => {
    store.dispatch(startLoading());
    const token = localStorage.getItem('accessToken');;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    store.dispatch(stopLoading());
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and stop loading
api.interceptors.response.use(
  (response) => {
    store.dispatch(stopLoading());
    return response;
  },
  async (error) => {
    store.dispatch(stopLoading());
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, try to regenerate tokens
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const newTokens = await regenerateTokens(refreshToken);
          if (newTokens.status === 'Success') {
            // Update localStorage with new tokens
            localStorage.setItem('accessToken', newTokens.result.accessToken.replace(/"/g, ''));
            localStorage.setItem('refreshToken', newTokens.result.refreshToken.replace(/"/g, ''));
            localStorage.setItem('tokenExpiryMin', newTokens.result.tokenExpiryMin);
            // Retry the original request with new token
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
            return api(originalRequest);
          }
        } catch (regenerateError) {
          console.error('Failed to regenerate tokens:', regenerateError);
        }
      }
      // If regeneration failed or no refresh token, clear localStorage and redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('refreshToken');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;