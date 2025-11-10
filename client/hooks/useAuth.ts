import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  userId: string;
  email: string;
  name: string;
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

    if (token && userId && userName) {
      setUser({ userId, email: "", name: userName });
    }
    setLoading(false);
  };

  const login = (userData: { token: string; userId: string; name: string }) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("userId", userData.userId);
    localStorage.setItem("userName", userData.name);
    setUser({ userId: userData.userId, email: "", name: userData.name });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setUser(null);
    navigate("/signin");
  };

  const isAuthenticated = !!user;

  return { user, loading, isAuthenticated, login, logout, checkAuthStatus };
}