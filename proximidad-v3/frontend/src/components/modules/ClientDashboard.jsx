"use client"

import { useState, useEffect, useCallback } from "react"
import { Container, Row, Col, Card, Button, Badge, Form, Modal } from "react-bootstrap"
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
import { useAuth } from "../../Auth"
import Header from "./Header"
import ServiceDetailModal from "./ServiceDetailModal"
import ServiceRequestModal from "./ServiceRequestModal"
import { buildApiUrl } from "../../config/env"
import Swal from "sweetalert2"

// Datos mock fuera del componente para evitar recreaciones
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

const ClientDashboard = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  
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
  
  // Estados para modal de calificación
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [solicitudACalificar, setSolicitudACalificar] = useState(null)
  const [calificacion, setCalificacion] = useState(5)
  const [comentario, setComentario] = useState('')
  const [enviandoComentario, setEnviandoComentario] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Cargar servicios desde la API
        const response = await axios.get(buildApiUrl('/servicios/'))
        const serviciosAPI = response.data.servicios || []
        
        // Transformar datos de la API manteniendo estructura original
        const serviciosTransformados = serviciosAPI.map((servicio) => ({
          ...servicio, // Mantener todos los datos originales del API
          // Agregar campos transformados para compatibilidad
          nombre: servicio.nombre_servicio,
          descripcion: servicio.descripcion || 'Sin descripción disponible',
          precio: parseFloat(servicio.precio_base || 0),
          categoria: servicio.categoria_nombre || servicio.categoria_info?.nombre_categoria || 'General',
          proveedor: {
            nombre: servicio.proveedor_info?.nombre_completo || servicio.proveedor_nombre || 'Proveedor',
            avatar: servicio.proveedor_info?.imagen_url || "/placeholder.svg",
            banner: servicio.proveedor_info?.banner_url || servicio.proveedor_info?.imagen_url || "/placeholder.svg",
            calificacion: servicio.promedio_calificacion || 4.5,
            ubicacion: servicio.ubicacion || 'Ubicación no disponible',
            servicios_completados: servicio.proveedor_info?.servicios_completados || 0,
          },
          imagen: servicio.imagen_url || "/placeholder.svg",
          tiempo_entrega: "1-2 semanas", // Este valor podría venir del API en el futuro
          disponible: servicio.activo !== false,
          tags: [servicio.categoria_nombre || 'General'],
        }))
        
        setServices(serviciosTransformados)
        console.log('Servicios cargados en ClientDashboard:', serviciosTransformados)
        
      } catch (error) {
        console.error('Error cargando servicios:', error)
        // Fallback a datos mock si falla la API
        setServices(mockServices)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Cargar solicitudes del cliente cuando el usuario esté disponible
  useEffect(() => {
    const fetchSolicitudes = async () => {
      if (user && user.id) {
        try {
          console.log('📥 Cargando solicitudes para cliente:', user.id)
          const response = await axios.get(buildApiUrl(`/solicitudes/cliente/${user.id}/`))
          const solicitudesAPI = response.data.solicitudes || []
          
          console.log('✅ Solicitudes cargadas:', solicitudesAPI)
          setMyRequests(solicitudesAPI)
          
        } catch (error) {
          console.error('❌ Error cargando solicitudes:', error)
          // Fallback a mock si falla
          setMyRequests(mockRequests)
        }
      }
    }
    
    fetchSolicitudes()
  }, [user?.id, user])

  // Cargar favoritos cuando el usuario esté disponible
  useEffect(() => {
    const fetchFavoritos = async () => {
      if (user && user.id) {
        try {
          const favoritosResponse = await axios.get(buildApiUrl(`/favoritos/${user.id}/?tipo=servicio`))
          const favoritosIds = favoritosResponse.data.favoritos?.map(fav => fav.id) || []
          setFavorites(favoritosIds)
        } catch (error) {
          console.warn("Error cargando favoritos:", error)
          setFavorites([])
        }
      }
    }
    
    fetchFavoritos()
  }, [user?.id, user])

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      (service.nombre_servicio || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "" || service.categoria_nombre === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleRequestService = (service) => {
    console.log("🔧 Abriendo modal de solicitud para:", service)
    setSelectedService(service)
    setShowRequestModal(true)
    console.log("🔧 Estado después: showRequestModal =", true, "selectedService =", service?.nombre_servicio || "undefined")
  }

  const handleViewDetails = useCallback((service) => {
    console.log("👁️ Servicio completo recibido:", service)
    console.log("👁️ Proveedor info:", service?.proveedor_info)
    setSelectedService(service)
    setShowDetailModal(true)
  }, [])

  const handleToggleFavorite = async (serviceId) => {
    // Verificar autenticación
    if (!user || !user.id) {
      console.log("Usuario actual:", user)
      alert("Debes iniciar sesión para añadir favoritos")
      return
    }

    // ✅ VALIDACIÓN: Verificar que el servicio no sea del propio usuario
    const service = services.find(s => s.id === serviceId)
    if (service && service.proveedor === user.id) {
      alert("No puedes agregar tu propio servicio a favoritos")
      return
    }

    const isFavorited = favorites.includes(serviceId)
    
    try {
      if (isFavorited) {
        // Eliminar de favoritos
        console.log(`🗑️ Eliminando favorito: user.id=${user.id}, serviceId=${serviceId}`)
        await axios.delete(buildApiUrl(`/favoritos/eliminar/${user.id}/${serviceId}/?tipo=servicio`))
        setFavorites((prev) => prev.filter((id) => id !== serviceId))
      } else {
        // Añadir a favoritos
        const payload = { 
          usuario_id: user.id, 
          favorito_id: serviceId,
          tipo: 'servicio'
        }
        console.log(`❤️ Añadiendo favorito con payload:`, payload)
        console.log(`📡 URL completa:`, buildApiUrl('/favoritos/'))
        await axios.post(buildApiUrl('/favoritos/'), payload)
        setFavorites((prev) => [...prev, serviceId])
      }
    } catch (error) {
      console.error("Error al gestionar favorito:", error)
      console.error("Detalles del error:", error.response?.data)
      alert("Error al actualizar favoritos: " + (error.response?.data?.error || error.message))
    }
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

  const categories = [...new Set(services.map((service) => service.categoria_nombre))]
  
  // Handler para abrir modal de calificación
  const handleAbrirModalCalificacion = (solicitud) => {
    setSolicitudACalificar(solicitud)
    setCalificacion(5)
    setComentario('')
    setShowRatingModal(true)
  }
  
  // Handler para enviar calificación
  const handleEnviarCalificacion = async () => {
    if (!comentario.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Comentario requerido',
        text: 'Por favor escribe un comentario sobre el servicio recibido',
      })
      return
    }
    
    setEnviandoComentario(true)
    
    try {
      const comentarioData = {
        servicio_fk: solicitudACalificar.servicio,
        usuario_fk: user.id,
        mensaje: comentario,
        calificacion: calificacion,
      }
      
      console.log('📝 Enviando comentario:', comentarioData)
      
      await axios.post(buildApiUrl('/comentarios/crear/'), comentarioData)
      
      Swal.fire({
        icon: 'success',
        title: '¡Gracias por tu calificación!',
        text: 'Tu comentario ha sido publicado exitosamente',
        timer: 3000,
      })
      
      setShowRatingModal(false)
      setSolicitudACalificar(null)
      setCalificacion(5)
      setComentario('')
      
    } catch (error) {
      console.error('❌ Error al enviar calificación:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'No se pudo enviar la calificación. Inténtalo de nuevo.',
      })
    } finally {
      setEnviandoComentario(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    )
  }

  // ✅ Si no está autenticado, mostrar mensaje
  if (!isAuthenticated || !user) {
    return (
      <div className="client-dashboard">
        <Header />
        <Container className="mt-5">
          <div className="empty-state">
            <FaUser size={48} className="empty-icon" />
            <h4>Debes iniciar sesión</h4>
            <p>Para acceder al dashboard de servicios, inicia sesión primero.</p>
            <Button variant="primary" href="/">
              Ir a Inicio
            </Button>
          </div>
        </Container>
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
              <h1>¡Bienvenido, {user?.nombre_completo || 'Usuario'}!</h1>
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
                      <option key="all-categories" value="">Todas las categorías</option>
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
                        <Card.Img 
                          variant="top" 
                          src={service.imagen_url || service.proveedor_info?.banner_url || "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop"} 
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop"; }}
                        />
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
                          <Card.Title>{service.nombre_servicio || service.nombre}</Card.Title>
                          <Badge bg="secondary" className="category-badge">
                            {service.categoria_nombre || service.categoria}
                          </Badge>
                        </div>

                        <Card.Text className="service-description">{service.descripcion}</Card.Text>

                        <div className="service-tags">
                          {(service.tags || [service.categoria_nombre]).slice(0, 3).map((tag) => (
                            <span key={tag} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="provider-info">
                          {/* ✨ Banner de fondo para el proveedor */}
                          <div className="provider-banner-background" 
                               style={{
                                 backgroundImage: service.proveedor_info?.banner_url || service.proveedor_info?.imagen_url 
                                   ? `url(${service.proveedor_info.banner_url || service.proveedor_info.imagen_url})` 
                                   : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                 backgroundColor: '#2c3e50',
                                 backgroundSize: 'cover',
                                 backgroundPosition: 'center'
                               }}>
                          </div>
                          
                          <div className="provider-content">
                            <div className="provider-avatar">
                              <img 
                                src={service.proveedor_info?.imagen_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"} 
                                alt={service.proveedor_info?.nombre_completo || service.proveedor_nombre || "Proveedor"} 
                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"; }}
                              />
                            </div>
                            <div className="provider-details">
                              <h6>{service.proveedor_info?.nombre_completo || service.proveedor_nombre || "Proveedor"}</h6>
                              <div className="provider-meta">
                                <div className="rating">
                                  <FaStar className="star-icon" />
                                  <span>{service.promedio_calificacion || 4.5}</span>
                                </div>
                                <div className="location">
                                  <FaMapMarkerAlt className="location-icon" />
                                  <span>{service.proveedor_info?.direccion || service.ubicacion || "Ubicación no disponible"}</span>
                                </div>
                              </div>
                              <div className="provider-stats">
                                <small>{service.proveedor_info?.servicios_completados || 0} servicios completados</small>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="service-footer mt-auto">
                          <div className="service-meta">
                            <div className="price">
                              <strong>${parseFloat(service.precio_base || service.precio || 0).toLocaleString()}</strong>
                            </div>
                            <div className="delivery-time">
                              <FaClock className="me-1" />
                              {service.tiempo_entrega || "7-10 días"}
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
                            <h5>{request.servicio_nombre || request.servicio}</h5>
                            {getStatusBadge(request.estado)}
                          </div>

                          <div className="request-details">
                            <div className="detail-row">
                              <FaUser className="detail-icon" />
                              <span>
                                <strong>Proveedor:</strong> {request.proveedor_nombre || request.proveedor}
                              </span>
                            </div>
                            <div className="detail-row">
                              <FaDollarSign className="detail-icon" />
                              <span>
                                <strong>Precio acordado:</strong> ${(request.precio_acordado || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="detail-row">
                              <FaCalendarAlt className="detail-icon" />
                              <span>
                                <strong>Fecha de solicitud:</strong>{" "}
                                {new Date(request.fecha_solicitud).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
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
                            {request.respuesta_proveedor && (
                              <div className="description-box bg-light">
                                <strong>Respuesta del proveedor:</strong>
                                <p>{request.respuesta_proveedor}</p>
                              </div>
                            )}
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
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={async () => {
                                  if (window.confirm('¿Estás seguro de cancelar esta solicitud?')) {
                                    try {
                                      await axios.delete(buildApiUrl(`/solicitudes/${request.id}/cancelar/`))
                                      // Recargar solicitudes
                                      const response = await axios.get(buildApiUrl(`/solicitudes/cliente/${user.id}/`))
                                      setMyRequests(response.data.solicitudes || [])
                                    } catch (error) {
                                      console.error('Error al cancelar solicitud:', error)
                                      alert('Error al cancelar la solicitud')
                                    }
                                  }
                                }}
                              >
                                Cancelar
                              </Button>
                            )}
                            {request.estado === "completado" && (
                              <Button 
                                variant="success" 
                                size="sm"
                                onClick={() => handleAbrirModalCalificacion(request)}
                              >
                                <FaStar className="me-1" />
                                Calificar Servicio
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
                            <Card.Img 
                              variant="top" 
                              src={service.imagen_url || service.proveedor_info?.banner_url || "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop"} 
                              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop"; }}
                            />
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
                              <Card.Title>{service.nombre_servicio || service.nombre}</Card.Title>
                              <Badge bg="secondary" className="category-badge">
                                {service.categoria}
                              </Badge>
                            </div>
                            <Card.Text>{service.descripcion}</Card.Text>

                            <div className="service-footer mt-auto">
                              <div className="service-meta">
                                <div className="price">
                                  <strong>${parseFloat(service.precio_base || service.precio || 0).toLocaleString()}</strong>
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

      {/* Modal de Calificación */}
      <Modal 
        show={showRatingModal} 
        onHide={() => setShowRatingModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaStar className="text-warning me-2" />
            Calificar Servicio Completado
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {solicitudACalificar && (
            <>
              <div className="mb-4 p-3 bg-light rounded">
                <h6 className="mb-2">Servicio: <strong>{solicitudACalificar.servicio_nombre}</strong></h6>
                <p className="mb-1">
                  <FaUser className="me-2" />
                  Proveedor: <strong>{solicitudACalificar.proveedor_nombre}</strong>
                </p>
                <p className="mb-0">
                  <FaCheckCircle className="text-success me-2" />
                  Completado el: {new Date(solicitudACalificar.fecha_completado || solicitudACalificar.fecha_actualizacion).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                  <FaStar className="text-warning me-1" />
                  Calificación (1-5 estrellas) *
                </Form.Label>
                <div className="d-flex gap-2 align-items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={32}
                      className={star <= calificacion ? 'text-warning' : 'text-muted'}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setCalificacion(star)}
                    />
                  ))}
                  <span className="ms-2 h5 mb-0">{calificacion}.0</span>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Comentario sobre el servicio *
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Describe tu experiencia con el servicio: calidad del trabajo, profesionalismo, cumplimiento de plazos, comunicación, etc."
                  maxLength={500}
                />
                <Form.Text className="text-muted">
                  {comentario.length}/500 caracteres
                </Form.Text>
              </Form.Group>

              <div className="alert alert-info mb-0">
                <small>
                  <FaCheckCircle className="me-2" />
                  Tu calificación y comentario serán visibles públicamente y ayudarán a otros usuarios a tomar decisiones informadas.
                </small>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowRatingModal(false)}
            disabled={enviandoComentario}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={handleEnviarCalificacion}
            disabled={!comentario.trim() || enviandoComentario}
          >
            {enviandoComentario ? (
              <>
                <FaSpinner className="spinner-border spinner-border-sm me-2" />
                Enviando...
              </>
            ) : (
              <>
                <FaStar className="me-2" />
                Publicar Calificación
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ClientDashboard
