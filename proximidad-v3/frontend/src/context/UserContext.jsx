import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { config, buildApiUrl } from '../config/env.js';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsuarios = useCallback(async (excluirUsuario = null) => {
    setLoading(true);
    setError(null);
    try {
      // ✅ VALIDACIÓN: Construir URL con parámetro de exclusión si se proporciona
      let url = buildApiUrl('/usuarios/');
      if (excluirUsuario) {
        url += `?excluir_usuario=${excluirUsuario}`;
      }
      
      const response = await axios.get(url);
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
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  return (
    <UserContext.Provider value={{ usuarios, loading, error, fetchUsuarios }}>
      {children}
    </UserContext.Provider>
  );
};
