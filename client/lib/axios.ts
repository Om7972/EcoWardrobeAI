import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: '/api',
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Auth token added to request for:', config.url);
    } else {
      console.log('No token found for request:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('API response successful for:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API error for:', error.config?.url, error.response?.status, error.message);
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid - clear auth data
      console.error('Authentication error - clearing auth data');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userData');
      // Redirect to sign in if not already there
      if (window.location.pathname !== '/signin' && window.location.pathname !== '/signup') {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

