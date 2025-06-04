"use client"

import { useState, useEffect } from "react"
import { validateForm } from "./Validar"
import axios from 'axios';
import "../../scss/component-styles/Registrar.scss"
import Swal from "sweetalert2"
import CloseIcon from "@mui/icons-material/Close"
import IconButton from "@mui/material/IconButton"
import CircularProgress from "@mui/material/CircularProgress"
import PersonIcon from "@mui/icons-material/Person"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import HomeIcon from "@mui/icons-material/Home"
import BadgeIcon from "@mui/icons-material/Badge"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"
import { motion } from "framer-motion"

const Editar_p = ({ onClose, user }) => {
  const [formData, setFormData] = useState({
    nombre_completo: "",
    correo_electronico: "",
    telefono: "",
    direccion: "",
    cedula: "",
    tipo_usuario: "proveedor",
    avatar: null,
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch user data from Django API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/usuarios`);
        if (response.status === 200 && response.data.length > 0) {
          // Assuming the API returns a list of users, find the user with the matching email
          const userData = response.data.find((u) => u.correo_electronico === user.correo_electronico);

          if (userData) {
            setFormData({
              nombre_completo: userData.nombre_completo || "",
              correo_electronico: userData.correo_electronico || "",
              telefono: userData.telefono || "",
              direccion: userData.direccion || "",
              cedula: userData.cedula || "",
              tipo_usuario: userData.tipo_usuario || "proveedor",
              avatar: userData.imagen || null,
            });
            setAvatarPreview(userData.imagen || null);
          } else {
            setError("Usuario no encontrado en la base de datos");
          }
        } else {
          setError("Error al cargar los datos del usuario");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error al cargar los datos del usuario");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, API_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setIsChanged(true);

    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          title: "Error",
          text: "Por favor selecciona un archivo de imagen válido",
          icon: "error",
          confirmButtonColor: "#005187",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "Error",
          text: "La imagen debe ser menor a 5MB",
          icon: "error",
          confirmButtonColor: "#005187",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target.result
        setAvatarPreview(result)
        setFormData((prev) => ({
          ...prev,
          avatar: result,
        }))
        setIsChanged(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateStep = (step) => {
    const fieldsToValidate = {}

    if (step === 1) {
      fieldsToValidate.nombre_completo = formData.nombre_completo
      fieldsToValidate.correo_electronico = formData.correo_electronico
    } else if (step === 2) {
      fieldsToValidate.telefono = formData.telefono
      fieldsToValidate.direccion = formData.direccion
      fieldsToValidate.cedula = formData.cedula
    }

    const validationResult = validateForm(fieldsToValidate)
    if (!validationResult.isValid) {
      setErrors(validationResult.errors)
      return false
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isChanged) {
      Swal.fire({
        title: "Sin cambios",
        text: "No se han detectado cambios en tu perfil",
        icon: "info",
        confirmButtonColor: "#005187",
      });
      return;
    }

    const validationResult = validateForm(formData);
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    Swal.fire({
      title: "¿Confirmar cambios?",
      text: "¿Estás seguro de que quieres actualizar tu perfil?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#005187",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const apiUrl = `${API_BASE_URL}/create-usuario/`;

          // Convert avatarPreview to File object
          let avatarFile = null;
          if (avatarPreview && avatarPreview.startsWith('data:image')) {
            const response = await fetch(avatarPreview);
            const blob = await response.blob();
            avatarFile = new File([blob], "avatar.jpg", { type: blob.type });
          }

          const formDataToSend = new FormData();
          formDataToSend.append('nombre_completo', formData.nombre_completo);
          formDataToSend.append('correo_electronico', formData.correo_electronico);
          formDataToSend.append('telefono', formData.telefono);
          formDataToSend.append('direccion', formData.direccion);
          formDataToSend.append('cedula', formData.cedula);
          formDataToSend.append('tipo_usuario', formData.tipo_usuario);
          if (avatarFile) {
            formDataToSend.append('imagen', avatarFile);
          }

          const response = await axios.post(apiUrl, formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.status === 201) {
            Swal.fire({
              title: "¡Perfil actualizado!",
              html: `
                <p>Tu perfil ha sido actualizado correctamente.</p>
                <p>Los cambios se verán reflejados inmediatamente.</p>
              `,
              icon: "success",
              confirmButtonText: "Continuar",
              confirmButtonColor: "#005187",
              customClass: {
                container: "custom-swal-container",
                popup: "custom-swal-popup",
                title: "custom-swal-title",
                confirmButton: "custom-swal-button",
              },
            });
            onClose();
          } else {
            Swal.fire({
              title: "Error",
              text: response.data?.error || "No se pudo actualizar el perfil",
              icon: "error",
              confirmButtonText: "Intentar de nuevo",
              confirmButtonColor: "#005187",
            });
          }
        } catch (error) {
          console.error("Update profile error:", error.response || error.message || error);
          setError(error.response?.data?.error || "Error al actualizar el perfil");
          Swal.fire({
            title: "Error",
            text: error.response?.data?.error || "No se pudo actualizar el perfil",
            icon: "error",
            confirmButtonText: "Intentar de nuevo",
            confirmButtonColor: "#005187",
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleClose = () => {
    if (isChanged) {
      Swal.fire({
        title: "¿Descartar cambios?",
        text: "Tienes cambios sin guardar. ¿Estás seguro de que quieres cerrar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#005187",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, descartar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          onClose();
        }
      });
    } else {
      onClose();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="form-section">
      <motion.div
        className="form-container edit-profile-container"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <div className="form-header">
          <h2>Editar Perfil</h2>
          <IconButton className="close-button" onClick={handleClose} aria-label="cerrar">
            <CloseIcon />
          </IconButton>
        </div>

        <div className="progress-indicator">
          <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <span className="step-text">Información Personal</span>
          </div>
          <div className="progress-line"></div>
          <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <span className="step-text">Detalles de Contacto</span>
          </div>
          <div className="progress-line"></div>
          <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <span className="step-text">Foto y Configuración</span>
          </div>
        </div>

        <form className="formulario" onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <motion.div className="form-step" variants={containerVariants} initial="hidden" animate="visible">
              <motion.div className="form-group" variants={itemVariants}>
                <label htmlFor="nombre_completo">Nombre Completo</label>
                <div className="input-with-icon">
                  <PersonIcon className="input-icon" />
                  <input
                    id="nombre_completo"
                    type="text"
                    name="nombre_completo"
                    value={formData.nombre_completo}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre completo"
                    disabled={loading}
                    className={errors.nombre_completo ? "error-input" : ""}
                  />
                </div>
                {errors.nombre_completo && <span className="error-message">{errors.nombre_completo}</span>}
              </motion.div>

              <motion.div className="form-group" variants={itemVariants}>
                <label htmlFor="correo_electronico">Correo Electrónico</label>
                <div className="input-with-icon">
                  <EmailIcon className="input-icon" />
                  <input
                    id="correo_electronico"
                    type="email"
                    name="correo_electronico"
                    value={formData.correo_electronico}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    disabled={loading}
                    className={errors.correo_electronico ? "error-input" : ""}
                  />
                </div>
                {errors.correo_electronico && <span className="error-message">{errors.correo_electronico}</span>}
              </motion.div>

              <div className="form-buttons">
                <button type="button" onClick={handleNextStep} className="btn-next" disabled={loading}>
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div className="form-step" variants={containerVariants} initial="hidden" animate="visible">
              <motion.div className="form-group" variants={itemVariants}>
                <label htmlFor="telefono">Teléfono</label>
                <div className="input-with-icon">
                  <PhoneIcon className="input-icon" />
                  <input
                    id="telefono"
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ej: +506 8888-8888"
                    disabled={loading}
                    className={errors.telefono ? "error-input" : ""}
                  />
                </div>
                {errors.telefono && <span className="error-message">{errors.telefono}</span>}
              </motion.div>

              <motion.div className="form-group" variants={itemVariants}>
                <label htmlFor="direccion">Dirección</label>
                <div className="input-with-icon">
                  <HomeIcon className="input-icon" />
                  <input
                    id="direccion"
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Ingresa tu dirección"
                    disabled={loading}
                    className={errors.direccion ? "error-input" : ""}
                  />
                </div>
                {errors.direccion && <span className="error-message">{errors.direccion}</span>}
              </motion.div>

              <motion.div className="form-group" variants={itemVariants}>
                <label htmlFor="cedula">Cédula</label>
                <div className="input-with-icon">
                  <BadgeIcon className="input-icon" />
                  <input
                    id="cedula"
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    placeholder="Ej: 1-1234-5678"
                    disabled={loading}
                    className={errors.cedula ? "error-input" : ""}
                  />
                </div>
                {errors.cedula && <span className="error-message">{errors.cedula}</span>}
              </motion.div>

              <div className="form-buttons">
                <button type="button" onClick={handlePrevStep} className="btn-prev" disabled={loading}>
                  Atrás
                </button>
                <button type="button" onClick={handleNextStep} className="btn-next" disabled={loading}>
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div className="form-step" variants={containerVariants} initial="hidden" animate="visible">
              <motion.div className="form-group" variants={itemVariants}>
                <label>Foto de Perfil</label>
                <div className="avatar-upload">
                  <div className="avatar-preview">
                    <img
                      src={avatarPreview || "/placeholder.svg?height=120&width=120"}
                      alt="Avatar preview"
                      className="avatar-image"
                    />
                    <div className="avatar-overlay">
                      <PhotoCameraIcon className="camera-icon" />
                    </div>
                  </div>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="avatar-input"
                    disabled={loading}
                  />
                  <label htmlFor="avatar-upload" className="avatar-upload-button">
                    Cambiar foto
                  </label>
                </div>
              </motion.div>

              <motion.div className="form-group" variants={itemVariants}>
                <label htmlFor="tipo_usuario">Tipo de Usuario</label>
                <div className="input-with-icon">
                  <AccountCircleIcon className="input-icon" />
                  <select
                    id="tipo_usuario"
                    name="tipo_usuario"
                    value={formData.tipo_usuario}
                    onChange={handleChange}
                    disabled={loading}
                    className="select-input"
                  >
                    <option value="proveedor">Proveedor</option>
                    <option value="arrendador">Arrendador</option>
                  </select>
                </div>
              </motion.div>

              <motion.div className="profile-summary" variants={itemVariants}>
                <h4>Resumen del Perfil</h4>
                <div className="summary-card">
                  <div className="summary-avatar">
                    <img src={avatarPreview || "/placeholder.svg?height=60&width=60"} alt="Avatar" />
                  </div>
                  <div className="summary-info">
                    <h5>{formData.nombre_completo || "Nombre no especificado"}</h5>
                    <p>{formData.correo_electronico || "Correo no especificado"}</p>
                    <span className="summary-type">
                      {formData.tipo_usuario === "proveedor" ? "Proveedor de servicios" : "Arrendador"}
                    </span>
                  </div>
                </div>
              </motion.div>

              <div className="form-buttons">
                <button type="button" onClick={handlePrevStep} className="btn-prev" disabled={loading}>
                  Atrás
                </button>
                <button type="submit" disabled={loading || !isChanged} className="btn-submit">
                  {loading ? <CircularProgress size={20} color="inherit" /> : "Guardar Cambios"}
                </button>
              </div>
            </motion.div>
          )}

          {error && <div className="error-general">{error}</div>}
        </form>
      </motion.div>
    </section>
  );
};

export default Editar_p
