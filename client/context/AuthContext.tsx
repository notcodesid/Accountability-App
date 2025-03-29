import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  signup as apiSignup, 
  signin as apiSignin, 
  logout as apiLogout,
  getCurrentUser, 
  isAuthenticated,
  SignupRequest,
  SigninRequest,
  AuthResponse
} from '../services/api';

interface AuthContextType {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: {
    id?: number;
    username?: string;
    email?: string;
  } | null;
  error: string | null;
  signup: (data: SignupRequest) => Promise<boolean>;
  signin: (data: SigninRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isLoggedIn: false,
  user: null,
  error: null,
  signup: async () => false,
  signin: async () => false,
  logout: async () => {},
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const authenticated = await isAuthenticated();
        
        if (authenticated) {
          try {
            const userData = await getCurrentUser();
            if (userData.success && userData.user) {
              setUser(userData.user);
              setIsLoggedIn(true);
            } else {
              // Token exists but is invalid
              await apiLogout();
              setIsLoggedIn(false);
              setUser(null);
            }
          } catch (error) {
            setIsLoggedIn(false);
            setUser(null);
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const signup = async (data: SignupRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiSignup(data);
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsLoggedIn(true);
        return true;
      } else {
        setError(response.message || 'Signup failed');
        return false;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signin = async (data: SigninRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiSignin(data);
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsLoggedIn(true);
        return true;
      } else {
        setError(response.message || 'Sign in failed');
        return false;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      await apiLogout();
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLoggedIn,
        user,
        error,
        signup,
        signin,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 