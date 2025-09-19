// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base URL from environment variable
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    const apiUrl = `${API_BASE_URL}/login/`;
    try {
      const response = await axios.post(apiUrl, credentials);
      
      if (response.data && response.data.usuario) {
        setUser(response.data.usuario);
        localStorage.setItem('user_data', JSON.stringify(response.data.usuario));
        return { success: true, user: response.data.usuario };
      }
    } catch (err) {
      console.error('Login error:', err.response || err.message || err);
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
    const apiUrl = `${API_BASE_URL}/login/`;
    try {
      const response = await axios.post(apiUrl, credentials);
      
      if (response.data && response.data.usuario) {
        setUser(response.data.usuario);
        localStorage.setItem('user_data', JSON.stringify(response.data.usuario));
        return { success: true, user: response.data.usuario };
      }
    } catch (err) {
      console.error('Verification error:', err.response || err.message || err);
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
    const apiUrl = `${API_BASE_URL}/generar-codigo/`;
    try {
      const response = await axios.post(apiUrl, { correo_electronico: email });
      return { success: true, message: response.data.message };
    } catch (err) {
      console.error('Generate code error:', err.response || err.message || err);
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
    const apiUrl = `${API_BASE_URL}/crear-usuario/`;
    try {
      const response = await axios.post(apiUrl, userData);
      return { 
        success: true, 
        user: response.data, 
        password: response.data.password
      };
    } catch (err) {
      // Log more detailed error information
      console.error('Registration error:', err.response || err.message || err);
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
