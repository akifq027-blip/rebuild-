/**
 * BHARAT — Build the Civilization
 * Authentication & Cloud Sync Context
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api, { UserData } from '../services/api';

export type ConnectionStatus = 'connected' | 'saving' | 'offline';

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  connectionStatus: ConnectionStatus;
  isSaving: boolean;
  serverHealth: { server: string; database: string; ai: string } | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; playerState?: any }>;
  register: (name: string, email: string, password: string, civName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  saveToServer: (state: any) => Promise<boolean>;
  checkBackendHealth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(() => {
    const cached = localStorage.getItem('bharat_user_profile');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('offline');
  const [serverHealth, setServerHealth] = useState<{ server: string; database: string; ai: string } | null>(null);

  // Health check helper
  const checkBackendHealth = useCallback(async () => {
    try {
      const res = await api.checkHealth();
      if (res.success && res.data) {
        setServerHealth(res.data);
        setConnectionStatus(res.data.database === 'connected' ? 'connected' : 'offline');
      } else {
        setConnectionStatus('offline');
      }
    } catch {
      setConnectionStatus('offline');
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      setIsLoading(true);
      await checkBackendHealth();

      const token = api.getToken();
      if (token) {
        const res = await api.getMe();
        if (isMounted) {
          if (res.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('bharat_user_profile', JSON.stringify(res.data.user));
          } else {
            // Token expired or invalid
            api.setToken(null);
            setUser(null);
            localStorage.removeItem('bharat_user_profile');
          }
        }
      }
      if (isMounted) {
        setIsLoading(false);
      }
    }

    initAuth();
    return () => {
      isMounted = false;
    };
  }, [checkBackendHealth]);

  // Login handler
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await api.login(email, password);
    setIsLoading(false);

    if (res.success && res.data?.user) {
      setUser(res.data.user);
      localStorage.setItem('bharat_user_profile', JSON.stringify(res.data.user));
      setConnectionStatus('connected');
      return { success: true, playerState: res.data.playerState };
    }

    return {
      success: false,
      error: res.error?.message || 'Login failed. Please verify credentials.',
    };
  };

  // Register handler
  const register = async (name: string, email: string, password: string, civName?: string) => {
    setIsLoading(true);
    const res = await api.register(name, email, password, civName);
    setIsLoading(false);

    if (res.success && res.data?.user) {
      setUser(res.data.user);
      localStorage.setItem('bharat_user_profile', JSON.stringify(res.data.user));
      setConnectionStatus('connected');
      return { success: true };
    }

    return {
      success: false,
      error: res.error?.message || 'Registration failed.',
    };
  };

  // Logout handler
  const logout = () => {
    api.logout();
    setUser(null);
    localStorage.removeItem('bharat_user_profile');
    setConnectionStatus('offline');
  };

  // Save to server
  const saveToServer = async (state: any): Promise<boolean> => {
    if (!user || !api.getToken()) {
      return false; // Local only
    }

    setIsSaving(true);
    setConnectionStatus('saving');

    try {
      const res = await api.savePlayerState(state);
      setIsSaving(false);
      if (res.success) {
        setConnectionStatus('connected');
        return true;
      } else {
        setConnectionStatus('offline');
        return false;
      }
    } catch {
      setIsSaving(false);
      setConnectionStatus('offline');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        connectionStatus,
        isSaving,
        serverHealth,
        login,
        register,
        logout,
        saveToServer,
        checkBackendHealth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
