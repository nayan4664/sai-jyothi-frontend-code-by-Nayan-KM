import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authApi, type AuthResponse } from '../lib/auth-api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  authToken: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  updateUser: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isUser = (value: unknown): value is User => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const user = value as Partial<User>;
  return (
    typeof user.id === 'number' &&
    typeof user.name === 'string' &&
    typeof user.email === 'string' &&
    typeof user.role === 'string'
  );
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('authToken');

    if (savedToken) {
      setAuthToken(savedToken);
    }

    if (!savedUser) {
      return;
    }

    try {
      const parsedUser: unknown = JSON.parse(savedUser);
      if (isUser(parsedUser)) {
        setUser(parsedUser);
      } else {
        localStorage.removeItem('user');
      }
    } catch {
      localStorage.removeItem('user');
    }
  }, []);

  const persistAuth = ({ token, user: authUser }: AuthResponse) => {
    const userData: User = {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      role: authUser.role,
    };
    setUser(userData);
    setAuthToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', token);
    return userData;
  };

  const login = async (email: string, password: string) => {
    const authResponse = await authApi.login(email, password);
    return persistAuth(authResponse);
  };

  const register = async (name: string, email: string, password: string) => {
    const authResponse = await authApi.register(name, email, password);
    return persistAuth(authResponse);
  };

  const updateUser = (nextUser: User) => {
    setUser(nextUser);
    localStorage.setItem('user', JSON.stringify(nextUser));
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        login,
        register,
        updateUser,
        logout,
        isAuthenticated: !!user && !!authToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
