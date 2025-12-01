"use client"

import { useState, useRef } from "react"
import { Modal, Form, Button, Alert, Row, Col, Badge } from "react-bootstrap"
import {
  FaCloudUploadAlt,
  FaImage,
  FaTrash,
  FaDollarSign,
  FaClock,
  FaTag,
  FaFileAlt,
  FaPlus,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaListUl,
  FaInfoCircle,
} from "react-icons/fa"

const ServiceUploadModal = ({ show, onHide, proveedor, onServiceCreated }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    precio: "",
    tiempo_entrega: "",
    incluye: [],
    tags: [],
  })
  const [imagenes, setImagenes] = useState([])
  const [nuevoIncluye, setNuevoIncluye] = useState("")
  const [nuevoTag, setNuevoTag] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  const categorias = [
    "Desarrollo Web",
    "Diseño Gráfico",
    "Marketing Digital",
    "Fotografía",
    "Video y Animación",
    "Redacción y Traducción",
    "Consultoría",
    "Soporte Técnico",
    "Educación y Tutorías",
    "Otros",
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (imagenes.length + files.length > 5) {
      setErrors((prev) => ({ ...prev, imagenes: "Máximo 5 imágenes permitidas" }))
      return
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }))

    setImagenes((prev) => [...prev, ...newImages])
    setErrors((prev) => ({ ...prev, imagenes: null }))
  }

  const removeImage = (index) => {
    setImagenes((prev) => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  const addIncluye = () => {
    if (nuevoIncluye.trim() && formData.incluye.length < 10) {
      setFormData((prev) => ({
        ...prev,
        incluye: [...prev.incluye, nuevoIncluye.trim()],
      }))
      setNuevoIncluye("")
    }
  }

  const removeIncluye = (index) => {
    setFormData((prev) => ({
      ...prev,
      incluye: prev.incluye.filter((_, i) => i !== index),
    }))
  }

  const addTag = () => {
    if (nuevoTag.trim() && formData.tags.length < 5) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, nuevoTag.trim()],
      }))
      setNuevoTag("")
    }
  }

  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción es requerida"
    if (!formData.categoria) newErrors.categoria = "Selecciona una categoría"
    if (!formData.precio || formData.precio <= 0) newErrors.precio = "Ingresa un precio válido"
    if (!formData.tiempo_entrega) newErrors.tiempo_entrega = "Indica el tiempo de entrega"
    if (imagenes.length === 0) newErrors.imagenes = "Sube al menos una imagen"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      // Simular envío
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
        onHide()
        // Reset form
        setFormData({
          nombre: "",
          descripcion: "",
          categoria: "",
          precio: "",
          tiempo_entrega: "",
          incluye: [],
          tags: [],
        })
        setImagenes([])
        if (onServiceCreated) onServiceCreated()
      }, 3000)
    } catch (error) {
      console.error("Error al crear servicio:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      e.preventDefault()
      action()
    }
  }

  // Pantalla de éxito
  if (showSuccess) {
    return (
      <Modal show={show} onHide={onHide} size="md" centered className="service-upload-modal">
        <Modal.Body className="text-center p-5">
          <div className="success-animation mb-4">
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
          </div>
          <h3 className="text-success mb-3">¡Servicio Creado!</h3>
          <p className="mb-4">
            Tu servicio <strong>{formData.nombre}</strong> ha sido publicado exitosamente y ya está visible para los
            clientes.
          </p>
          <div className="alert alert-info">
            <small>
              <FaInfoCircle className="me-2" />
              Recibirás notificaciones cuando alguien solicite tu servicio.
            </small>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" centered className="service-upload-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <FaCloudUploadAlt className="me-2" />
          Crear Nuevo Servicio
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Sección de Imágenes */}
          <div className="upload-section mb-4">
            <h5 className="section-title">
              <FaImage className="me-2" />
              Imágenes del Servicio
              <small className="text-muted ms-2">({imagenes.length}/5)</small>
            </h5>

            <div className="images-grid">
              {imagenes.map((img, index) => (
                <div key={index} className="image-preview-card">
                  <img src={img.preview || "/placeholder.svg"} alt={`Preview ${index + 1}`} />
                  <button type="button" className="remove-image-btn" onClick={() => removeImage(index)}>
                    <FaTrash />
                  </button>
                  {index === 0 && (
                    <Badge bg="primary" className="main-badge">
                      Principal
                    </Badge>
                  )}
                </div>
              ))}

              {imagenes.length < 5 && (
                <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                  <FaPlus className="upload-icon" />
                  <span>Agregar imagen</span>
                </div>
              )}
            </div>

            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" multiple hidden />

            {errors.imagenes && (
              <Alert variant="danger" className="mt-2 py-2">
                <FaExclamationTriangle className="me-2" />
                {errors.imagenes}
              </Alert>
            )}

            <small className="text-muted d-block mt-2">
              La primera imagen será la principal. Formatos: JPG, PNG, WEBP. Máximo 5MB por imagen.
            </small>
          </div>

          <Row>
            {/* Información básica */}
            <Col lg={6}>
              <div className="form-section">
                <h5 className="section-title">
                  <FaFileAlt className="me-2" />
                  Información Básica
                </h5>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Nombre del servicio *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Diseño de logotipo profesional"
                    isInvalid={!!errors.nombre}
                    className="form-control-lg"
                  />
                  <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Descripción detallada *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Describe tu servicio en detalle: qué incluye, proceso de trabajo, requisitos del cliente..."
                    isInvalid={!!errors.descripcion}
                    className="form-control-lg"
                  />
                  <Form.Control.Feedback type="invalid">{errors.descripcion}</Form.Control.Feedback>
                  <Form.Text className="text-muted">{formData.descripcion.length}/1000 caracteres</Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Categoría *</Form.Label>
                  <Form.Select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    isInvalid={!!errors.categoria}
                    className="form-control-lg"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.categoria}</Form.Control.Feedback>
                </Form.Group>
              </div>
            </Col>

            {/* Precio y entrega */}
            <Col lg={6}>
              <div className="form-section">
                <h5 className="section-title">
                  <FaDollarSign className="me-2" />
                  Precio y Entrega
                </h5>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <FaDollarSign className="me-1" />
                        Precio base *
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        isInvalid={!!errors.precio}
                        className="form-control-lg"
                      />
                      <Form.Control.Feedback type="invalid">{errors.precio}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <FaClock className="me-1" />
                        Tiempo de entrega *
                      </Form.Label>
                      <Form.Select
                        name="tiempo_entrega"
                        value={formData.tiempo_entrega}
                        onChange={handleChange}
                        isInvalid={!!errors.tiempo_entrega}
                        className="form-control-lg"
                      >
                        <option value="">Seleccionar</option>
                        <option value="1 día">1 día</option>
                        <option value="2-3 días">2-3 días</option>
                        <option value="1 semana">1 semana</option>
                        <option value="2 semanas">2 semanas</option>
                        <option value="1 mes">1 mes</option>
                        <option value="A acordar">A acordar</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.tiempo_entrega}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Qué incluye */}
                <div className="mb-3">
                  <Form.Label className="fw-bold">
                    <FaListUl className="me-1" />
                    ¿Qué incluye? ({formData.incluye.length}/10)
                  </Form.Label>
                  <div className="input-with-button">
                    <Form.Control
                      type="text"
                      value={nuevoIncluye}
                      onChange={(e) => setNuevoIncluye(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, addIncluye)}
                      placeholder="Ej: 3 revisiones incluidas"
                      disabled={formData.incluye.length >= 10}
                    />
                    <Button
                      variant="outline-primary"
                      onClick={addIncluye}
                      disabled={!nuevoIncluye.trim() || formData.incluye.length >= 10}
                    >
                      <FaPlus />
                    </Button>
                  </div>
                  <div className="items-list mt-2">
                    {formData.incluye.map((item, index) => (
                      <div key={index} className="item-badge">
                        <FaCheckCircle className="me-1 text-success" />
                        {item}
                        <button type="button" onClick={() => removeIncluye(index)}>
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-3">
                  <Form.Label className="fw-bold">
                    <FaTag className="me-1" />
                    Etiquetas ({formData.tags.length}/5)
                  </Form.Label>
                  <div className="input-with-button">
                    <Form.Control
                      type="text"
                      value={nuevoTag}
                      onChange={(e) => setNuevoTag(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, addTag)}
                      placeholder="Ej: diseño, logo, branding"
                      disabled={formData.tags.length >= 5}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={addTag}
                      disabled={!nuevoTag.trim() || formData.tags.length >= 5}
                    >
                      <FaPlus />
                    </Button>
                  </div>
                  <div className="tags-list mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} bg="secondary" className="tag-badge">
                        #{tag}
                        <button type="button" onClick={() => removeTag(index)}>
                          <FaTimes />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Preview del servicio */}
          <div className="service-preview mt-4">
            <h5 className="section-title">
              <FaInfoCircle className="me-2" />
              Vista Previa
            </h5>
            <div className="preview-card">
              <div className="preview-image">
                {imagenes[0] ? (
                  <img src={imagenes[0].preview || "/placeholder.svg"} alt="Preview" />
                ) : (
                  <div className="no-image">
                    <FaImage />
                    <span>Sin imagen</span>
                  </div>
                )}
              </div>
              <div className="preview-content">
                <h6>{formData.nombre || "Nombre del servicio"}</h6>
                <p>{formData.descripcion?.substring(0, 100) || "Descripción del servicio..."}...</p>
                <div className="preview-meta">
                  <span className="price">${formData.precio ? Number(formData.precio).toLocaleString() : "0.00"}</span>
                  <span className="delivery">
                    <FaClock className="me-1" />
                    {formData.tiempo_entrega || "Tiempo de entrega"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading} className="px-4">
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Publicando...
            </>
          ) : (
            <>
              <FaCloudUploadAlt className="me-2" />
              Publicar Servicio
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ServiceUploadModal
