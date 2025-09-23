"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Badge, Form } from "react-bootstrap"
import {
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaEye,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaUser,
  FaTools,
  FaPaintBrush,
  FaBullhorn,
  FaCamera,
  FaCode,
  FaDollarSign,
  FaCalendarAlt,
} from "react-icons/fa"
import axios from "axios"
import { config, buildApiUrl } from "../../config/env.js"
import Header from "./Header"

const ClientDashboard = ({ user = { nombre_completo: "Usuario Demo" } }) => {
  const [activeTab, setActiveTab] = useState("browse")
  const [services, setServices] = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [favorites, setFavorites] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [loading, setLoading] = useState(true)

  // Datos hardcodeados más completos
  const mockServices = [
    {
      id: 1,
      nombre: "Desarrollo Web Profesional",
      descripcion: "Creación de sitios web modernos y responsivos con React, Next.js y las últimas tecnologías web",
      precio: 1500,
      categoria: "Tecnología",
      proveedor: {
        nombre: "Juan Pérez",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        calificacion: 4.8,
        ubicacion: "San José, Costa Rica",
        servicios_completados: 45,
      },
      imagen: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      tiempo_entrega: "2-3 semanas",
      disponible: true,
      tags: ["React", "Next.js", "Responsive", "SEO"],
    },
    {
      id: 2,
      nombre: "Diseño Gráfico Creativo",
      descripcion: "Diseño de logos, banners, material publicitario y branding completo para tu empresa",
      precio: 800,
      categoria: "Diseño",
      proveedor: {
        nombre: "María González",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        calificacion: 4.9,
        ubicacion: "Heredia, Costa Rica",
        servicios_completados: 67,
      },
      imagen: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
      tiempo_entrega: "1 semana",
      disponible: true,
      tags: ["Logo", "Branding", "Photoshop", "Illustrator"],
    },
    {
      id: 3,
      nombre: "Marketing Digital Integral",
      descripcion: "Estrategias completas de marketing digital, gestión de redes sociales y campañas publicitarias",
      precio: 1200,
      categoria: "Marketing",
      proveedor: {
        nombre: "Carlos Rodríguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        calificación: 4.7,
        ubicacion: "Alajuela, Costa Rica",
        servicios_completados: 32,
      },
      imagen: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      tiempo_entrega: "1-2 semanas",
      disponible: true,
      tags: ["Facebook Ads", "Google Ads", "SEO", "Analytics"],
    },
    {
      id: 4,
      nombre: "Fotografía Profesional",
      descripcion: "Sesiones fotográficas para eventos, productos, retratos y fotografía comercial",
      precio: 600,
      categoria: "Fotografía",
      proveedor: {
        nombre: "Ana Jiménez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        calificacion: 4.9,
        ubicacion: "Cartago, Costa Rica",
        servicios_completados: 89,
      },
      imagen: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=250&fit=crop",
      tiempo_entrega: "3-5 días",
      disponible: true,
      tags: ["Eventos", "Productos", "Retratos", "Comercial"],
    },
    {
      id: 5,
      nombre: "Desarrollo de Apps Móviles",
      descripcion: "Desarrollo de aplicaciones móviles nativas e híbridas para iOS y Android",
      precio: 2500,
      categoria: "Tecnología",
      proveedor: {
        nombre: "Luis Morales",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        calificacion: 4.6,
        ubicacion: "San José, Costa Rica",
        servicios_completados: 23,
      },
      imagen: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
      tiempo_entrega: "4-6 semanas",
      disponible: true,
      tags: ["React Native", "Flutter", "iOS", "Android"],
    },
    {
      id: 6,
      nombre: "Consultoría en Negocios",
      descripcion: "Asesoría empresarial, planes de negocio y estrategias de crecimiento",
      precio: 900,
      categoria: "Consultoría",
      proveedor: {
        nombre: "Roberto Silva",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
        calificacion: 4.8,
        ubicacion: "San José, Costa Rica",
        servicios_completados: 56,
      },
      imagen: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop",
      tiempo_entrega: "1-2 semanas",
      disponible: false,
      tags: ["Plan de Negocio", "Estrategia", "Finanzas", "Crecimiento"],
    },
  ]

  const mockRequests = [
    {
      id: 1,
      servicio: "Desarrollo Web Profesional",
      proveedor: "Juan Pérez",
      fecha_solicitud: "2024-01-15",
      estado: "pendiente",
      precio_acordado: 1500,
      descripcion_personalizada:
        "Necesito un sitio web para mi negocio de repostería con catálogo de productos y sistema de pedidos",
      urgencia: "media",
    },
    {
      id: 2,
      servicio: "Diseño Gráfico Creativo",
      proveedor: "María González",
      fecha_solicitud: "2024-01-10",
      estado: "aceptado",
      precio_acordado: 800,
      descripcion_personalizada: "Logo para empresa de tecnología, necesito algo moderno y profesional",
      urgencia: "alta",
    },
    {
      id: 3,
      servicio: "Marketing Digital Integral",
      proveedor: "Carlos Rodríguez",
      fecha_solicitud: "2024-01-05",
      estado: "completado",
      precio_acordado: 1200,
      descripcion_personalizada: "Campaña para lanzamiento de producto en redes sociales",
      urgencia: "baja",
    },
    {
      id: 4,
      servicio: "Fotografía Profesional",
      proveedor: "Ana Jiménez",
      fecha_solicitud: "2024-01-20",
      estado: "rechazado",
      precio_acordado: 600,
      descripcion_personalizada: "Sesión fotográfica para productos de mi tienda online",
      urgencia: "media",
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Cargar servicios desde la API
        const response = await axios.get(buildApiUrl('/servicios/'))
        const serviciosAPI = response.data.servicios || []
        
        // Transformar datos de la API al formato esperado
        const serviciosTransformados = serviciosAPI.map((servicio) => ({
          id: servicio.id,
          nombre: servicio.nombre_servicio,
          descripcion: servicio.descripcion_servicio || servicio.descripcion || 'Sin descripción disponible',
          precio: parseFloat(servicio.precio_servicio || servicio.precio_base || 0),
          categoria: servicio.categoria?.nombre_categoria || 'General',
          proveedor: {
            nombre: servicio.usuario?.nombre_completo || 'Proveedor',
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            calificacion: 4.5,
            ubicacion: servicio.usuario?.direccion || 'Costa Rica',
            servicios_completados: 25,
          },
          imagen: servicio.imagen_url || "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=250&fit=crop",
          tiempo_entrega: "1-2 semanas",
          disponible: servicio.disponible !== false,
          tags: [servicio.categoria?.nombre_categoria || 'General'],
        }))
        
        setServices(serviciosTransformados)
        console.log('Servicios cargados en ClientDashboard:', serviciosTransformados)
        
        // Datos mock para favoritos y requests hasta que se implementen
        setMyRequests(mockRequests)
        setFavorites([1, 3, 4])
        
      } catch (error) {
        console.error('Error cargando servicios:', error)
        // Fallback a datos mock si falla la API
        setServices(mockServices)
        setMyRequests(mockRequests)
        setFavorites([1, 3, 4])
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "" || service.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleRequestService = (service) => {
    setSelectedService(service)
    setShowRequestModal(true)
  }

  const handleViewDetails = (service) => {
    setSelectedService(service)
    setShowDetailModal(true)
  }

  const handleToggleFavorite = (serviceId) => {
    setFavorites((prev) => (prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]))
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pendiente: { variant: "warning", icon: FaClock, text: "Pendiente" },
      aceptado: { variant: "info", icon: FaSpinner, text: "En Proceso" },
      completado: { variant: "success", icon: FaCheckCircle, text: "Completado" },
      rechazado: { variant: "danger", icon: FaTimesCircle, text: "Rechazado" },
    }

    const config = statusConfig[status] || statusConfig.pendiente
    const IconComponent = config.icon

    return (
      <Badge bg={config.variant} className="d-flex align-items-center gap-1">
        <IconComponent size={12} />
        {config.text}
      </Badge>
    )
  }

  const getCategoryIcon = (category) => {
    const icons = {
      Tecnología: FaCode,
      Diseño: FaPaintBrush,
      Marketing: FaBullhorn,
      Fotografía: FaCamera,
      Consultoría: FaUser,
    }
    return icons[category] || FaTools
  }

  const categories = [...new Set(services.map((service) => service.categoria))]

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="client-dashboard">
      <Header />
      <Container fluid>
        <div className="dashboard-header">
          <Row>
            <Col>
              <h1>¡Bienvenido, {user.nombre_completo}!</h1>
              <p>Encuentra y solicita los servicios que necesitas</p>
              <div className="stats-row">
                <div className="stat-item">
                  <FaSearch />
                  <span>{services.length} Servicios Disponibles</span>
                </div>
                <div className="stat-item">
                  <FaShoppingCart />
                  <span>{myRequests.length} Solicitudes Activas</span>
                </div>
                <div className="stat-item">
                  <FaHeart />
                  <span>{favorites.length} Favoritos</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <div className="dashboard-tabs">
          <Button
            variant={activeTab === "browse" ? "primary" : "outline-primary"}
            onClick={() => setActiveTab("browse")}
            className="tab-button"
          >
            <FaSearch className="me-2" />
            Explorar Servicios
          </Button>
          <Button
            variant={activeTab === "requests" ? "primary" : "outline-primary"}
            onClick={() => setActiveTab("requests")}
            className="tab-button"
          >
            <FaShoppingCart className="me-2" />
            Mis Solicitudes
            {myRequests.length > 0 && (
              <Badge bg="light" text="dark" className="ms-2">
                {myRequests.length}
              </Badge>
            )}
          </Button>
          <Button
            variant={activeTab === "favorites" ? "primary" : "outline-primary"}
            onClick={() => setActiveTab("favorites")}
            className="tab-button"
          >
            <FaHeart className="me-2" />
            Favoritos
            {favorites.length > 0 && (
              <Badge bg="light" text="dark" className="ms-2">
                {favorites.length}
              </Badge>
            )}
          </Button>
        </div>

        <div className="dashboard-content">
          {activeTab === "browse" && (
            <div className="browse-services">
              <div className="search-filters">
                <Row className="mb-4">
                  <Col md={8}>
                    <div className="search-box">
                      <FaSearch className="search-icon" />
                      <Form.Control
                        type="text"
                        placeholder="Buscar servicios, proveedores o tecnologías..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                    </div>
                  </Col>
                  <Col md={4}>
                    <Form.Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="category-filter"
                    >
                      <option value="">Todas las categorías</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>

                <div className="quick-filters">
                  <span className="filter-label">Filtros rápidos:</span>
                  {categories.slice(0, 4).map((category) => {
                    const IconComponent = getCategoryIcon(category)
                    return (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "primary" : "outline-secondary"}
                        size="sm"
                        onClick={() => setSelectedCategory(selectedCategory === category ? "" : category)}
                        className="quick-filter-btn"
                      >
                        <IconComponent className="me-1" />
                        {category}
                      </Button>
                    )
                  })}
                </div>
              </div>

              <div className="results-info">
                <p>
                  Mostrando {filteredServices.length} de {services.length} servicios
                </p>
              </div>

              <Row>
                {filteredServices.map((service) => (
                  <Col key={service.id} lg={4} md={6} className="mb-4">
                    <Card className="service-card h-100">
                      <div className="service-image">
                        <Card.Img variant="top" src={service.imagen} />
                        <Button
                          variant="link"
                          className="favorite-btn"
                          onClick={() => handleToggleFavorite(service.id)}
                        >
                          <FaHeart className={favorites.includes(service.id) ? "favorited" : ""} />
                        </Button>
                        {!service.disponible && (
                          <div className="unavailable-overlay">
                            <span>No Disponible</span>
                          </div>
                        )}
                      </div>

                      <Card.Body className="d-flex flex-column">
                        <div className="service-header">
                          <Card.Title>{service.nombre}</Card.Title>
                          <Badge bg="secondary" className="category-badge">
                            {service.categoria}
                          </Badge>
                        </div>

                        <Card.Text className="service-description">{service.descripcion}</Card.Text>

                        <div className="service-tags">
                          {service.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="provider-info">
                          <div className="provider-avatar">
                            <img src={service.proveedor.avatar || "/placeholder.svg"} alt={service.proveedor.nombre} />
                          </div>
                          <div className="provider-details">
                            <h6>{service.proveedor.nombre}</h6>
                            <div className="provider-meta">
                              <div className="rating">
                                <FaStar className="star-icon" />
                                <span>{service.proveedor.calificacion}</span>
                              </div>
                              <div className="location">
                                <FaMapMarkerAlt className="location-icon" />
                                <span>{service.proveedor.ubicacion}</span>
                              </div>
                            </div>
                            <div className="provider-stats">
                              <small>{service.proveedor.servicios_completados} servicios completados</small>
                            </div>
                          </div>
                        </div>

                        <div className="service-footer mt-auto">
                          <div className="service-meta">
                            <div className="price">
                              <strong>${service.precio.toLocaleString()}</strong>
                            </div>
                            <div className="delivery-time">
                              <FaClock className="me-1" />
                              {service.tiempo_entrega}
                            </div>
                          </div>

                          <div className="service-actions">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleViewDetails(service)}
                            >
                              <FaEye className="me-1" />
                              Ver Detalles
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleRequestService(service)}
                              disabled={!service.disponible}
                            >
                              {service.disponible ? "Solicitar" : "No Disponible"}
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {filteredServices.length === 0 && (
                <div className="empty-state">
                  <FaSearch size={48} className="empty-icon" />
                  <h4>No se encontraron servicios</h4>
                  <p>Intenta con otros términos de búsqueda o cambia los filtros</p>
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("")
                    }}
                  >
                    Limpiar Filtros
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === "requests" && (
            <div className="my-requests">
              <div className="section-header">
                <h3>Mis Solicitudes de Servicios</h3>
                <div className="request-stats">
                  <Badge bg="warning" className="me-2">
                    {myRequests.filter((r) => r.estado === "pendiente").length} Pendientes
                  </Badge>
                  <Badge bg="info" className="me-2">
                    {myRequests.filter((r) => r.estado === "aceptado").length} En Proceso
                  </Badge>
                  <Badge bg="success">{myRequests.filter((r) => r.estado === "completado").length} Completados</Badge>
                </div>
              </div>

              {myRequests.length === 0 ? (
                <div className="empty-state">
                  <FaShoppingCart size={48} className="empty-icon" />
                  <h4>No tienes solicitudes aún</h4>
                  <p>Explora nuestros servicios y realiza tu primera solicitud</p>
                  <Button variant="primary" onClick={() => setActiveTab("browse")}>
                    Explorar Servicios
                  </Button>
                </div>
              ) : (
                <Row>
                  {myRequests.map((request) => (
                    <Col key={request.id} lg={6} className="mb-4">
                      <Card className="request-card">
                        <Card.Body>
                          <div className="request-header">
                            <h5>{request.servicio}</h5>
                            {getStatusBadge(request.estado)}
                          </div>

                          <div className="request-details">
                            <div className="detail-row">
                              <FaUser className="detail-icon" />
                              <span>
                                <strong>Proveedor:</strong> {request.proveedor}
                              </span>
                            </div>
                            <div className="detail-row">
                              <FaDollarSign className="detail-icon" />
                              <span>
                                <strong>Precio acordado:</strong> ${request.precio_acordado.toLocaleString()}
                              </span>
                            </div>
                            <div className="detail-row">
                              <FaCalendarAlt className="detail-icon" />
                              <span>
                                <strong>Fecha de solicitud:</strong>{" "}
                                {new Date(request.fecha_solicitud).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="detail-row">
                              <FaClock className="detail-icon" />
                              <span>
                                <strong>Urgencia:</strong>
                                <Badge
                                  bg={
                                    request.urgencia === "alta"
                                      ? "danger"
                                      : request.urgencia === "media"
                                        ? "warning"
                                        : "success"
                                  }
                                  className="ms-2"
                                >
                                  {request.urgencia}
                                </Badge>
                              </span>
                            </div>
                            <div className="description-box">
                              <strong>Descripción:</strong>
                              <p>{request.descripcion_personalizada}</p>
                            </div>
                          </div>

                          <div className="request-actions">
                            <Button variant="outline-primary" size="sm" className="me-2">
                              Ver Detalles
                            </Button>
                            {request.estado === "pendiente" && (
                              <Button variant="outline-danger" size="sm">
                                Cancelar
                              </Button>
                            )}
                            {request.estado === "completado" && (
                              <Button variant="outline-success" size="sm">
                                Calificar
                              </Button>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          )}

          {activeTab === "favorites" && (
            <div className="favorites">
              <div className="section-header">
                <h3>Servicios Favoritos</h3>
                <p>Tus servicios guardados para consultar más tarde</p>
              </div>

              {favorites.length === 0 ? (
                <div className="empty-state">
                  <FaHeart size={48} className="empty-icon" />
                  <h4>No tienes favoritos aún</h4>
                  <p>Marca servicios como favoritos para encontrarlos fácilmente</p>
                  <Button variant="primary" onClick={() => setActiveTab("browse")}>
                    Explorar Servicios
                  </Button>
                </div>
              ) : (
                <Row>
                  {services
                    .filter((service) => favorites.includes(service.id))
                    .map((service) => (
                      <Col key={service.id} lg={4} md={6} className="mb-4">
                        <Card className="service-card h-100">
                          <div className="service-image">
                            <Card.Img variant="top" src={service.imagen} />
                            <Button
                              variant="link"
                              className="favorite-btn"
                              onClick={() => handleToggleFavorite(service.id)}
                            >
                              <FaHeart className="favorited" />
                            </Button>
                          </div>

                          <Card.Body className="d-flex flex-column">
                            <div className="service-header">
                              <Card.Title>{service.nombre}</Card.Title>
                              <Badge bg="secondary" className="category-badge">
                                {service.categoria}
                              </Badge>
                            </div>
                            <Card.Text>{service.descripcion}</Card.Text>

                            <div className="service-footer mt-auto">
                              <div className="service-meta">
                                <div className="price">
                                  <strong>${service.precio.toLocaleString()}</strong>
                                </div>
                                <div className="delivery-time">
                                  <FaClock className="me-1" />
                                  {service.tiempo_entrega}
                                </div>
                              </div>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleRequestService(service)}
                                disabled={!service.disponible}
                                className="w-100"
                              >
                                {service.disponible ? "Solicitar Servicio" : "No Disponible"}
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                </Row>
              )}
            </div>
          )}
        </div>
      </Container>

      {/* TODO: Crear estos modales
      <ServiceRequestModal
        show={showRequestModal}
        onHide={() => setShowRequestModal(false)}
        service={selectedService}
        user={user}
      />

      <ServiceDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        service={selectedService}
        user={user}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={selectedService ? favorites.includes(selectedService.id) : false}
      />
      */}
    </div>
  )
}

export default ClientDashboard
