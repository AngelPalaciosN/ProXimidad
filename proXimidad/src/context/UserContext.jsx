import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/usuarios/`);
      if (response.status === 200) {
        setUsuarios(response.data);
      } else {
        setError("Error al cargar la lista de usuarios");
      }
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      setError("Error al cargar la lista de usuarios");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  return (
    <UserContext.Provider value={{ usuarios, loading, error, fetchUsuarios }}>
      {children}
    </UserContext.Provider>
  );
};
