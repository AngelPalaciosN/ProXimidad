import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import '../../scss/component-styles/Sec2.scss';

export default function Sec2() {
  const [servicios, setServicios] = useState([]);
  const xAnimations = [
    { 
      symbol: 'X', 
      color: '#005187',
      style: { transform: 'rotate(0deg)', transition: 'transform 0.3s ease-in-out' }
    },
    { 
      symbol: '×', 
      color: '#4d82bc',
      style: { transform: 'scale(1.2)', transition: 'transform 0.3s ease-in-out' }
    },
    { 
      symbol: '✗', 
      color: '#005187',
      style: { transform: 'skew(-10deg)', transition: 'transform 0.3s ease-in-out' }
    },
    { 
      symbol: '𝗫', 
      color: '#005187',
      style: { opacity: 0.7, transition: 'opacity 0.3s ease-in-out' }
    },
    { 
      symbol: '✘', 
      color: '#4d82bc',
      style: { transform: 'translateY(-3px)', transition: 'transform 0.3s ease-in-out' }
    }
  ];

  const [currentXAnimation, setCurrentXAnimation] = useState(xAnimations[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentXAnimation(prevAnim => {
        const currentIndex = xAnimations.indexOf(prevAnim);
        const nextIndex = (currentIndex + 1) % xAnimations.length;
        return xAnimations[nextIndex];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="sec2">
      <Container id='x'>
        <div className="animated-x-container d-flex justify-content-center align-items-center">
         <span
          className={`animated-x ${currentXAnimation.symbol !== 'X' ? 'animate' : ''}`}
          style={{
            ...currentXAnimation.style,
            color: currentXAnimation.color,
            transition: 'color 0.5s ease-in-out, transform 0.3s ease-in-out'
          }}
         >
          {currentXAnimation.symbol}
          </span>
        </div>
      </Container>
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
<Carousel controls={false} indicators={true} >
<Carousel.Item>
                <div className="image-container">
                  <img
                    className="d-block w-100"
                    src="/ruta-a-tu-imagen-1.jpg"
                    alt="Servicios ProXimidad"
                  />
                </div>
                <div className="text-container">
                  <h3>Servicios a tu Alcance</h3>
                  <p>Conectamos profesionales calificados con personas que necesitan servicios confiables.</p>
                </div>
              </Carousel.Item>

<Carousel.Item>
                <div className="image-container">
                  <img
                    className="d-block w-100"
                    src="/ruta-a-tu-imagen-2.jpg"
                    alt="Profesionales Verificados"
                  />
                </div>
                <div className="text-container">
                  <h3>Profesionales Verificados</h3>
                  <p>Todos nuestros prestadores de servicios pasan por un riguroso proceso de verificación.</p>
                </div>
              </Carousel.Item>

 <Carousel.Item>
                <div className="image-container">
                  <img
                    className="d-block w-100"
                    src="/ruta-a-tu-imagen-3.jpg"
                    alt="Servicios Garantizados"
                  />
                </div>
                <div className="text-container">
                  <h3>Garantía de Satisfacción</h3>
                  <p>Tu satisfacción es nuestra prioridad. Servicios garantizados y respaldados.</p>
                </div>
              </Carousel.Item>
            </Carousel>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
