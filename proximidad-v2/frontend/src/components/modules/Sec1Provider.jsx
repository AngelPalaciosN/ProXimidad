"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Button, Card, Badge } from "react-bootstrap"
import { CheckCircle, FileText, Star, TrendingUp, Plus, Edit2, Eye, Trash2 } from "lucide-react"
import ServiceCreator from "./ServiceCreator"
import axios from "axios"
import { config } from "../../config/env"

export default function Sec1Provider({ serviciosExitosos = 0, serviciosCreados = 0, calificacionGeneral = 0, proveedorId }) {
  const [animatedValues, setAnimatedValues] = useState({
    exitosos: 0,
    creados: 0,
  })

  // Estados para modal y servicios
  const [showCreator, setShowCreator] = useState(false)
  const [servicioEditando, setServicioEditando] = useState(null)
  const [misServicios, setMisServicios] = useState([])
  const [loadingServicios, setLoadingServicios] = useState(false)

  // Cargar servicios del proveedor
  const cargarMisServicios = async () => {
    if (!proveedorId) return
    
    setLoadingServicios(true)
    try {
      const response = await axios.get(`${config.API_BASE_URL}/servicios/mis-servicios/?proveedor_id=${proveedorId}`)
      setMisServicios(response.data.servicios || [])
      console.log('Servicios cargados:', response.data.servicios)
    } catch (error) {
      console.error('Error al cargar servicios:', error)
    } finally {
      setLoadingServicios(false)
    }
  }

  // Cargar servicios al montar
  useEffect(() => {
    cargarMisServicios()
  }, [proveedorId])

  // Animación de conteo
  useEffect(() => {
    const duration = 1500
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setAnimatedValues({
        exitosos: Math.round(serviciosExitosos * easeOut),
        creados: Math.round(serviciosCreados * easeOut),
      })

      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [serviciosExitosos, serviciosCreados])

  // Handlers
  const handleCrearServicio = () => {
    setServicioEditando(null)
    setShowCreator(true)
  }

  const handleEditarServicio = (servicio) => {
    setServicioEditando(servicio)
    setShowCreator(true)
  }

  const handleEliminarServicio = async (servicioId) => {
    if (!window.confirm('¿Estás seguro de eliminar este servicio?')) return
    
    try {
      await axios.delete(`${config.API_BASE_URL}/servicios/${servicioId}/eliminar/`)
      cargarMisServicios()
    } catch (error) {
      console.error('Error al eliminar servicio:', error)
      alert('Error al eliminar el servicio')
    }
  }

  const handleSuccessCreator = () => {
    cargarMisServicios()
  }

  // Renderizar estrellas (1-5)
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="star-icon filled" size={24} fill="#FFD700" color="#FFD700" />)
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <span key={i} className="star-half-wrapper">
            <Star className="star-icon half-bg" size={24} color="#ddd" />
            <Star className="star-icon half-fill" size={24} fill="#FFD700" color="#FFD700" />
          </span>,
        )
      } else {
        stars.push(<Star key={i} className="star-icon empty" size={24} color="#ddd" />)
      }
    }
    return stars
  }

  // Calcular tasa de éxito
  const tasaExito = serviciosCreados > 0 ? Math.round((serviciosExitosos / serviciosCreados) * 100) : 0

  return (
    <section className="sec1 sec1-provider" id="panel-proveedor">
      <Container>
        <div className="section-header text-center mb-5">
          <h2 className="display-5 fw-bold">Panel del Proveedor</h2>
          <p className="lead text-muted">Resumen de tu rendimiento y servicios</p>
        </div>

        <Row className="g-4">
          <Col lg={3} md={6}>
            <div className="metric-card" id="metric-exitosos">
              <div className="metric-icon">
                <CheckCircle size={40} />
              </div>
              <div className="metric-content">
                <span className="metric-value">{animatedValues.exitosos}</span>
                <h3 className="metric-label">Servicios Exitosos</h3>
                <p className="metric-description">Completados satisfactoriamente</p>
              </div>
            </div>
          </Col>

          <Col lg={3} md={6}>
            <div className="metric-card" id="metric-creados">
              <div className="metric-icon">
                <FileText size={40} />
              </div>
              <div className="metric-content">
                <span className="metric-value">{animatedValues.creados}</span>
                <h3 className="metric-label">Servicios Creados</h3>
                <p className="metric-description">Total de servicios ofrecidos</p>
              </div>
            </div>
          </Col>

          <Col lg={3} md={6}>
            <div className="metric-card" id="metric-rating">
              <div className="metric-icon">
                <Star size={40} />
              </div>
              <div className="metric-content">
                <div className="stars-container d-flex gap-1 mb-2">{renderStars(calificacionGeneral)}</div>
                <span className="metric-value rating-value">{calificacionGeneral.toFixed(1)}</span>
                <h3 className="metric-label">Calificación General</h3>
                <p className="metric-description">Promedio de tus clientes</p>
              </div>
            </div>
          </Col>

          <Col lg={3} md={6}>
            <div className="metric-card" id="metric-tasa">
              <div className="metric-icon">
                <TrendingUp size={40} />
              </div>
              <div className="metric-content">
                <span className="metric-value">
                  {tasaExito}
                  <span className="metric-suffix">%</span>
                </span>
                <h3 className="metric-label">Tasa de Éxito</h3>
                <p className="metric-description">Ratio de finalización</p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Botón Crear Servicio */}
        <Row className="mt-5">
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="mb-0">Mis Servicios</h3>
              <Button variant="primary" size="lg" onClick={handleCrearServicio}>
                <Plus size={20} className="me-2" />
                Crear Nuevo Servicio
              </Button>
            </div>
          </Col>
        </Row>

        {/* Lista de Servicios */}
        <Row className="mt-3">
          {loadingServicios ? (
            <Col className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </Col>
          ) : misServicios.length === 0 ? (
            <Col className="text-center py-5">
              <FileText size={48} className="text-muted mb-3" />
              <p className="text-muted">No tienes servicios creados aún</p>
              <Button variant="outline-primary" onClick={handleCrearServicio}>
                Crear tu primer servicio
              </Button>
            </Col>
          ) : (
            misServicios.map((servicio) => (
              <Col lg={4} md={6} key={servicio.id} className="mb-4">
                <Card className="h-100 shadow-sm servicio-card">
                  {servicio.imagen && (
                    <Card.Img
                      variant="top"
                      src={servicio.imagen}
                      alt={servicio.nombre_servicio}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="mb-0">{servicio.nombre_servicio}</Card.Title>
                      <Badge bg={servicio.activo ? 'success' : 'secondary'}>
                        {servicio.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <Card.Text className="text-muted small" style={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical' 
                    }}>
                      {servicio.descripcion}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="h5 mb-0 text-primary">${servicio.precio_base}</span>
                      <div className="d-flex gap-1 align-items-center">
                        <Star size={16} fill="#FFD700" color="#FFD700" />
                        <span>{servicio.promedio_calificacion || '0.0'}</span>
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-white border-top-0">
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="flex-fill"
                        onClick={() => handleEditarServicio(servicio)}
                      >
                        <Edit2 size={16} className="me-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleEliminarServicio(servicio.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>

      {/* Modal ServiceCreator */}
      <ServiceCreator
        show={showCreator}
        onHide={() => setShowCreator(false)}
        servicio={servicioEditando}
        proveedorId={proveedorId}
        onSuccess={handleSuccessCreator}
      />
    </section>
  )
}
