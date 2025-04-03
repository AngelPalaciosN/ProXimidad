import React, { useState } from 'react';
import { validateForm } from './Validar';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../Auth';
import '../../scss/component-styles/Registrar.scss';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

const Registrar = ({ onClose, onFormularioChange }) => {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo_electronico: '',
    telefono: '',
    direccion: '',
    cedula: '',
    tipo_usuario: 'proveedor',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
  // Get auth context
  const { register, loading, error } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationResult = validateForm(formData);
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      Swal.fire({
        title: 'Registro exitoso',
        html: `
          <p>Tu cuenta ha sido creada correctamente.</p>
        `,
        icon: 'success',
        confirmButtonText: 'Entendido'
      });
      onClose();
    } else {
      Swal.fire({
        title: 'Error',
        text: result.error || 'No se pudo registrar el usuario',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
    }
  };

  const handleLoginRedirect = () => {
    onFormularioChange('iniciarSesion');
  };

  return (
    <section className="form">
      <div className="form-container">
        <IconButton 
          className="close-button" 
          onClick={onClose}
          aria-label="cerrar"
        >
          <CloseIcon />
        </IconButton>

        <form className="formulario" onSubmit={handleSubmit}>
          <h2>Registro de Usuario</h2>
          
          <div className="form-group">
            <input
              type="text"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              placeholder="Nombre Completo"
              disabled={loading}
              className={errors.nombre_completo ? 'error-input' : ''}
            />
            {errors.nombre_completo && (
              <span className="error-message">{errors.nombre_completo}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="correo_electronico"
              value={formData.correo_electronico}
              onChange={handleChange}
              placeholder="Correo Electrónico"
              disabled={loading}
              className={errors.correo_electronico ? 'error-input' : ''}
            />
            {errors.correo_electronico && (
              <span className="error-message">{errors.correo_electronico}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
              disabled={loading}
              className={errors.telefono ? 'error-input' : ''}
            />
            {errors.telefono && (
              <span className="error-message">{errors.telefono}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Dirección"
              disabled={loading}
              className={errors.direccion ? 'error-input' : ''}
            />
            {errors.direccion && (
              <span className="error-message">{errors.direccion}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              placeholder="Cédula"
              disabled={loading}
              className={errors.cedula ? 'error-input' : ''}
            />
            {errors.cedula && (
              <span className="error-message">{errors.cedula}</span>
            )}
          </div>

          <div className="form-group">
            <select
              name="tipo_usuario"
              value={formData.tipo_usuario}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="proveedor">Proveedor</option>
              <option value="arrendador">Arrendador</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-submit"
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Registrar'
            )}
          </button>
          
          {error && <div className="error-general">{error}</div>}

          <button 
            type="button" 
            onClick={handleLoginRedirect} 
            className="btn-switch"
            disabled={loading}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </form>
      </div>
    </section>
  );
};

export default Registrar;
