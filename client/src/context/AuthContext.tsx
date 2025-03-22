import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextProps {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    // This would typically involve checking for a stored token
    const checkLoginStatus = async () => {
      try {
        // Simulate loading delay for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you'd verify the token with your backend
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would make an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // For demonstration, we'll just accept any login
      const userData: User = {
        id: '1',
        email,
        name: email.split('@')[0], // Use part of email as name for demo
      };
      
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would make an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // For demonstration, we'll just pretend registration was successful
      const userData: User = {
        id: '1',
        email,
        name,
      };
      
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}; 