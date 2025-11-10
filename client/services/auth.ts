import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

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
  stylePreferences: string[]
): Promise<AuthResponse> => {
  try {
    // For demo purposes, simulate successful registration
    // In production, this would be a real API call
    const mockResponse = {
      user: {
        id: `user-${Date.now()}`,
        name,
        email,
      },
      token: `token-${Date.now()}`
    };
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(mockResponse));
    
    return mockResponse;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Login user
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // For demo purposes, simulate successful login
    // In production, this would be a real API call
    const mockResponse = {
      user: {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
      },
      token: `token-${Date.now()}`
    };
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(mockResponse));
    
    return mockResponse;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Social login
export const socialLogin = async (provider: string, token: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/${provider}`, { token });
    
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

// Set auth header for axios
export const setAuthHeader = (token: string): void => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Clear auth header
export const clearAuthHeader = (): void => {
  delete axios.defaults.headers.common['Authorization'];
};