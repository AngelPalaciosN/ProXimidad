"use client"

import { useState, useRef, useEffect } from "react"
import { Modal } from "react-bootstrap"
import CloseIcon from "@mui/icons-material/Close"
import IconButton from "@mui/material/IconButton"
import CircularProgress from "@mui/material/CircularProgress"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import ImageIcon from "@mui/icons-material/Image"
import DeleteIcon from "@mui/icons-material/Delete"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import axios from 'axios'
import { config } from '../../config/env'
import { motion } from "framer-motion"
import Swal from "sweetalert2"
import PropTypes from "prop-types"

const ServiceCreator = ({ show, onHide, proveedorId, servicio = null, onSuccess }) => {
  // Estado del formulario con TODOS los campos de la BD
  const [formData, setFormData] = useState({
    nombre_servicio: "",
    descripcion: "",
    categoria: "",
    precio_base: "",
    ubicacion: "",
    destacado: false,
  })
  
  const [categorias, setCategorias] = useState([])
  const [imagenes, setImagenes] = useState([]) // Array de archivos (max 5)
  const [imagenPreviews, setImagenPreviews] = useState([]) // Array de URLs
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  // Cargar categorías desde API
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/categorias/`)
        setCategorias(response.data)
      } catch (error) {
        console.error('Error al cargar categorías:', error)
      }
    }
    fetchCategorias()
  }, [])

  // Cargar datos si es edición
  useEffect(() => {
    if (servicio) {
      setFormData({
        nombre_servicio: servicio.nombre_servicio || '',
        descripcion: servicio.descripcion || '',
        categoria: servicio.categoria?.categoria_id || servicio.categoria_id || '',
        precio_base: servicio.precio_base || '',
        ubicacion: servicio.ubicacion || '',
        destacado: servicio.destacado || false,
      })
      
      // Cargar imágenes existentes si es edición
      if (servicio.imagen_url || servicio.imagen) {
        const imageUrl = servicio.imagen_url || servicio.imagen
        setImagenPreviews([imageUrl])
      }
    }
  }, [servicio])

  // Función para resetear el estado del modal
  const resetModalState = () => {
    setFormData({
      nombre_servicio: "",
      descripcion: "",
      categoria: "",
      precio_base: "",
      ubicacion: "",
      destacado: false,
    })
    // Limpiar URLs de blob memory
    imagenPreviews.forEach(preview => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    })
    setImagenes([])
    setImagenPreviews([])
    setErrors({})
  }

  // Función personalizada para cerrar con reset
  const handleClose = () => {
    resetModalState()
    if (onHide) {
      onHide()
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    
    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Validar que no exceda el máximo de 5 imágenes
    const totalImages = imagenes.length + files.length
    if (totalImages > 5) {
      setErrors((prev) => ({ 
        ...prev, 
        imagen: `Solo puedes subir un máximo de 5 imágenes (actualmente tienes ${imagenes.length})` 
      }))
      Swal.fire({
        title: "Límite de imágenes",
        text: `Solo puedes subir hasta 5 imágenes. Actualmente tienes ${imagenes.length}.`,
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#667eea",
      })
      return
    }

    // Validar cada archivo
    const validFiles = []
    const validPreviews = []
    let hasErrors = false

    for (const file of files) {
      // Validar tamaño (5MB por imagen)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, imagen: "Cada imagen no debe superar 5MB" }))
        hasErrors = true
        continue
      }

      // Validar tipo
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setErrors((prev) => ({ ...prev, imagen: "Solo se permiten imágenes JPG, PNG o WEBP" }))
        hasErrors = true
        continue
      }

      validFiles.push(file)
      validPreviews.push(URL.createObjectURL(file))
    }

    if (hasErrors) {
      Swal.fire({
        title: "Error en imágenes",
        text: "Algunas imágenes no cumplen con los requisitos (máx 5MB, formato JPG/PNG/WEBP)",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#667eea",
      })
      return
    }

    setImagenes([...imagenes, ...validFiles])
    setImagenPreviews([...imagenPreviews, ...validPreviews])
    setErrors((prev) => ({ ...prev, imagen: null }))
  }

  const removeImage = (index) => {
    // Liberar memoria del blob
    const preview = imagenPreviews[index]
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    // Eliminar de ambos arrays
    setImagenes(imagenes.filter((_, i) => i !== index))
    setImagenPreviews(imagenPreviews.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors = {}
    
    // nombre_servicio: VARCHAR(100) NOT NULL
    if (!formData.nombre_servicio.trim()) {
      newErrors.nombre_servicio = "El nombre del servicio es obligatorio"
    } else if (formData.nombre_servicio.length > 100) {
      newErrors.nombre_servicio = "El nombre no puede superar 100 caracteres"
    }

    // descripcion: LONGTEXT NOT NULL
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es obligatoria"
    } else if (formData.descripcion.trim().length < 50) {
      newErrors.descripcion = "La descripción debe tener al menos 50 caracteres"
    }

    // categoria_id: BIGINT NOT NULL FK
    if (!formData.categoria) {
      newErrors.categoria = "Debes seleccionar una categoría"
    }

    // precio_base: DECIMAL(10,2) NOT NULL
    if (!formData.precio_base || formData.precio_base <= 0) {
      newErrors.precio_base = "Ingresa un precio válido mayor a 0"
    }

    // ubicacion: VARCHAR(200) NOT NULL
    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = "La ubicación es obligatoria"
    } else if (formData.ubicacion.length > 200) {
      newErrors.ubicacion = "La ubicación no puede superar 200 caracteres"
    }

    // imagen: VARCHAR(100) - Obligatoria solo al crear (mínimo 1 imagen)
    if (!servicio && imagenes.length === 0) {
      newErrors.imagen = "Debes subir al menos 1 imagen del servicio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('🚀 INICIANDO ENVÍO DEL FORMULARIO')
    console.log('📋 Datos del formulario:', formData)
    console.log(`🖼️ Imágenes (${imagenes.length}):`, imagenes)
    console.log('👤 Proveedor ID:', proveedorId)

    if (!validateForm()) {
      console.log('❌ Validación fallida:', errors)
      Swal.fire({
        title: "Formulario Incompleto",
        text: "Por favor completa todos los campos obligatorios",
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#667eea",
      })
      return
    }

    setLoading(true)

    try {
      const formDataToSend = new FormData()
      
      // Campos obligatorios de la BD
      formDataToSend.append('nombre_servicio', formData.nombre_servicio.trim())
      formDataToSend.append('descripcion', formData.descripcion.trim())
      formDataToSend.append('precio_base', formData.precio_base)
      formDataToSend.append('categoria', formData.categoria)
      formDataToSend.append('proveedor', proveedorId)
      formDataToSend.append('ubicacion', formData.ubicacion.trim())
      
      // Campos booleanos con valores por defecto
      formDataToSend.append('destacado', formData.destacado ? '1' : '0')
      formDataToSend.append('activo', '1') // Siempre activo al crear/editar
      
      // Imágenes (hasta 5, obligatoria al menos 1 al crear)
      if (imagenes.length > 0) {
        imagenes.forEach((img, index) => {
          formDataToSend.append('imagenes', img) // Backend debe esperar array 'imagenes'
          console.log(`✅ Imagen ${index + 1} agregada al FormData`)
        })
      }

      console.log(`📤 Enviando datos al backend con ${imagenes.length} imágenes...`)

      let response
      if (servicio) {
        console.log(`🔄 Actualizando servicio ID: ${servicio.id}`)
        response = await axios.put(
          `${config.API_BASE_URL}/servicios/${servicio.id}/actualizar/`,
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )
      } else {
        console.log('➕ Creando nuevo servicio')
        response = await axios.post(
          `${config.API_BASE_URL}/servicios/crear/`,
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )
      }

      console.log('✅ Respuesta del servidor:', response.data)

      Swal.fire({
        title: "¡Éxito!",
        text: `Tu servicio "${formData.nombre_servicio}" ha sido ${servicio ? 'actualizado' : 'creado'} correctamente.`,
        icon: "success",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#667eea",
        timer: 3000,
        timerProgressBar: true,
      })

      handleClose()
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("❌ Error al guardar servicio:", error)
      console.error('📋 Detalles del error:', error.response?.data)
      
      Swal.fire({
        title: "Error",
        text: error.response?.data?.error || 'Ocurrió un error al guardar el servicio. Intenta nuevamente.',
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#667eea",
      })
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered 
      className="service-creator-modal"
      size="lg"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <div className="form-header">
          <h2>
            <CloudUploadIcon style={{ marginRight: '10px', fontSize: '28px' }} />
            {servicio ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
          </h2>
          <IconButton className="close-button" onClick={handleClose} aria-label="cerrar">
            <CloseIcon />
          </IconButton>
        </div>

        <form className="formulario" onSubmit={handleSubmit}>
          {/* Galería de imágenes (hasta 5) */}
          <motion.div className="form-group" variants={itemVariants}>
            <label>
              Imágenes del Servicio * 
              <span className="images-counter">({imagenes.length}/5)</span>
            </label>
            
            {/* Galería de previews */}
            {imagenPreviews.length > 0 && (
              <div className="images-gallery-grid">
                {imagenPreviews.map((preview, index) => (
                  <div key={index} className="image-preview-container">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className="image-preview"
                    />
                    <IconButton 
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                      aria-label={`eliminar imagen ${index + 1}`}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <span className="image-number">{index + 1}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Botón para agregar más imágenes */}
            {imagenes.length < 5 && (
              <div 
                className="upload-placeholder"
                onClick={() => fileInputRef.current?.click()}
                style={{ cursor: 'pointer' }}
              >
                <ImageIcon style={{ fontSize: '48px', color: '#ccc' }} />
                <p>
                  {imagenes.length === 0 
                    ? 'Haz clic para seleccionar imágenes' 
                    : `Agregar más imágenes (${5 - imagenes.length} disponibles)`}
                </p>
                <small>JPG, PNG, WEBP • Máx. 5MB cada una • Hasta 5 imágenes</small>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
            />
            
            {errors.imagen && <span className="error-message">{errors.imagen}</span>}
          </motion.div>

          {/* Nombre del servicio */}
          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="nombre_servicio">Nombre del Servicio *</label>
            <input
              id="nombre_servicio"
              type="text"
              name="nombre_servicio"
              value={formData.nombre_servicio}
              onChange={handleChange}
              placeholder="Ej: Desarrollo de Aplicación Web Profesional"
              disabled={loading}
              maxLength={100}
              className={errors.nombre_servicio ? "error-input" : ""}
            />
            {errors.nombre_servicio && <span className="error-message">{errors.nombre_servicio}</span>}
            <small className="char-counter">{formData.nombre_servicio.length}/100</small>
          </motion.div>

          {/* Descripción */}
          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="descripcion">Descripción Detallada * (mínimo 50 caracteres)</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe tu servicio en detalle: qué incluye, proceso de trabajo, tecnologías, requisitos del cliente, tiempo estimado..."
              disabled={loading}
              rows={5}
              className={errors.descripcion ? "error-input" : ""}
            />
            {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
            <small className={`char-counter ${formData.descripcion.length < 50 ? 'text-danger' : 'text-success'}`}>
              {formData.descripcion.length} caracteres {formData.descripcion.length >= 50 ? '✓' : `(faltan ${50 - formData.descripcion.length})`}
            </small>
          </motion.div>

          {/* Categoría y Precio en fila */}
          <div className="form-row">
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="categoria">Categoría *</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                disabled={loading}
                className={errors.categoria ? "error-input" : ""}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.categoria_id} value={cat.categoria_id}>
                    {cat.nombre_categoria}
                  </option>
                ))}
              </select>
              {errors.categoria && <span className="error-message">{errors.categoria}</span>}
            </motion.div>

            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="precio_base">Precio Base (USD) *</label>
              <div className="input-with-prefix">
                <span className="prefix">$</span>
                <input
                  id="precio_base"
                  type="number"
                  name="precio_base"
                  value={formData.precio_base}
                  onChange={handleChange}
                  placeholder="0.00"
                  disabled={loading}
                  min="0"
                  step="0.01"
                  className={errors.precio_base ? "error-input" : ""}
                />
              </div>
              {errors.precio_base && <span className="error-message">{errors.precio_base}</span>}
            </motion.div>
          </div>

          {/* Ubicación */}
          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="ubicacion">Ubicación *</label>
            <input
              id="ubicacion"
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              placeholder="Ej: Remoto / Bogotá, Colombia / Presencial en..."
              disabled={loading}
              maxLength={200}
              className={errors.ubicacion ? "error-input" : ""}
            />
            {errors.ubicacion && <span className="error-message">{errors.ubicacion}</span>}
            <small className="char-counter">{formData.ubicacion.length}/200</small>
          </motion.div>

          {/* Destacado */}
          <motion.div className="form-group checkbox-group" variants={itemVariants}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="destacado"
                checked={formData.destacado}
                onChange={handleChange}
                disabled={loading}
              />
              <span>
                <CheckCircleIcon style={{ fontSize: '18px', marginRight: '5px', verticalAlign: 'middle' }} />
                Destacar este servicio (aparecerá primero en búsquedas)
              </span>
            </label>
          </motion.div>

          {/* Botones */}
          <motion.div className="form-buttons" variants={itemVariants}>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="btn-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" style={{ marginRight: '8px' }} />
                  {servicio ? 'Actualizando...' : 'Publicando...'}
                </>
              ) : (
                <>
                  <CloudUploadIcon style={{ marginRight: '8px', fontSize: '20px' }} />
                  {servicio ? 'Actualizar Servicio' : 'Publicar Servicio'}
                </>
              )}
            </button>
          </motion.div>

          {/* Info adicional */}
          <motion.div className="form-footer info-box" variants={itemVariants}>
            <p>
              <strong>Importante:</strong> Todos los campos marcados con (*) son obligatorios. 
              Los campos views, activo, fecha_creacion y fecha_actualizacion se gestionan automáticamente.
            </p>
          </motion.div>
        </form>
      </motion.div>
    </Modal>
  )
}

ServiceCreator.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  proveedorId: PropTypes.number.isRequired,
  servicio: PropTypes.object,
  onSuccess: PropTypes.func,
}

export default ServiceCreator
