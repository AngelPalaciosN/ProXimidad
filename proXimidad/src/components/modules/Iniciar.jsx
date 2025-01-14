import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import '../../scss/component-styles/Registrar.scss';

const IniciarSesion = ({ onClose, onFormularioChange }) => {
  const [formData, setFormData] = useState({
    correo_electronico: '',
    codigo_verificacion: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.correo_electronico) {
      newErrors.correo_electronico = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo_electronico)) {
      newErrors.correo_electronico = 'Correo electrónico inválido';
    }
    if (!formData.codigo_verificacion && codeRequested) {
      newErrors.codigo_verificacion = 'El código de verificación es requerido';
    }
    return newErrors;
  };

  const handleGenerateCode = async () => {
    const formErrors = validateForm();
    if (formErrors.correo_electronico) {
      setErrors(formErrors);
      return;
    }

    setGeneratingCode(true);
    try {
      const response = await fetch('http://localhost:8000/proX/usuarios/generar-codigo/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: 'include',  // Important for cookies
        mode: 'cors',           // Enable CORS
        body: JSON.stringify({ correo_electronico: formData.correo_electronico }),
      });

      const data = await response.json();

      if (response.ok) {
        setCodeRequested(true);
        alert('Código de verificación enviado. Por favor revisa tu correo.');
      } else {
        setErrors({
          general: data.error || 'Error al generar el código'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({
        general: 'Error de conexión. Por favor, inténtalo más tarde.'
      });
    } finally {
      setGeneratingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/proX/usuarios/iniciar/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: 'include',  // Important for cookies
        mode: 'cors',           // Enable CORS
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens and user data
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        // Show success message and close modal
        alert('¡Inicio de sesión exitoso!');
        onClose();
        window.location.reload(); // Refresh to update auth state
      } else {
        setErrors({
          general: data.error || data.detail || 'Error en el inicio de sesión'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({
        general: 'Error de conexión. Por favor, inténtalo más tarde.'
      });
    } finally {
      setLoading(false);
    }
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
          <h2>Inicio de Sesión</h2>
          
          <div className="form-group">
            <input
              type="email"
              name="correo_electronico"
              value={formData.correo_electronico}
              onChange={handleChange}
              placeholder="Correo Electrónico"
              disabled={loading || generatingCode}
              className={errors.correo_electronico ? 'error-input' : ''}
            />
            {errors.correo_electronico && (
              <span className="error-message">{errors.correo_electronico}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="codigo_verificacion"
              value={formData.codigo_verificacion}
              onChange={handleChange}
              placeholder="Código de Verificación"
              disabled={loading || !codeRequested}
              className={errors.codigo_verificacion ? 'error-input' : ''}
            />
            {errors.codigo_verificacion && (
              <span className="error-message">{errors.codigo_verificacion}</span>
            )}
          </div>

          <button 
            type="button" 
            onClick={handleGenerateCode} 
            disabled={generatingCode || loading}
            className="btn-generar"
          >
            {generatingCode ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Generar Código'
            )}
          </button>

          <button 
            type="submit" 
            disabled={loading || !codeRequested}
            className="btn-submit"
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Iniciar Sesión'
            )}
          </button>
          
          {errors.general && (
            <div className="error-general">{errors.general}</div>
          )}
          
          <button 
            type="button" 
            onClick={() => onFormularioChange('registrar')}
            className="btn-switch"
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </form>
      </div>
    </section>
  );
};

export default IniciarSesion;