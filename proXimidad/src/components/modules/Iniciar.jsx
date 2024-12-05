import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import '../../scss/component-styles/Registrar.scss';

const IniciarSesion = ({ onClose }) => {
  const [formData, setFormData] = useState({
    correo_electronico: '',
    codigo_verificacion: '', // Cambiado a codigo_verificacion
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
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/proX/usuarios/Iniciar/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Guardar el token JWT en el localStorage
        localStorage.setItem('access_token', responseData.access_token);

        alert('Inicio de sesión exitoso');
        onClose(); // Cerrar el modal

        // Aquí podrías redirigir a otra página si lo necesitas
        // window.location.href = '/dashboard';  // Ejemplo de redirección a un dashboard
      } else {
        // Si el inicio de sesión falla, mostrar el mensaje de error
        setErrors(responseData.errors || { general: 'Error en el inicio de sesión' });
      }
    } catch (error) {
      // Si hay un error de red o algún problema, mostrar un error general
      setErrors({ general: 'Error de conexión. Por favor, inténtalo más tarde.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form">
      <div className="form-container">
        <IconButton className="close-button" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        
        <form className="formulario" onSubmit={handleSubmit}>
          <h2>Inicio de Sesión</h2>
          
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
              type="text" // Mantener como texto ya que es un código de verificación
              name="codigo_verificacion"
              value={formData.codigo_verificacion}
              onChange={handleChange}
              placeholder="Código de Verificación"
            />
            {errors.codigo_verificacion && (
              <span className="error">{errors.codigo_verificacion}</span>
            )}
          </div>

          <button type="submit" disabled={loading} id='btn-iniciar-sesion'>
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
          
          {errors.general && <div className="error general-error">{errors.general}</div>}
        </form>
      </div>
    </section>
  );
};

export default IniciarSesion;
