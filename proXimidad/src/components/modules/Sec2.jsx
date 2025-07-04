import React, { useState, useEffect } from "react";
import { Container, Row, Col, Carousel, Card, Image } from "react-bootstrap";
import { CheckCircle, Clock, Shield, Briefcase } from "lucide-react";
import axios from 'axios';

export default function Sec2() {
  const [fetchedServicios, setFetchedServicios] = useState([]);
  
  const xAnimations = [
    {
      symbol: "X",
      color: "#005187",
      style: { transform: "rotate(0deg)", transition: "transform 0.3s ease-in-out" },
    },
    {
      symbol: "×",
      color: "#4d82bc",
      style: { transform: "scale(1.2)", transition: "transform 0.3s ease-in-out" },
    },
    {
      symbol: "✗",
      color: "#005187",
      style: { transform: "skew(-10deg)", transition: "transform 0.3s ease-in-out" },
    },
    {
      symbol: "𝗫",
      color: "#005187",
      style: { opacity: 0.7, transition: "opacity 0.3s ease-in-out" },
    },
    {
      symbol: "✘",
      color: "#4d82bc",
      style: { transform: "translateY(-3px)", transition: "transform 0.3s ease-in-out" },
    },
  ];

  const [currentXAnimation, setCurrentXAnimation] = useState(xAnimations[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentXAnimation((prevAnim) => {
        const currentIndex = xAnimations.indexOf(prevAnim);
        const nextIndex = (currentIndex + 1) % xAnimations.length;
        return xAnimations[nextIndex];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/servicios/`;
    const fetchServicios = async () => {
        try {
            const response = await axios.get(apiUrl);
            setFetchedServicios(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };
    fetchServicios();
  }, []);

  const getIconForService = (index) => {
    const icons = [
        <CheckCircle className="feature-icon" size={24} />, 
        <Shield className="feature-icon" size={24} />, 
        <Clock className="feature-icon" size={24} />
    ];
    return icons[index % icons.length] || <Briefcase className="feature-icon" size={24} />;
  }

  return (
    <section className="sec2" id="servicios">
      <div className="x-symbol-container">
        <span
          className={`animated-x ${currentXAnimation.symbol !== "X" ? "animate" : ""}`}
          style={{
            ...currentXAnimation.style,
            color: currentXAnimation.color,
          }}
        >
          {currentXAnimation.symbol}
        </span>
      </div>

      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h2 className="section-title">Nuestros Servicios</h2>
            <p className="section-subtitle">Descubre cómo podemos ayudarte</p>
          </Col>
        </Row>

        <Row>
          <Col md={12} lg={6} className="mb-4 mb-lg-0">
            {fetchedServicios.length > 0 ? (
              <Carousel className="services-carousel" indicators={true} controls={true}>
                {fetchedServicios.map((servicio) => (
                  <Carousel.Item key={servicio.id}>
                    <div className="carousel-image-container">
                      <Image
                        src={servicio.imagen_url || "/placeholder.svg?height=500&width=800"} 
                        alt={servicio.nombre}
                        fluid
                        className="d-block w-100 carousel-image"
                      />
                    </div>
                    <Carousel.Caption>
                      <h3>{servicio.nombre}</h3>
                      <p>{servicio.descripcion || 'Descripción no disponible.'}</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <p>Cargando servicios...</p>
            )}
          </Col>

          <Col md={12} lg={6}>
            <div className="services-cards">
              {fetchedServicios.length > 0 ? (
                fetchedServicios.map((servicio, index) => (
                  <Card key={servicio.id} className="service-card mb-4">
                    <Card.Body className="d-flex">
                      <div className="service-icon-container">
                        {getIconForService(index)}
                      </div>
                      <div className="service-content">
                        <Card.Title>{servicio.nombre}</Card.Title>
                        <Card.Text>{servicio.descripcion || 'Descripción no disponible.'}</Card.Text>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p>Cargando detalles...</p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
