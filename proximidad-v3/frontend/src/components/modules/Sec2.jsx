import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import { ChevronLeft, ChevronRight, Star, Clock, DollarSign } from "lucide-react";
import axios from 'axios';
import { buildApiUrl } from "../../config/env.js";

export default function Sec2() {
  const [fetchedServicios, setFetchedServicios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const sliderRef = useRef(null);

  // Responsive slides per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 992) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchServicios = async () => {
        try {
            const response = await axios.get(buildApiUrl('/servicios/'));
            const serviciosArray = response.data.servicios || [];
            setFetchedServicios(serviciosArray);
            console.log('Servicios cargados:', serviciosArray);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };
    fetchServicios();
  }, []);

  const maxIndex = Math.max(0, fetchedServicios.length - slidesPerView);

  const handlePrev = () => {
    if (isAnimating || currentIndex === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handleNext = () => {
    if (isAnimating || currentIndex >= maxIndex) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={14} fill="#ffc107" color="#ffc107" />);
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <span key={i} className="star-half-container">
            <Star size={14} color="#e0e0e0" />
            <Star size={14} fill="#ffc107" color="#ffc107" className="star-half" />
          </span>
        );
      } else {
        stars.push(<Star key={i} size={14} color="#e0e0e0" />);
      }
    }
    return stars;
  };

  return (
    <section className="sec2-provider" id="servicios">
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h2 className="section-title">Nuestros Servicios</h2>
            <p className="section-subtitle">Explora todos los servicios que ofrecemos</p>
          </Col>
        </Row>

        {fetchedServicios.length > 0 ? (
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
                {fetchedServicios.map((servicio) => (
                  <div key={servicio.id} className="slider-slide" style={{ width: `${100 / slidesPerView}%` }}>
                    <Card className="service-slider-card">
                      <div className="card-image-container">
                        <Image
                          src={servicio.imagen_url || "/placeholder.svg"}
                          alt={servicio.nombre_servicio || servicio.nombre}
                          className="card-image"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=250&fit=crop";
                          }}
                        />
                        <div className="card-rating">
                          {renderStars(servicio.calificacion || 4.5)}
                          <span className="rating-number">{servicio.calificacion || 4.5}</span>
                        </div>
                      </div>

                      <Card.Body className="card-content">
                        <Card.Title className="service-title">
                          {servicio.nombre_servicio || servicio.nombre}
                        </Card.Title>

                        <Card.Text className="service-description">
                          {servicio.descripcion_servicio || servicio.descripcion || "Descripción no disponible."}
                        </Card.Text>

                        <div className="service-meta">
                          <div className="meta-item">
                            <DollarSign size={16} />
                            <span className="meta-value">
                              ${servicio.precio ? new Intl.NumberFormat('es-CO').format(servicio.precio) : "Consultar"} COP
                            </span>
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
        ) : (
          <div className="text-center">
            <p>Cargando servicios...</p>
          </div>
        )}

        {/* Indicadores */}
        {fetchedServicios.length > 0 && (
          <div className="slider-indicators">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                className={`indicator ${currentIndex === idx ? "active" : ""}`}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(idx);
                    setTimeout(() => setIsAnimating(false), 400);
                  }
                }}
                aria-label={`Ir a slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
