"use client"

import { useState, useEffect, useRef } from "react"
import { Container, Row, Col, Card, Image, Button } from "react-bootstrap"
import { ChevronLeft, ChevronRight, Star, Clock, DollarSign } from "lucide-react"

export default function Sec2Provider({ servicios = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [slidesPerView, setSlidesPerView] = useState(3)
  const sliderRef = useRef(null)

  // Mock data para pruebas
  const mockServicios = [
    {
      id: 1,
      nombre_servicio: "Diseño de Logo Profesional",
      descripcion_servicio:
        "Creación de identidad visual única para tu marca con múltiples propuestas y revisiones ilimitadas.",
      imagen_url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop",
      precio: 150,
      tiempo_entrega: "3-5 días",
      calificacion: 4.8,
    },
    {
      id: 2,
      nombre_servicio: "Desarrollo Web Completo",
      descripcion_servicio: "Sitio web responsive con diseño moderno, optimizado para SEO y alto rendimiento.",
      imagen_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      precio: 500,
      tiempo_entrega: "10-15 días",
      calificacion: 5.0,
    },
    {
      id: 3,
      nombre_servicio: "Marketing Digital",
      descripcion_servicio: "Estrategia completa de marketing en redes sociales y publicidad digital.",
      imagen_url: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&h=400&fit=crop",
      precio: 300,
      tiempo_entrega: "Mensual",
      calificacion: 4.5,
    },
    {
      id: 4,
      nombre_servicio: "Fotografía Profesional",
      descripcion_servicio: "Sesión fotográfica para productos, eventos o retratos corporativos.",
      imagen_url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=400&fit=crop",
      precio: 200,
      tiempo_entrega: "1-2 días",
      calificacion: 4.9,
    },
    {
      id: 5,
      nombre_servicio: "Edición de Video",
      descripcion_servicio: "Producción y edición de contenido audiovisual para redes y publicidad.",
      imagen_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop",
      precio: 250,
      tiempo_entrega: "5-7 días",
      calificacion: 4.7,
    },
  ]

  const data = servicios.length > 0 ? servicios : mockServicios

  // Responsive slides per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setSlidesPerView(1)
      } else if (window.innerWidth < 992) {
        setSlidesPerView(2)
      } else {
        setSlidesPerView(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxIndex = Math.max(0, data.length - slidesPerView)

  const handlePrev = () => {
    if (isAnimating || currentIndex === 0) return
    setIsAnimating(true)
    setCurrentIndex((prev) => prev - 1)
    setTimeout(() => setIsAnimating(false), 400)
  }

  const handleNext = () => {
    if (isAnimating || currentIndex >= maxIndex) return
    setIsAnimating(true)
    setCurrentIndex((prev) => prev + 1)
    setTimeout(() => setIsAnimating(false), 400)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={14} fill="#ffc107" color="#ffc107" />)
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <span key={i} className="star-half-container">
            <Star size={14} color="#e0e0e0" />
            <Star size={14} fill="#ffc107" color="#ffc107" className="star-half" />
          </span>,
        )
      } else {
        stars.push(<Star key={i} size={14} color="#e0e0e0" />)
      }
    }
    return stars
  }

  return (
    <section className="sec2-provider" id="servicios-proveedor">
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h2 className="section-title">Servicios Disponibles</h2>
            <p className="section-subtitle">Explora todos los servicios que ofrecemos</p>
          </Col>
        </Row>

        <div className="slider-wrapper">
          {/* Control Prev */}
          <button
            className={`slider-control slider-control-prev ${currentIndex === 0 ? "disabled" : ""}`}
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Anterior"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Slider Track */}
          <div className="slider-container">
            <div
              className="slider-track"
              ref={sliderRef}
              style={{
                transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`,
              }}
            >
              {data.map((servicio, index) => (
                <div key={servicio.id} className="slider-slide" style={{ width: `${100 / slidesPerView}%` }}>
                  <Card className="service-slider-card">
                    <div className="card-image-container">
                      <Image
                        src={servicio.imagen_url || "/placeholder.svg"}
                        alt={servicio.nombre_servicio || servicio.nombre}
                        className="card-image"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=250&fit=crop"
                        }}
                      />
                      <div className="card-rating">
                        {renderStars(servicio.calificacion || 4.5)}
                        <span className="rating-number">{servicio.calificacion || 4.5}</span>
                      </div>
                    </div>

                    <Card.Body className="card-content">
                      <Card.Title className="service-title">{servicio.nombre_servicio || servicio.nombre}</Card.Title>

                      <Card.Text className="service-description">
                        {servicio.descripcion_servicio || servicio.descripcion || "Descripción no disponible."}
                      </Card.Text>

                      <div className="service-meta">
                        <div className="meta-item">
                          <DollarSign size={16} />
                          <span className="meta-value">${servicio.precio || "Consultar"}</span>
                        </div>
                        <div className="meta-item">
                          <Clock size={16} />
                          <span className="meta-value">{servicio.tiempo_entrega || "A convenir"}</span>
                        </div>
                      </div>

                      <Button className="btn-ver-servicio">Ver Detalles</Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Control Next */}
          <button
            className={`slider-control slider-control-next ${currentIndex >= maxIndex ? "disabled" : ""}`}
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Siguiente"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Indicadores */}
        <div className="slider-indicators">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              className={`indicator ${currentIndex === idx ? "active" : ""}`}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true)
                  setCurrentIndex(idx)
                  setTimeout(() => setIsAnimating(false), 400)
                }
              }}
              aria-label={`Ir a slide ${idx + 1}`}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
