"use client"

import { useState } from "react"
import { Modal, Row, Col, Card, Button, Badge, Carousel, Tab, Tabs } from "react-bootstrap"
import {
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaHeart,
  FaShare,
  FaCheckCircle,
  FaShoppingCart,
  FaThumbsUp,
  FaTools,
  FaAward,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa"
import PropTypes from "prop-types"
import ServiceRequestModal from "./ServiceRequestModal"

const ServiceDetailModal = ({ show, onHide, service, user, onToggleFavorite, isFavorite }) => {
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  if (!service) return null

  const handleProviderClick = (providerInfo) => {
    if (providerInfo?.id) {
      // Crear evento para abrir perfil del proveedor
      const event = new CustomEvent('openUserProfile', {
        detail: { userId: providerInfo.id }
      })
      window.dispatchEvent(event)
      onHide() // Cerrar el modal actual
    }
  }

  const handleImageError = (e) => {
    e.target.src = "/placeholder.svg"
  }

  // Usar datos reales del servicio directamente como Lista_usuarios
  const serviceDetails = {
    ...service,
    nombre: service.nombre_servicio,
    precio: parseFloat(service.precio_base) || 0,
    tiempo_entrega: "7-10 días laborales",
    disponible: service.activo,
    calificacion: service.promedio_calificacion || 4.5,
    galeria: [
      service.imagen_url,
      service.proveedor_info?.banner_url,
      service.proveedor_info?.imagen_url,
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop"
    ].filter(Boolean),
    descripcion_completa: service.descripcion,
    estadisticas: {
      proyectos_completados: service.proveedor_info?.servicios_completados || 0,
      tiempo_respuesta: "< 2 horas",
      tasa_satisfaccion: "98%",
      clientes_recurrentes: "85%",
    },
  }

  const handleRequestService = () => {
    setShowRequestModal(true)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar key={index} className={index < rating ? "star-filled" : "star-empty"} />
    ))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <>
      <Modal show={show} onHide={onHide} size="xl" centered className="service-detail-modal">
        <Modal.Header closeButton className="border-0">
          <div className="modal-header-content">
            <div className="service-category">
              <Badge bg="primary">{serviceDetails.categoria}</Badge>
            </div>
            <div className="header-actions">
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => onToggleFavorite(service.id)}
                className="action-btn"
              >
                <FaHeart className={isFavorite ? "favorited" : ""} />
              </Button>
              <Button variant="outline-light" size="sm" className="action-btn">
                <FaShare />
              </Button>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body className="p-0">
          <div className="service-detail-content">
            {/* Hero Section */}
            <div className="service-hero">
              <Row className="g-0">
                <Col lg={7}>
                  <div className="image-gallery">
                    <Carousel
                      activeIndex={activeImageIndex}
                      onSelect={setActiveImageIndex}
                      indicators={false}
                      controls={serviceDetails.galeria.length > 1}
                    >
                      {serviceDetails.galeria.map((imagen, index) => (
                        <Carousel.Item key={index}>
                          <img
                            src={imagen || "/placeholder.svg"}
                            alt={`${serviceDetails.nombre} ${index + 1}`}
                            className="gallery-image"
                            onError={handleImageError}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                    {serviceDetails.galeria.length > 1 && (
                      <div className="image-thumbnails">
                        {serviceDetails.galeria.slice(0, 4).map((imagen, index) => (
                          <div
                            key={index}
                            className={`thumbnail ${index === activeImageIndex ? "active" : ""}`}
                            onClick={() => setActiveImageIndex(index)}
                          >
                            <img 
                              src={imagen || "/placeholder.svg"} 
                              alt={`Thumbnail ${index + 1}`}
                              onError={handleImageError}
                            />
                            {index === 3 && serviceDetails.galeria.length > 4 && (
                              <div className="more-images">+{serviceDetails.galeria.length - 4}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Col>
                <Col lg={5}>
                  <div className="service-summary">
                    <h2 className="service-title">{serviceDetails.nombre}</h2>

                    {/* Provider Info - Expandida */}
                    <div className="provider-card expanded" onClick={() => handleProviderClick(service.proveedor_info)} role="button" tabIndex="0">
                      {service.proveedor_info?.banner_url && (
                        <div className="provider-banner-background">
                          <img
                            src={service.proveedor_info.banner_url}
                            alt="Banner del proveedor"
                            className="provider-banner-img"
                            onError={(e) => { 
                              e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=300&fit=crop"; 
                            }}
                          />
                        </div>
                      )}
                      <div className="provider-header expanded">
                        <div className="provider-avatar-section">
                          <img
                            src={service.proveedor_info?.imagen_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                            alt={service.proveedor_info?.nombre_completo || service.proveedor_nombre || "Usuario"}
                            className="provider-avatar large"
                            onError={(e) => { 
                              e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"; 
                            }}
                          />
                          <div className="provider-badge">
                            <FaCheckCircle className="verified-icon" />
                            <small>Verificado</small>
                          </div>
                        </div>
                        <div className="provider-info expanded">
                          <h4>{service.proveedor_info?.nombre_completo || service.proveedor_nombre || "Usuario"}</h4>
                          <p className="provider-title">{service.categoria_nombre || "Proveedor de servicios"}</p>
                          <div className="provider-rating">
                            {renderStars(Math.floor(serviceDetails.calificacion || 4.5))}
                            <span className="rating-number">({serviceDetails.calificacion || 4.5})</span>
                            <Badge bg="success" className="ms-2">PRO</Badge>
                          </div>
                          <div className="provider-location">
                            <FaMapMarkerAlt />
                            <span>{service.proveedor_info?.direccion || service.ubicacion || "Ubicación no especificada"}</span>
                          </div>
                          <div className="provider-experience">
                            <FaAward />
                            <span>Proveedor verificado</span>
                          </div>
                        </div>
                        <div className="provider-nav-hint">
                          <FaArrowRight className="me-1" />
                          <small>Ver perfil completo</small>
                        </div>
                      </div>

                      <div className="provider-stats expanded">
                        <div className="stat">
                          <FaCheckCircle className="stat-icon success" />
                          <div>
                            <strong>{service.proveedor_info?.servicios_completados || 0}</strong>
                            <small>Proyectos completados</small>
                          </div>
                        </div>
                        <div className="stat">
                          <FaClock className="stat-icon info" />
                          <div>
                            <strong>&lt; 2 horas</strong>
                            <small>Tiempo de respuesta</small>
                          </div>
                        </div>
                        <div className="stat">
                          <FaThumbsUp className="stat-icon primary" />
                          <div>
                            <strong>{Math.round((serviceDetails.calificacion || 4.5) * 20)}%</strong>
                            <small>Satisfacción</small>
                          </div>
                        </div>
                        <div className="stat">
                          <FaUser className="stat-icon warning" />
                          <div>
                            <strong>{service.views || 0}</strong>
                            <small>Visualizaciones</small>
                          </div>
                        </div>
                      </div>
                      
                      <div className="provider-skills">
                        <h6>Especialidades:</h6>
                        <div className="skills-tags">
                          <Badge bg="outline-primary" className="skill-tag">{service.categoria_nombre}</Badge>
                          <Badge bg="outline-secondary" className="skill-tag">Profesional</Badge>
                          <Badge bg="outline-success" className="skill-tag">Rápido</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="pricing-card">
                      <div className="price-header">
                        <div className="price">
                          <span className="currency">$</span>
                          <span className="amount">{serviceDetails.precio.toLocaleString()}</span>
                        </div>
                        <div className="delivery-time">
                          <FaClock />
                          <span>Entrega en {serviceDetails.tiempo_entrega}</span>
                        </div>
                      </div>

                      <div className="pricing-features">
                        <div className="feature">
                          <FaCheckCircle />
                          <span>Consulta inicial gratuita</span>
                        </div>
                        <div className="feature">
                          <FaCheckCircle />
                          <span>Revisiones incluidas</span>
                        </div>
                        <div className="feature">
                          <FaCheckCircle />
                          <span>Soporte 30 días</span>
                        </div>
                        <div className="feature">
                          <FaShieldAlt />
                          <span>{serviceDetails.garantia}</span>
                        </div>
                      </div>

                      <div className="action-buttons">
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={handleRequestService}
                          disabled={!serviceDetails.disponible}
                          className="request-btn"
                        >
                          <FaShoppingCart className="me-2" />
                          {serviceDetails.disponible ? "Solicitar Servicio" : "No Disponible"}
                        </Button>
                        <Button variant="outline-primary" size="lg" className="contact-btn">
                          <FaUser className="me-2" />
                          Contactar
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Tabs Content */}
            <div className="service-tabs">
              <Tabs defaultActiveKey="descripcion" className="custom-tabs">
                <Tab eventKey="descripcion" title="Descripción">
                  <div className="tab-content-wrapper">
                    <Row>
                      <Col lg={8}>
                        <div className="description-content">
                          <h4>Sobre este servicio</h4>
                          <div className="description-text">
                            {serviceDetails.descripcion_completa.split("\n").map((paragraph, index) => (
                              <p key={index}>{paragraph}</p>
                            ))}
                          </div>

                          <h5>¿Qué incluye?</h5>
                          <div className="includes-list">
                            {serviceDetails.incluye.map((item, index) => (
                              <div key={index} className="include-item">
                                <FaCheckCircle className="check-icon" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>

                          <div className="tags-section">
                            <h6>Tecnologías y herramientas:</h6>
                            <div className="service-tags">
                              {(serviceDetails.tags || [service.categoria_nombre]).map((tag, index) => (
                                <Badge key={index} bg="secondary" className="service-tag">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div className="sidebar-info">
                          <Card className="info-card">
                            <Card.Header>
                              <FaTools className="me-2" />
                              Certificaciones
                            </Card.Header>
                            <Card.Body>
                              {serviceDetails.certificaciones.map((cert, index) => (
                                <div key={index} className="certification">
                                  <FaAward className="cert-icon" />
                                  <span>{cert}</span>
                                </div>
                              ))}
                            </Card.Body>
                          </Card>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Tab>

                <Tab eventKey="proceso" title="Proceso">
                  <div className="tab-content-wrapper">
                    <h4>¿Cómo trabajamos?</h4>
                    <div className="process-timeline">
                      {serviceDetails.proceso.map((paso, index) => (
                        <div key={index} className="process-step">
                          <div className="step-number">{paso.paso}</div>
                          <div className="step-content">
                            <h5>{paso.titulo}</h5>
                            <p>{paso.descripcion}</p>
                            <div className="step-duration">
                              <FaClock />
                              <span>Duración: {paso.duracion}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab>

                <Tab eventKey="reseñas" title={`Reseñas (${serviceDetails.reseñas.length})`}>
                  <div className="tab-content-wrapper">
                    <div className="reviews-header">
                      <div className="rating-summary">
                        <div className="overall-rating">
                          <span className="rating-number">{serviceDetails.calificacion}</span>
                          <div className="rating-stars">
                            {renderStars(Math.floor(serviceDetails.calificacion))}
                          </div>
                          <span className="rating-text">Excelente</span>
                        </div>
                        <div className="rating-stats">
                          <div className="stat">
                            <span>5 estrellas</span>
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: "80%" }}></div>
                            </div>
                            <span>80%</span>
                          </div>
                          <div className="stat">
                            <span>4 estrellas</span>
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: "15%" }}></div>
                            </div>
                            <span>15%</span>
                          </div>
                          <div className="stat">
                            <span>3 estrellas</span>
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: "5%" }}></div>
                            </div>
                            <span>5%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="reviews-list">
                      {serviceDetails.reseñas.map((reseña) => (
                        <div key={reseña.id} className="review-item">
                          <div className="review-header">
                            <img
                              src={reseña.avatar || "/placeholder.svg"}
                              alt={reseña.usuario}
                              className="reviewer-avatar"
                            />
                            <div className="reviewer-info">
                              <h6>{reseña.usuario}</h6>
                              <div className="review-meta">
                                <div className="review-rating">{renderStars(reseña.calificacion)}</div>
                                <span className="review-date">{formatDate(reseña.fecha)}</span>
                              </div>
                              <div className="review-project">
                                <FaTools className="me-1" />
                                {reseña.proyecto}
                              </div>
                            </div>
                          </div>
                          <div className="review-content">
                            <p>{reseña.comentario}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <ServiceRequestModal
        show={showRequestModal}
        onHide={() => setShowRequestModal(false)}
        service={serviceDetails}
        user={user}
      />
    </>
  )
}

ServiceDetailModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  service: PropTypes.shape({
    id: PropTypes.number,
    nombre_servicio: PropTypes.string,
    descripcion: PropTypes.string,
    precio_base: PropTypes.string,
    imagen_url: PropTypes.string,
    activo: PropTypes.bool,
    promedio_calificacion: PropTypes.number,
    tiempo_entrega: PropTypes.string,
    categoria_nombre: PropTypes.string,
    proveedor_nombre: PropTypes.string,
    ubicacion: PropTypes.string,
    views: PropTypes.number,
    proveedor_info: PropTypes.shape({
      id: PropTypes.number,
      nombre_completo: PropTypes.string,
      imagen_url: PropTypes.string,
      banner_url: PropTypes.string,
      direccion: PropTypes.string, 
      servicios_completados: PropTypes.number
    })
  }),
  user: PropTypes.object,
  onToggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired
}

export default ServiceDetailModal
