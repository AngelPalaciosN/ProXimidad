// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user_data');
        const token = localStorage.getItem('access_token');
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        setError('Error al verificar la autenticación');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login with username/email and password
  const loginWithPassword = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://192.168.207.112:8000/login/', credentials);
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        localStorage.setItem('access_token', response.data.access_token);
        return { success: true, user: response.data.user };
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Error al iniciar sesión');
      return { success: false, error: err.response?.data?.error || 'Error al iniciar sesión' };
    } finally {
      setLoading(false);
    }
  };

  // Login with verification code
  const loginWithCode = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://192.168.207.112:8000/verificar-codigo/', credentials);
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        localStorage.setItem('access_token', response.data.access_token);
        return { success: true, user: response.data.user };
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.response?.data?.error || 'Error al verificar el código');
      return { success: false, error: err.response?.data?.error || 'Error al verificar el código' };
    } finally {
      setLoading(false);
    }
  };

  // Generate verification code
  const generateCode = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://192.168.207.112:8000/generar-codigo/', { correo_electronico: email });
      return { success: true, message: response.data.message };
    } catch (err) {
      console.error('Generate code error:', err);
      setError(err.response?.data?.error || 'Error al generar el código');
      return { success: false, error: err.response?.data?.error || 'Error al generar el código' };
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://192.168.207.112:8000/register/', userData);
      return { 
        success: true, 
        user: response.data,
        password: response.data.password 
      };
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Error al registrar el usuario');
      return { success: false, error: err.response?.data?.error || 'Error al registrar el usuario' };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_data');
    localStorage.removeItem('access_token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error,
      loginWithPassword,
      loginWithCode,
      generateCode,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
