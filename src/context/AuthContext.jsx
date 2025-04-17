import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated on mount and after token changes
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await auth.getCurrentUser();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          // Clear token on auth failure
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
          // Only redirect to login if we're not already on the login page or homepage
          if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
            navigate('/login');
          }
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        
        // Only redirect to login if we're not on public pages
        const publicPaths = ['/', '/login', '/register'];
        if (!publicPaths.includes(window.location.pathname)) {
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const login = async (credentials) => {
    try {
      const response = await auth.login(credentials);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await auth.register(userData);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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