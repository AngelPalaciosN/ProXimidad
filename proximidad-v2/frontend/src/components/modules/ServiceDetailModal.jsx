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
} from "react-icons/fa"
import ServiceRequestModal from "./ServiceRequestModal"
import "../scss/component-styles/ServiceDetailModal.scss"

const ServiceDetailModal = ({ show, onHide, service, user, onToggleFavorite, isFavorite }) => {
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  if (!service) return null

  // Datos hardcodeados adicionales para el servicio
  const serviceDetails = {
    ...service,
    galeria: [
      service.imagen,
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop",
    ],
    descripcion_completa: `${service.descripcion}

Este servicio incluye una consulta inicial gratuita donde analizamos tus necesidades específicas y objetivos. Trabajamos con metodologías ágiles y te mantenemos informado en cada etapa del proceso.

Nuestro enfoque se basa en la calidad, innovación y resultados medibles. Cada proyecto es único y lo tratamos con la atención personalizada que merece.`,
    incluye: [
      "Consulta inicial gratuita",
      "Análisis de requerimientos",
      "Propuesta detallada",
      "Desarrollo/Implementación",
      "Pruebas y revisiones",
      "Entrega final",
      "Soporte post-entrega (30 días)",
      "Documentación completa",
    ],
    proceso: [
      {
        paso: 1,
        titulo: "Consulta Inicial",
        descripcion: "Analizamos tus necesidades y objetivos",
        duracion: "1-2 días",
      },
      {
        paso: 2,
        titulo: "Propuesta",
        descripcion: "Creamos una propuesta detallada y presupuesto",
        duracion: "2-3 días",
      },
      {
        paso: 3,
        titulo: "Desarrollo",
        descripcion: "Implementamos la solución paso a paso",
        duracion: service.tiempo_entrega,
      },
      {
        paso: 4,
        titulo: "Entrega",
        descripcion: "Revisión final y entrega del proyecto",
        duracion: "1-2 días",
      },
    ],
    reseñas: [
      {
        id: 1,
        usuario: "María Rodríguez",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        calificacion: 5,
        fecha: "2024-01-10",
        comentario:
          "Excelente trabajo, muy profesional y cumplió con todos los tiempos. El resultado superó mis expectativas. Definitivamente lo recomiendo.",
        proyecto: "Sitio web corporativo",
      },
      {
        id: 2,
        usuario: "Carlos Méndez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        calificacion: 5,
        fecha: "2024-01-05",
        comentario:
          "Muy satisfecho con el servicio. Comunicación excelente durante todo el proceso y entrega a tiempo.",
        proyecto: "E-commerce",
      },
      {
        id: 3,
        usuario: "Ana Jiménez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        calificacion: 4,
        fecha: "2023-12-28",
        comentario: "Buen trabajo en general. Hubo algunos ajustes menores pero el resultado final fue muy bueno.",
        proyecto: "Landing page",
      },
    ],
    estadisticas: {
      proyectos_completados: service.proveedor.servicios_completados,
      tiempo_respuesta: "< 2 horas",
      tasa_satisfaccion: "98%",
      clientes_recurrentes: "85%",
    },
    certificaciones: ["Certificado en React", "Google Analytics", "Scrum Master"],
    garantia: "30 días de garantía y soporte incluido",
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
                <Col lg={8}>
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
                            <img src={imagen || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} />
                            {index === 3 && serviceDetails.galeria.length > 4 && (
                              <div className="more-images">+{serviceDetails.galeria.length - 4}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="service-summary">
                    <h2 className="service-title">{serviceDetails.nombre}</h2>

                    {/* Provider Info */}
                    <div className="provider-card">
                      <div className="provider-header">
                        <img
                          src={serviceDetails.proveedor.avatar || "/placeholder.svg"}
                          alt={serviceDetails.proveedor.nombre}
                          className="provider-avatar"
                        />
                        <div className="provider-info">
                          <h5>{serviceDetails.proveedor.nombre}</h5>
                          <div className="provider-rating">
                            {renderStars(Math.floor(serviceDetails.proveedor.calificacion))}
                            <span className="rating-number">({serviceDetails.proveedor.calificacion})</span>
                          </div>
                          <div className="provider-location">
                            <FaMapMarkerAlt />
                            <span>{serviceDetails.proveedor.ubicacion}</span>
                          </div>
                        </div>
                      </div>

                      <div className="provider-stats">
                        <div className="stat">
                          <FaCheckCircle className="stat-icon" />
                          <div>
                            <strong>{serviceDetails.estadisticas.proyectos_completados}</strong>
                            <small>Proyectos completados</small>
                          </div>
                        </div>
                        <div className="stat">
                          <FaClock className="stat-icon" />
                          <div>
                            <strong>{serviceDetails.estadisticas.tiempo_respuesta}</strong>
                            <small>Tiempo de respuesta</small>
                          </div>
                        </div>
                        <div className="stat">
                          <FaThumbsUp className="stat-icon" />
                          <div>
                            <strong>{serviceDetails.estadisticas.tasa_satisfaccion}</strong>
                            <small>Satisfacción</small>
                          </div>
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
                              {serviceDetails.tags.map((tag, index) => (
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
                          <span className="rating-number">{serviceDetails.proveedor.calificacion}</span>
                          <div className="rating-stars">
                            {renderStars(Math.floor(serviceDetails.proveedor.calificacion))}
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

export default ServiceDetailModal
