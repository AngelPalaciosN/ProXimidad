"use client"

import { useState } from "react"
import { validateForm } from "./validar" // Corrected import case
import { validateImage } from "./validarImagen" // Import the new image validation
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../Auth"
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
import PhotoIcon from "@mui/icons-material/Photo" // Added for image upload
import { motion } from "framer-motion"

const Registrar = ({ onClose, onFormularioChange }) => {
  const [formData, setFormData] = useState({
    nombre_completo: "",
    correo_electronico: "",
    telefono: "",
    direccion: "",
    cedula: "",
    tipo_usuario: "proveedor",
    imagen: null, // Added field for the image file
  })

  const [errors, setErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(1)
  const [imagePreview, setImagePreview] = useState(null) // Added for image preview
  const navigate = useNavigate()

  // Get auth context
  const { register, loading, error } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear errors when user types
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  // Specific handler for image file upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    // Validate if the file is a JPG
    const imageError = validateImage(file);
    
    if (imageError) {
      setErrors(prev => ({ ...prev, imagen: imageError }));
      e.target.value = ''; // Reset the file input
      return;
    }
    
    // Clear any previous error
    if (errors.imagen) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.imagen;
        return newErrors;
      });
    }
    
    // Update form data with the valid image
    setFormData(prev => ({
      ...prev,
      imagen: file
    }));
    
    // Create preview URL for the image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }

  const validateStep = (step) => {
    let fieldsToValidate = {};
    let isValid = true;
  
    if (step === 1) {
      fieldsToValidate = { nombre_completo: formData.nombre_completo, correo_electronico: formData.correo_electronico };
    } else if (step === 2) {
      fieldsToValidate = { telefono: formData.telefono, direccion: formData.direccion, cedula: formData.cedula };
    } else if (step === 3 && formData.imagen) {
      // Also validate image if present in step 3
      const imageError = validateImage(formData.imagen);
      if (imageError) {
        setErrors(prev => ({ ...prev, imagen: imageError }));
        isValid = false;
      }
    }
    
    // Call the main validation function but only consider errors for the current step's fields
    const validationResult = validateForm(formData); // Validate all, but filter errors
    const stepErrors = {};

    Object.keys(fieldsToValidate).forEach(field => {
        if (validationResult.errors[field]) {
            stepErrors[field] = validationResult.errors[field];
            isValid = false;
        }
    });

    // Update errors state only with relevant errors for the current step
    // Merge new errors with existing ones from other steps
    setErrors(prevErrors => ({ ...prevErrors, ...stepErrors }));

    // Clear errors for fields in the current step if they are now valid
    const clearedErrorsForStep = { ...errors };
    Object.keys(fieldsToValidate).forEach(field => {
        if (!stepErrors[field] && clearedErrorsForStep[field]) {
            delete clearedErrorsForStep[field];
        }
    });
     // Only update if there were changes to clear
    if (JSON.stringify(errors) !== JSON.stringify(clearedErrorsForStep)) {
         setErrors(clearedErrorsForStep);
    }

    return isValid;
  }

  const handleNextStep = () => {
    // Clear previous errors specific to this step before re-validating
    let errorsToClear = {};
    if (currentStep === 1) errorsToClear = { nombre_completo: null, correo_electronico: null };
    if (currentStep === 2) errorsToClear = { telefono: null, direccion: null, cedula: null };
    setErrors(prev => ({...prev, ...errorsToClear}));
    
    // Re-validate
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Final validation of all fields before submitting
    const validationResult = validateForm(formData); 
    
    // Also validate image if present
    if (formData.imagen) {
      const imageError = validateImage(formData.imagen);
      if (imageError) {
        setErrors(prev => ({ ...prev, imagen: imageError }));
        return;
      }
    }
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors); // Show all errors on final submit attempt
      return;
    }

    // Create FormData object to handle file upload
    const formDataToSend = new FormData();
    
    // Append all form fields
    Object.keys(formData).forEach(key => {
      if (key === 'imagen' && formData[key]) {
        // Asegurar que se envíe el archivo con el nombre correcto
        formDataToSend.append('imagen', formData[key], formData[key].name);
      } else if (key !== 'imagen') {
        formDataToSend.append(key, formData[key]);
      }
    });

    const result = await register(formDataToSend);

    if (result.success) {
      Swal.fire({
        title: "¡Registro exitoso!",
        html: `
          <p>Tu cuenta ha sido creada correctamente.</p>
          <p>Bienvenido a ProXimidad.</p>
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
      })
      onClose() // Close the modal on success
    } else {
      Swal.fire({
        title: "Error",
        text: result.error || "No se pudo registrar el usuario",
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
        confirmButtonColor: "#005187",
      })
      // Optionally set specific errors if returned by backend
      // e.g., if (result.errors) setErrors(result.errors);
    }
  }

  const handleLoginRedirect = () => {
    onFormularioChange("iniciarSesion") // Switch to login form
  }

  // Animation Variants
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
    // Using form-section class potentially defined in Registrar.scss
    <section className="form-section"> 
      <motion.div
        className="form-container" // Class for styling the modal container
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <div className="form-header"> 
          <h2>Registro de Usuario</h2>
          <IconButton className="close-button" onClick={onClose} aria-label="cerrar">
            <CloseIcon />
          </IconButton>
        </div>

        {/* Progress Indicator */}
        <div className="progress-indicator"> 
          <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <span className="step-text">Información Personal</span>
          </div>
          <div className="progress-line"></div>
          <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <span className="step-text">Detalles</span>
          </div>
          <div className="progress-line"></div>
          <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <span className="step-text">Cuenta</span>
          </div>
        </div>

        {/* Form Content */}
        <form className="formulario" onSubmit={handleSubmit}> 
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <motion.div className="form-step" variants={containerVariants} initial="hidden" animate="visible" key="step1">
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
                  Siguiente
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Contact Details */}
          {currentStep === 2 && (
            <motion.div className="form-step" variants={containerVariants} initial="hidden" animate="visible" key="step2">
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
                  Siguiente
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Account Type and Image Upload */}
          {currentStep === 3 && (
            <motion.div className="form-step" variants={containerVariants} initial="hidden" animate="visible" key="step3">
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
                    className="select-input" // Added class for specific styling if needed
                  >
                    <option value="proveedor">Proveedor</option>
                    <option value="arrendador">Arrendador</option>
                  </select>
                </div>
              </motion.div>

              {/* Info box based on selection */}
              <motion.div className="tipo-usuario-info" variants={itemVariants}>
                {formData.tipo_usuario === "proveedor" ? (
                  <div className="info-box">
                    <h4>Proveedor de Servicios</h4>
                    <p>Como proveedor, podrás ofrecer tus servicios profesionales.</p>
                    <ul>
                      <li>Crea perfiles detallados</li>
                      <li>Recibe solicitudes</li>
                      <li>Gestiona tu agenda</li>
                    </ul>
                  </div>
                ) : (
                  <div className="info-box">
                    <h4>Arrendador</h4>
                    <p>Como arrendador, podrás buscar y contratar servicios.</p>
                    <ul>
                      <li>Explora servicios</li>
                      <li>Contacta profesionales</li>
                      <li>Realiza pagos seguros</li>
                    </ul>
                  </div>
                )}
              </motion.div>

              {/* Enhanced Image Upload with Preview and JPG validation */}
              <motion.div className="form-group" variants={itemVariants}>
                <label htmlFor="imagen">Foto de Perfil (JPG solamente)</label>
                <div className="input-file-container">
                  <div className="input-with-icon">
                    <PhotoIcon className="input-icon" />
                    <input
                      id="imagen"
                      type="file"
                      name="imagen"
                      accept="image/jpeg" // Only allow JPG/JPEG
                      onChange={handleImageChange}
                      disabled={loading}
                      className={errors.imagen ? "error-input" : ""}
                    />
                  </div>
                  {errors.imagen && <span className="error-message">{errors.imagen}</span>}
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Vista previa" />
                    </div>
                  )}
                </div>
              </motion.div>

              <div className="form-buttons"> 
                <button type="button" onClick={handlePrevStep} className="btn-prev" disabled={loading}>
                  Atrás
                </button>
                <button type="submit" disabled={loading} className="btn-submit">
                  {loading ? <CircularProgress size={20} color="inherit" /> : "Completar Registro"}
                </button>
              </div>
            </motion.div>
          )}

          {/* General Error Display from Auth Context */}
          {error && currentStep === 3 && !loading && (
            // Only show general backend error on the final step perhaps
            <div className="error-general">{error}</div>
          )}

          {/* Footer: Switch to Login */}
          <div className="form-footer"> 
            <p>¿Ya tienes cuenta?</p>
            <button type="button" onClick={handleLoginRedirect} className="btn-switch" disabled={loading}>
              Inicia sesión
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  )
}

export default Registrar;