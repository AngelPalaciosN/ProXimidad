"use client"

import { useState, useEffect } from "react"
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap"
import { FaUpload, FaImage } from "react-icons/fa"
import Swal from "sweetalert2"

const ServiceManagementModal = ({ show, onHide, service, user }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    tiempo_entrega: "",
    activo: true,
    imagen: "",
  })
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (service) {
      setFormData({
        nombre: service.nombre || "",
        descripcion: service.descripcion || "",
        precio: service.precio || "",
        categoria: service.categoria || "",
        tiempo_entrega: service.tiempo_entrega || "",
        activo: service.activo !== undefined ? service.activo : true,
        imagen: service.imagen || "",
      })
      setImagePreview(service.imagen || "")
      setIsEditing(true)
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        tiempo_entrega: "",
        activo: true,
        imagen: "",
      })
      setImagePreview("")
      setIsEditing(false)
    }
  }, [service])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          title: "Error",
          text: "Por favor selecciona un archivo de imagen válido",
          icon: "error",
          confirmButtonColor: "#005187",
        })
        return
      }

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
        setImagePreview(result)
        setFormData((prev) => ({
          ...prev,
          imagen: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 2000))

      Swal.fire({
        title: isEditing ? "¡Servicio Actualizado!" : "¡Servicio Creado!",
        text: isEditing
          ? "Tu servicio ha sido actualizado correctamente."
          : "Tu nuevo servicio ha sido creado y está disponible para los clientes.",
        icon: "success",
        confirmButtonColor: "#005187",
      })

      onHide()
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el servicio. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonColor: "#005187",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Editar Servicio" : "Crear Nuevo Servicio"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Alert variant="info">
          {isEditing
            ? "Modifica los datos de tu servicio. Los cambios se reflejarán inmediatamente."
            : "Crea un nuevo servicio para ofrecer a los clientes. Asegúrate de proporcionar información detallada."}
        </Alert>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del servicio *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Desarrollo Web Profesional"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Descripción *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe detalladamente tu servicio..."
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Precio (USD) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      placeholder="1500"
                      min="1"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Categoría *</Form.Label>
                    <Form.Select name="categoria" value={formData.categoria} onChange={handleChange} required>
                      <option value="">Selecciona una categoría</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Diseño">Diseño</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Negocios">Negocios</option>
                      <option value="Educación">Educación</option>
                      <option value="Salud">Salud</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Tiempo de entrega *</Form.Label>
                <Form.Control
                  type="text"
                  name="tiempo_entrega"
                  value={formData.tiempo_entrega}
                  onChange={handleChange}
                  placeholder="Ej: 2-3 semanas"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                  label="Servicio activo (visible para los clientes)"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Imagen del servicio</Form.Label>
                <div className="image-upload-area">
                  {imagePreview ? (
                    <div className="image-preview">
                      <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="img-fluid rounded" />
                      <div className="image-overlay">
                        <Button variant="outline-light" size="sm">
                          <FaImage className="me-2" />
                          Cambiar imagen
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <FaUpload size={32} className="mb-2" />
                      <p>Sube una imagen</p>
                      <small>JPG, PNG (máx. 5MB)</small>
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="d-none"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="upload-label">
                    Seleccionar imagen
                  </label>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || !formData.nombre.trim() || !formData.descripcion.trim()}
        >
          {loading ? "Guardando..." : isEditing ? "Actualizar Servicio" : "Crear Servicio"}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ServiceManagementModal
