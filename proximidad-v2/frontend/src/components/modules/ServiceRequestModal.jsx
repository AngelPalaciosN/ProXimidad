"use client"

import { useState } from "react"
import { Modal, Form, Button, Alert, Row, Col } from "react-bootstrap"
import { FaCalendarAlt, FaDollarSign, FaFileAlt, FaUser, FaClock, FaExclamationTriangle } from "react-icons/fa"
import axios from "axios"
import { buildApiUrl } from "../../config/env"
import Swal from "sweetalert2"

const ServiceRequestModal = ({ show, onHide, service, user }) => {
  const [formData, setFormData] = useState({
    descripcion_personalizada: "",
    fecha_preferida: "",
    presupuesto_maximo: "",
    urgencia: "media",
    comentarios_adicionales: "",
  })
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validar que el usuario esté logueado
    if (!user || !user.id) {
      Swal.fire({
        icon: 'error',
        title: 'Debes iniciar sesión',
        text: 'Para solicitar un servicio debes estar registrado e iniciar sesión',
      })
      return
    }
    
    setLoading(true)

    try {
      // Preparar datos para enviar
      const solicitudData = {
        servicio: service.id,
        cliente: user.id,
        descripcion_personalizada: formData.descripcion_personalizada,
        urgencia: formData.urgencia,
        fecha_preferida: formData.fecha_preferida || null,
        presupuesto_maximo: formData.presupuesto_maximo || null,
        comentarios_adicionales: formData.comentarios_adicionales || '',
      }
      
      console.log('📤 Enviando solicitud:', solicitudData)
      
      // Enviar solicitud al backend
      const response = await axios.post(buildApiUrl('/solicitudes/crear/'), solicitudData)
      
      console.log('✅ Solicitud creada:', response.data)
      
      setShowSuccess(true)

      // Resetear formulario después de 3 segundos
      setTimeout(() => {
        setShowSuccess(false)
        onHide()
        setFormData({
          descripcion_personalizada: "",
          fecha_preferida: "",
          presupuesto_maximo: "",
          urgencia: "media",
          comentarios_adicionales: "",
        })
      }, 3000)
      
    } catch (error) {
      console.error("❌ Error al enviar solicitud:", error)
      
      Swal.fire({
        icon: 'error',
        title: 'Error al enviar solicitud',
        text: error.response?.data?.error || 'No se pudo enviar la solicitud. Inténtalo de nuevo.',
      })
      
    } finally {
      setLoading(false)
    }
  }

  if (!service) return null

  if (showSuccess) {
    return (
      <Modal show={show} onHide={onHide} size="md" centered>
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
          <h3 className="text-success mb-3">¡Solicitud Enviada!</h3>
          <p className="mb-4">
            Tu solicitud ha sido enviada a <strong>{service.proveedor_info?.nombre_completo || service.proveedor_nombre || 'el proveedor'}</strong>. Recibirás un email de confirmación y te notificaremos cuando responda.
          </p>
          <div className="alert alert-info">
            <small>
              <FaClock className="me-2" />
              Tiempo de respuesta promedio: 24-48 horas
            </small>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="service-request-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <FaFileAlt className="me-2" />
          Solicitar Servicio
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="service-summary mb-4">
          <Row>
            <Col md={4}>
              <img
                src={service.imagen || "/placeholder.svg"}
                alt={service.nombre}
                className="img-fluid rounded shadow-sm"
              />
            </Col>
            <Col md={8}>
              <h5 className="text-primary">{service.nombre}</h5>
              <p className="text-muted mb-3">{service.descripcion}</p>
              <div className="service-details">
                <div className="detail-item">
                  <FaUser className="me-2 text-primary" />
                  <strong>Proveedor:</strong> {service.proveedor_info?.nombre || service.proveedor?.nombre || "No especificado"}
                  <span className="rating ms-2">⭐ {service.calificacion || service.proveedor?.calificacion || 4.5}</span>
                </div>
                <div className="detail-item">
                  <FaDollarSign className="me-2 text-success" />
                  <strong>Precio base:</strong> ${service.precio?.toLocaleString() || "Por acordar"}
                </div>
                <div className="detail-item">
                  <FaClock className="me-2 text-info" />
                  <strong>Tiempo de entrega:</strong> {service.duracion || service.tiempo_entrega || "A acordar"}
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <Alert variant="info" className="d-flex align-items-center">
          <FaExclamationTriangle className="me-2" />
          <div>
            <strong>Información importante:</strong> Esta solicitud será enviada directamente al proveedor. Te
            notificaremos cuando responda a tu solicitud.
          </div>
        </Alert>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  <FaFileAlt className="me-2" />
                  Descripción detallada del proyecto *
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="descripcion_personalizada"
                  value={formData.descripcion_personalizada}
                  onChange={handleChange}
                  placeholder="Describe detalladamente lo que necesitas, incluye especificaciones técnicas, objetivos, público objetivo, etc..."
                  required
                  className="form-control-lg"
                />
                <Form.Text className="text-muted">
                  Mientras más detalles proporciones, mejor será la propuesta del proveedor.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  <FaCalendarAlt className="me-2" />
                  Fecha preferida de inicio
                </Form.Label>
                <Form.Control
                  type="date"
                  name="fecha_preferida"
                  value={formData.fecha_preferida}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="form-control-lg"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  <FaDollarSign className="me-2" />
                  Presupuesto máximo (opcional)
                </Form.Label>
                <Form.Control
                  type="number"
                  name="presupuesto_maximo"
                  value={formData.presupuesto_maximo}
                  onChange={handleChange}
                  placeholder="Ej: 2000"
                  min="0"
                  className="form-control-lg"
                />
                <Form.Text className="text-muted">Esto ayuda al proveedor a ajustar su propuesta.</Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  <FaClock className="me-2" />
                  Urgencia del proyecto
                </Form.Label>
                <Form.Select
                  name="urgencia"
                  value={formData.urgencia}
                  onChange={handleChange}
                  className="form-control-lg"
                >
                  <option value="baja">🟢 Baja - Tengo tiempo flexible</option>
                  <option value="media">🟡 Media - Fecha estándar</option>
                  <option value="alta">🔴 Alta - Lo necesito pronto</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <div className="urgency-info p-3 bg-light rounded">
                <small className="text-muted">
                  <strong>Nota:</strong> Los proyectos urgentes pueden tener un costo adicional del 15-30%.
                </small>
              </div>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Comentarios adicionales</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="comentarios_adicionales"
              value={formData.comentarios_adicionales}
              onChange={handleChange}
              placeholder="Referencias, inspiraciones, archivos que proporcionarás, reuniones necesarias, etc..."
              className="form-control-lg"
            />
          </Form.Group>

          <div className="request-summary p-3 bg-light rounded mb-3">
            <h6 className="mb-2">Resumen de tu solicitud:</h6>
            <ul className="mb-0">
              <li>
                <strong>Servicio:</strong> {service.nombre}
              </li>
              <li>
                <strong>Proveedor:</strong> {service.proveedor.nombre}
              </li>
              <li>
                <strong>Precio base:</strong> ${service.precio.toLocaleString()}
              </li>
              {formData.presupuesto_maximo && (
                <li>
                  <strong>Tu presupuesto máximo:</strong> $
                  {Number.parseInt(formData.presupuesto_maximo).toLocaleString()}
                </li>
              )}
              <li>
                <strong>Urgencia:</strong> {formData.urgencia}
              </li>
            </ul>
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || !formData.descripcion_personalizada.trim()}
          className="px-4"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Enviando...
            </>
          ) : (
            <>
              <FaFileAlt className="me-2" />
              Enviar Solicitud
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ServiceRequestModal
