import apiClient from '../lib/axios';

const API_URL = '/api';

// User interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Register a new user
export const register = async (
  name: string,
  email: string,
  password: string,
  stylePreferences: string[] = []
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/signup', {
      name,
      email,
      password,
      stylePreferences
    });
    
    if (response.data.success && response.data.data) {
      const { userId, email: userEmail, name: userName, token } = response.data.data;
      
      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userData', JSON.stringify({ userId, email: userEmail, name: userName }));
      
      return {
        user: {
          id: userId,
          name: userName,
          email: userEmail,
        },
        token
      };
    }
    
    throw new Error('Invalid response from server');
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message || 'Registration failed');
  }
};

// Login user
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/signin', {
      email,
      password
    });
    
    console.log('Sign-in response:', response.data);
    
    if (response.data.success && response.data.data) {
      const { userId, email: userEmail, name: userName, token } = response.data.data;
      
      if (!token || !userId) {
        console.error('Missing token or userId in response:', { token, userId });
        throw new Error('Invalid server response: missing authentication data');
      }
      
      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userData', JSON.stringify({ userId, email: userEmail, name: userName }));
      
      console.log('Auth data stored successfully');
      
      return {
        user: {
          id: userId,
          name: userName,
          email: userEmail,
        },
        token
      };
    }
    
    console.error('Invalid response format:', response.data);
    throw new Error('Invalid response from server');
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.error || error.message || 'Login failed');
  }
};

// Social login
export const socialLogin = async (provider: string, token: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post(`/auth/${provider}`, { token });
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Social login failed');
  }
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const userData = JSON.parse(userStr);
    return userData.user;
  }
  return null;
};

// Get auth token
export const getToken = (): string | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const userData = JSON.parse(userStr);
    return userData.token;
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Set auth header for axios (legacy support)
export const setAuthHeader = (token: string): void => {
  localStorage.setItem('token', token);
};

// Clear auth header (legacy support)
export const clearAuthHeader = (): void => {
  localStorage.removeItem('token');
};