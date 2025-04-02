import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import '../../scss/component-styles/Sec2.scss';

export default function Sec2() {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/servicios/')
      .then(response => response.json())
      .then(data => setServicios(data));
  }, []);

  return (
    <section className="sec2">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Carousel>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="/ruta-a-tu-imagen-1.jpg"
                  alt="Servicios ProXimidad"
                />
                <Carousel.Caption>
                  <h3>Servicios a tu Alcance</h3>
                  <p>Conectamos profesionales calificados con personas que necesitan servicios confiables.</p>
                </Carousel.Caption>
              </Carousel.Item>

              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="/ruta-a-tu-imagen-2.jpg"
                  alt="Profesionales Verificados"
                />
                <Carousel.Caption>
                  <h3>Profesionales Verificados</h3>
                  <p>Todos nuestros prestadores de servicios pasan por un riguroso proceso de verificación.</p>
                </Carousel.Caption>
              </Carousel.Item>

              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="/ruta-a-tu-imagen-3.jpg"
                  alt="Servicios Garantizados"
                />
                <Carousel.Caption>
                  <h3>Garantía de Satisfacción</h3>
                  <p>Tu satisfacción es nuestra prioridad. Servicios garantizados y respaldados.</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
