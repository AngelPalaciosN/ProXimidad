"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Button, Card, Badge, Modal, Form, Alert } from "react-bootstrap"
import { CheckCircle, FileText, Star, TrendingUp, Plus, Edit2, Eye, Trash2, Clock, User, DollarSign, AlertCircle, CheckCircle as CheckIcon, XCircle } from "lucide-react"
import ServiceCreator from "./ServiceCreator"
import axios from "axios"
import { config } from "../../config/env"
import Swal from "sweetalert2"

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
  
  // Estados para solicitudes
  const [solicitudesRecibidas, setSolicitudesRecibidas] = useState([])
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(false)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null)
  const [respuestaProveedor, setRespuestaProveedor] = useState('')
  const [precioAcordado, setPrecioAcordado] = useState('')
  const [activeTab, setActiveTab] = useState('servicios') // 'servicios' o 'solicitudes'

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
  
  // Cargar solicitudes recibidas
  const cargarSolicitudesRecibidas = async () => {
    if (!proveedorId) return
    
    setLoadingSolicitudes(true)
    try {
      const response = await axios.get(`${config.API_BASE_URL}/solicitudes/proveedor/${proveedorId}/`)
      setSolicitudesRecibidas(response.data.solicitudes || [])
      console.log('✅ Solicitudes recibidas:', response.data.solicitudes)
    } catch (error) {
      console.error('❌ Error al cargar solicitudes:', error)
    } finally {
      setLoadingSolicitudes(false)
    }
  }
  
  useEffect(() => {
    cargarSolicitudesRecibidas()
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
  
  // Handlers para solicitudes
  const handleAbrirModalRespuesta = (solicitud, accion) => {
    setSolicitudSeleccionada({ ...solicitud, accion })
    setRespuestaProveedor('')
    setPrecioAcordado(solicitud.servicio_info?.precio_base || '')
    setShowResponseModal(true)
  }
  
  const handleResponderSolicitud = async () => {
    if (!solicitudSeleccionada) return
    
    const { accion } = solicitudSeleccionada
    const nuevoEstado = accion === 'aceptar' ? 'aceptado' : 'rechazado'
    
    if (!respuestaProveedor.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Respuesta requerida',
        text: 'Por favor escribe una respuesta para el cliente',
      })
      return
    }
    
    try {
      const data = {
        estado: nuevoEstado,
        respuesta_proveedor: respuestaProveedor,
      }
      
      if (accion === 'aceptar' && precioAcordado) {
        data.precio_acordado = parseFloat(precioAcordado)
      }
      
      await axios.put(
        `${config.API_BASE_URL}/solicitudes/${solicitudSeleccionada.id}/actualizar/`,
        data
      )
      
      Swal.fire({
        icon: 'success',
        title: accion === 'aceptar' ? '¡Solicitud Aceptada!' : 'Solicitud Rechazada',
        text: `La solicitud ha sido ${nuevoEstado} y el cliente recibirá un email.`,
        timer: 3000,
      })
      
      setShowResponseModal(false)
      cargarSolicitudesRecibidas()
      
    } catch (error) {
      console.error('Error al responder solicitud:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la solicitud. Inténtalo de nuevo.',
      })
    }
  }
  
  const handleMarcarCompletado = async (solicitudId) => {
    const result = await Swal.fire({
      title: '¿Marcar como completado?',
      text: 'Esto notificará al cliente que el servicio está terminado',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, completado',
      cancelButtonText: 'Cancelar',
    })
    
    if (result.isConfirmed) {
      try {
        await axios.put(
          `${config.API_BASE_URL}/solicitudes/${solicitudId}/actualizar/`,
          { estado: 'completado' }
        )
        
        Swal.fire({
          icon: 'success',
          title: '¡Servicio Completado!',
          text: 'El cliente recibirá un email para calificar el servicio',
          timer: 3000,
        })
        
        cargarSolicitudesRecibidas()
        
      } catch (error) {
        console.error('Error al marcar como completado:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el estado. Inténtalo de nuevo.',
        })
      }
    }
  }
  
  const handleIniciarTrabajo = async (solicitudId) => {
    try {
      await axios.put(
        `${config.API_BASE_URL}/solicitudes/${solicitudId}/actualizar/`,
        { estado: 'en_proceso' }
      )
      
      Swal.fire({
        icon: 'success',
        title: 'Trabajo iniciado',
        text: 'La solicitud ahora está en proceso',
        timer: 2000,
      })
      
      cargarSolicitudesRecibidas()
      
    } catch (error) {
      console.error('Error al iniciar trabajo:', error)
    }
  }
  
  const getStatusBadge = (estado) => {
    const config = {
      pendiente: { bg: 'warning', text: 'Pendiente', icon: Clock },
      aceptado: { bg: 'info', text: 'Aceptado', icon: CheckIcon },
      en_proceso: { bg: 'primary', text: 'En Proceso', icon: TrendingUp },
      completado: { bg: 'success', text: 'Completado', icon: CheckCircle },
      rechazado: { bg: 'danger', text: 'Rechazado', icon: XCircle },
    }
    
    const statusConfig = config[estado] || config.pendiente
    const IconComponent = statusConfig.icon
    
    return (
      <Badge bg={statusConfig.bg} className="d-flex align-items-center gap-1">
        <IconComponent size={14} />
        {statusConfig.text}
      </Badge>
    )
  }
  
  const solicitudesPendientes = solicitudesRecibidas.filter(s => s.estado === 'pendiente').length
  const solicitudesEnProceso = solicitudesRecibidas.filter(s => s.estado === 'en_proceso' || s.estado === 'aceptado').length

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

        {/* Tabs de navegación */}
        <Row className="mt-5">
          <Col>
            <div className="d-flex gap-2 mb-4">
              <Button
                variant={activeTab === 'servicios' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('servicios')}
                className="d-flex align-items-center gap-2"
              >
                <FileText size={18} />
                Mis Servicios
                <Badge bg="light" text="dark">{misServicios.length}</Badge>
              </Button>
              <Button
                variant={activeTab === 'solicitudes' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('solicitudes')}
                className="d-flex align-items-center gap-2"
              >
                <AlertCircle size={18} />
                Solicitudes Recibidas
                {solicitudesPendientes > 0 && (
                  <Badge bg="danger">{solicitudesPendientes}</Badge>
                )}
              </Button>
            </div>
          </Col>
        </Row>

        {/* Contenido según tab activo */}
        {activeTab === 'servicios' && (
          <>
            <Row>
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
          </>
        )}

        {/* Tab de Solicitudes Recibidas */}
        {activeTab === 'solicitudes' && (
          <>
            <Row>
              <Col>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="mb-0">Solicitudes Recibidas</h3>
                  <div className="d-flex gap-2">
                    <Badge bg="warning" className="d-flex align-items-center gap-1">
                      <Clock size={14} />
                      {solicitudesPendientes} Pendientes
                    </Badge>
                    <Badge bg="primary" className="d-flex align-items-center gap-1">
                      <TrendingUp size={14} />
                      {solicitudesEnProceso} En Proceso
                    </Badge>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="mt-3">
              {loadingSolicitudes ? (
                <Col className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </Col>
              ) : solicitudesRecibidas.length === 0 ? (
                <Col className="text-center py-5">
                  <AlertCircle size={48} className="text-muted mb-3" />
                  <p className="text-muted">No has recibido solicitudes aún</p>
                </Col>
              ) : (
                solicitudesRecibidas.map((solicitud) => (
                  <Col lg={6} key={solicitud.id} className="mb-4">
                    <Card className="h-100 shadow-sm solicitud-card">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="mb-1">{solicitud.servicio_nombre}</h5>
                            <small className="text-muted">
                              <User size={14} className="me-1" />
                              {solicitud.cliente_nombre}
                            </small>
                          </div>
                          {getStatusBadge(solicitud.estado)}
                        </div>

                        <div className="solicitud-details mb-3">
                          <div className="mb-2">
                            <strong>Descripción:</strong>
                            <p className="mb-0 text-muted small">{solicitud.descripcion_personalizada}</p>
                          </div>
                          
                          {solicitud.comentarios_adicionales && (
                            <div className="mb-2">
                              <strong>Comentarios:</strong>
                              <p className="mb-0 text-muted small">{solicitud.comentarios_adicionales}</p>
                            </div>
                          )}

                          <div className="d-flex gap-3 mt-3">
                            <div>
                              <small className="text-muted">Urgencia:</small>
                              <Badge 
                                bg={solicitud.urgencia === 'alta' ? 'danger' : solicitud.urgencia === 'media' ? 'warning' : 'success'}
                                className="ms-1"
                              >
                                {solicitud.urgencia}
                              </Badge>
                            </div>
                            {solicitud.presupuesto_maximo && (
                              <div>
                                <small className="text-muted">Presupuesto:</small>
                                <span className="ms-1 fw-bold">${solicitud.presupuesto_maximo.toLocaleString()}</span>
                              </div>
                            )}
                            {solicitud.fecha_preferida && (
                              <div>
                                <small className="text-muted">Inicio:</small>
                                <span className="ms-1">{new Date(solicitud.fecha_preferida).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-2">
                            <small className="text-muted">
                              Recibida: {new Date(solicitud.fecha_solicitud).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </small>
                          </div>

                          {solicitud.respuesta_proveedor && (
                            <Alert variant="info" className="mt-3 mb-0">
                              <strong>Tu respuesta:</strong>
                              <p className="mb-0 small">{solicitud.respuesta_proveedor}</p>
                              {solicitud.precio_acordado && (
                                <div className="mt-1">
                                  <strong>Precio acordado: ${solicitud.precio_acordado.toLocaleString()}</strong>
                                </div>
                              )}
                            </Alert>
                          )}
                        </div>

                        {/* Acciones según el estado */}
                        <div className="d-flex gap-2">
                          {solicitud.estado === 'pendiente' && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                className="flex-fill"
                                onClick={() => handleAbrirModalRespuesta(solicitud, 'aceptar')}
                              >
                                <CheckIcon size={16} className="me-1" />
                                Aceptar
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                className="flex-fill"
                                onClick={() => handleAbrirModalRespuesta(solicitud, 'rechazar')}
                              >
                                <XCircle size={16} className="me-1" />
                                Rechazar
                              </Button>
                            </>
                          )}
                          
                          {solicitud.estado === 'aceptado' && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="w-100"
                              onClick={() => handleIniciarTrabajo(solicitud.id)}
                            >
                              <TrendingUp size={16} className="me-1" />
                              Iniciar Trabajo
                            </Button>
                          )}
                          
                          {solicitud.estado === 'en_proceso' && (
                            <Button
                              variant="success"
                              size="sm"
                              className="w-100"
                              onClick={() => handleMarcarCompletado(solicitud.id)}
                            >
                              <CheckCircle size={16} className="me-1" />
                              Marcar como Completado
                            </Button>
                          )}
                          
                          {(solicitud.estado === 'completado' || solicitud.estado === 'rechazado') && (
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="w-100"
                              disabled
                            >
                              {solicitud.estado === 'completado' ? 'Completado' : 'Rechazado'}
                            </Button>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </>
        )}
      </Container>

      {/* Modal ServiceCreator */}
      <ServiceCreator
        show={showCreator}
        onHide={() => setShowCreator(false)}
        servicio={servicioEditando}
        proveedorId={proveedorId}
        onSuccess={handleSuccessCreator}
      />

      {/* Modal de Respuesta a Solicitud */}
      <Modal 
        show={showResponseModal} 
        onHide={() => setShowResponseModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {solicitudSeleccionada?.accion === 'aceptar' ? (
              <>
                <CheckIcon size={24} className="text-success me-2" />
                Aceptar Solicitud
              </>
            ) : (
              <>
                <XCircle size={24} className="text-danger me-2" />
                Rechazar Solicitud
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {solicitudSeleccionada && (
            <>
              <Alert variant="info">
                <strong>Cliente:</strong> {solicitudSeleccionada.cliente_nombre}<br />
                <strong>Servicio:</strong> {solicitudSeleccionada.servicio_nombre}<br />
                <strong>Urgencia:</strong> {solicitudSeleccionada.urgencia}
              </Alert>

              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>
                    {solicitudSeleccionada.accion === 'aceptar' 
                      ? 'Mensaje de aceptación *' 
                      : 'Razón del rechazo *'
                    }
                  </strong>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={respuestaProveedor}
                  onChange={(e) => setRespuestaProveedor(e.target.value)}
                  placeholder={
                    solicitudSeleccionada.accion === 'aceptar'
                      ? 'Ej: Con gusto puedo realizar este trabajo. Tengo experiencia en proyectos similares...'
                      : 'Ej: Lamentablemente no puedo atender tu solicitud en este momento debido a...'
                  }
                />
              </Form.Group>

              {solicitudSeleccionada.accion === 'aceptar' && (
                <Form.Group className="mb-3">
                  <Form.Label>
                    <DollarSign size={18} className="me-1" />
                    <strong>Precio Acordado (opcional)</strong>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={precioAcordado}
                    onChange={(e) => setPrecioAcordado(e.target.value)}
                    placeholder="Ej: 1500"
                    min="0"
                    step="0.01"
                  />
                  <Form.Text className="text-muted">
                    Si no especificas un precio, se usará el precio base del servicio
                  </Form.Text>
                </Form.Group>
              )}

              <Alert variant={solicitudSeleccionada.accion === 'aceptar' ? 'success' : 'warning'}>
                <small>
                  {solicitudSeleccionada.accion === 'aceptar' 
                    ? '✅ El cliente recibirá un email con tu aceptación y tu información de contacto.'
                    : '⚠️ El cliente recibirá un email notificando el rechazo de su solicitud.'
                  }
                </small>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowResponseModal(false)}>
            Cancelar
          </Button>
          <Button
            variant={solicitudSeleccionada?.accion === 'aceptar' ? 'success' : 'danger'}
            onClick={handleResponderSolicitud}
            disabled={!respuestaProveedor.trim()}
          >
            {solicitudSeleccionada?.accion === 'aceptar' ? (
              <>
                <CheckIcon size={18} className="me-1" />
                Confirmar Aceptación
              </>
            ) : (
              <>
                <XCircle size={18} className="me-1" />
                Confirmar Rechazo
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  )
}
