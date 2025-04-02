import React, { useState } from 'react';
import { validateForm } from './Validar';
import { useNavigate } from 'react-router-dom'; 
import '../../scss/component-styles/Registrar.scss';
import axios from 'axios';
import Swal from 'sweetalert2';

const Registrar = ({ onClose, onFormularioChange }) => {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo_electronico: '',
    telefono: '',
    direccion: '',
    cedula: '',
    tipo_usuario: 'proveedor',
    codigo_verificacion: '',
    username: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  

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
      const response = await axios.post('http://localhost:8000/register/', formData);
      Swal.fire('Registro exitoso', `Tu contraseña es: ${response.data.password}`, 'success');
      onClose();  
    } catch (error) {
      console.error('Error en el registro:', error);
      Swal.fire('Error', 'No se pudo registrar el usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    onFormularioChange('iniciarSesion');
  };

  return (
    <section className="form">
      <div className="form-container">
        <button className="close-button" onClick={onClose}>×</button>

        <form className="formulario" onSubmit={handleSubmit}>
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
            <input
              type="text"
              name="codigo_verificacion"
              value={formData.codigo_verificacion}
              onChange={handleChange}
              placeholder="Código de Verificación"
            />
            {errors.codigo_verificacion && (
              <span className="error">{errors.codigo_verificacion}</span>
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

          <button type="submit" disabled={loading} id='btn-registrar'>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
          
          {errors.general && <div className="error general-error">{errors.general}</div>}

          <button type="button" onClick={handleLoginRedirect} id="btn-login-redirect">
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </form>
      </div>
    </section>
  );
};

export default Registrar;
