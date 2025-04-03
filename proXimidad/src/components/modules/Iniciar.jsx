import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../Auth';
import { useNavigate } from 'react-router-dom';
import '../../scss/component-styles/Registrar.scss';

const IniciarSesion = ({ onClose, onFormularioChange }) => {
  const [formData, setFormData] = useState({
    correo_electronico: '',
    codigo_verificacion: '',
  });

  const [loginMethod, setLoginMethod] = useState('code'); 
  const [errors, setErrors] = useState({});
  const [codeRequested, setCodeRequested] = useState(false);
  const navigate = useNavigate();

  const { 
    loading, 
    error, 
    loginWithCode, 
    generateCode 
  } = useAuth();

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
    
    if (loginMethod === 'code' && !formData.codigo_verificacion && codeRequested) {
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

    const result = await generateCode(formData.correo_electronico);
    
    if (result.success) {
      setCodeRequested(true);
      alert('Código de verificación enviado. Por favor revisa tu correo.');
    } else {
      setErrors({
        general: result.error || 'Error al generar el código'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    let result;
    
    if (loginMethod === 'code') {
      result = await loginWithCode(formData);
    }

    if (result && result.success) {
      alert('¡Inicio de sesión exitoso!');
      onClose();
      navigate('/'); // Redirect to home page
    } else {
      setErrors({
        general: result?.error || 'Error en el inicio de sesión'
      });
    }
  };

  const toggleLoginMethod = () => {
    setLoginMethod(prev => prev === 'code');
    setErrors({});
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
          
          <div className="login-method-toggle">
            <button 
              type="button" 
              className={`method-btn ${loginMethod === 'code' ? 'active' : ''}`}
              onClick={() => setLoginMethod('code')}
            >
              Código de verificación
            </button>
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

          {loginMethod === 'code' ? (
            <>
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
                disabled={loading}
                className="btn-generar"
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Generar Código'
                )}
              </button>
            </>
          ) : (
            <div className="form-group">
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || (loginMethod === 'code' && !codeRequested)}
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
