import React, { useState } from 'react';
import { validateForm } from './modules/validar';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const Registrar = ({ setFormVisible }) => {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo_electronico: '',
    telefono: '',
    direccion: '',
    cedula: '',
    tipo_usuario: 'proveedor'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationResult = validateForm(formData);
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Registro exitoso');
        setFormVisible(false);
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || { general: 'Error en el registro' });
      }
    } catch (error) {
      setErrors({ general: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <IconButton className="close-button" onClick={() => setFormVisible(false)}>
        <CloseIcon />
      </IconButton>
      
      <form onSubmit={handleSubmit}>
        <h2>Registro de Usuario</h2>
        
        <div className="form-group">
          <input
            type="text"
            name="nombre_completo"
            value={formData.nombre_completo}
            onChange={handleChange}
            placeholder="Nombre Completo"
          />
          {errors.nombre_completo && (
            <span className="error">{errors.nombre_completo}</span>
          )}
        </div>

        <div className="form-group">
          <input
            type="email"
            name="correo_electronico"
            value={formData.correo_electronico}
            onChange={handleChange}
            placeholder="Correo Electrónico"
          />
          {errors.correo_electronico && (
            <span className="error">{errors.correo_electronico}</span>
          )}
        </div>

        <div className="form-group">
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
          />
          {errors.telefono && (
            <span className="error">{errors.telefono}</span>
          )}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Dirección"
          />
          {errors.direccion && (
            <span className="error">{errors.direccion}</span>
          )}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            placeholder="Cédula"
          />
          {errors.cedula && (
            <span className="error">{errors.cedula}</span>
          )}
        </div>

        <div className="form-group">
          <select
            name="tipo_usuario"
            value={formData.tipo_usuario}
            onChange={handleChange}
          >
            <option value="proveedor">Proveedor</option>
            <option value="arrendador">Arrendador</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
};

export default Registrar;