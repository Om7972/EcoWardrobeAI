import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  userId: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  preferences?: any;
  notifications?: any;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const userDataStr = localStorage.getItem("userData");

    console.log('Checking auth status:', { token: !!token, userId: !!userId, userName: !!userName });

    if (token && userId && userName) {
      let userData: User = { userId, email: "", name: userName };
      
      // Load additional user data if available
      if (userDataStr) {
        try {
          const parsedData = JSON.parse(userDataStr);
          userData = { ...userData, ...parsedData };
        } catch (e) {
          console.error("Failed to parse user data:", e);
        }
      }
      
      console.log('User authenticated:', userData);
      setUser(userData);
    } else {
      console.log('No valid auth data found in localStorage');
    }
    setLoading(false);
  };

  const login = (userData: { token: string; userId: string; name: string; email?: string }) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("userId", userData.userId);
    localStorage.setItem("userName", userData.name);
    
    const user: User = { 
      userId: userData.userId, 
      email: userData.email || "", 
      name: userData.name 
    };
    
    localStorage.setItem("userData", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userData");
    setUser(null);
    navigate("/signin");
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...userData };
      
      // Persist to localStorage
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      
      return updatedUser;
    });
  };

  const isAuthenticated = !!user;

  return { user, loading, isAuthenticated, login, logout, checkAuthStatus, updateUser };
}