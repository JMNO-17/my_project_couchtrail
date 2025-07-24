import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '@/api';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  region?: string;
  role: 'user' | 'admin';
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<User | null>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await API.get('/me');
        setUser(res.data);
      } catch {
        localStorage.removeItem('accessToken');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await API.post('/login', { email, password });
      const token = res.data.token;
      const user = res.data.user;

      localStorage.setItem('accessToken', token);
      setUser(user);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await API.post('/register', { name, email, password });
      const token = res.data.token;
      const user = res.data.user;

      localStorage.setItem('accessToken', token);
      setUser(user);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
  try {
    // Optional: call Laravel API to revoke token if supported
    await API.post('/logout');
  } catch (error) {
    // Ignore error if logout endpoint isn't implemented
    console.warn('Logout request failed on backend (possibly not implemented).');
  } finally {
    // Always clear local storage and auth state
    localStorage.removeItem('accessToken');
    setUser(null);

    // Optional: clear all user-related localStorage if used
    localStorage.removeItem('userHostingProfile');

    // Redirect to login or homepage
    window.location.href = '/auth';
  }
};

  const updateProfile = async (data: Partial<User>): Promise<User | null> => {
    try {
      const res = await API.patch('/profile', data);
      setUser(res.data);
      return res.data;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
