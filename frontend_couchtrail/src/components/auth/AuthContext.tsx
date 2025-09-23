import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '@/api';

export interface User {
  token: any;
  hostingListings: any;
  id: number;
  name: string;
  email: string;
  avatar?: string;

  role: 'user' | 'admin';
  isAdmin: boolean;
  isHost: boolean;

  region?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

// --- helpers ---------------------------------------------------------------

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

function setAuthHeader(token?: string | null) {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
}

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function storeAuth(token: string, user: User) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  setAuthHeader(token);
}

function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  setAuthHeader(null);
}

// --- provider --------------------------------------------------------------

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(readStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  // on boot: set header from token and fetch /me to verify
  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    setAuthHeader(token);

    const bootstrap = async () => {
      // If no token, stop loading (public routes can render)
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await API.get('/me');
        const maybeUser: User = res.data?.user ?? res.data; // support both shapes
        if (maybeUser && maybeUser.id) {
          setUser(maybeUser);
          // keep storage user in sync if needed
          localStorage.setItem(USER_KEY, JSON.stringify(maybeUser));
        } else {
          // invalid payload → clear
          clearAuth();
          setUser(null);
        }
      } catch {
        clearAuth();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await API.post('/login', { email, password });

      // support { token, user } or { access_token, user }
      const token: string =
        res.data?.token ?? res.data?.access_token ?? localStorage.getItem(ACCESS_TOKEN_KEY) ?? '';

      const nextUser: User = res.data?.user ?? res.data?.data ?? res.data;

      if (!token || !nextUser?.id) throw new Error('Invalid login response');

      storeAuth(token, nextUser);
      setUser(nextUser);
      return true;
    } catch (e) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await API.post('/register', { name, email, password });
      const token: string = res.data?.token ?? res.data?.access_token ?? '';
      const nextUser: User = res.data?.user ?? res.data?.data ?? res.data;

      if (!token || !nextUser?.id) throw new Error('Invalid register response');

      storeAuth(token, nextUser);
      setUser(nextUser);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await API.post('/logout'); // ok if backend doesn’t implement
    } catch {
      // ignore
    } finally {
      clearAuth();
      setUser(null);
      // keep your current redirect behavior
      window.location.href = '/auth';
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<User | null> => {
    try {
      const res = await API.patch('/profile', data);
      const updated: User = res.data?.user ?? res.data;

      if (updated && updated.id) {
        setUser(updated);
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
        return updated;
      }
      return null;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
