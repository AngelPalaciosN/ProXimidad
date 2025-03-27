import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Send, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../scss/component-styles/Sec1.scss';

const Sec1 = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = "Haciendo facil tu dedicacion";
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
  const [usuarios, setUsuarios] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [formData, setFormData] = useState({
    usuario: '',
    servicio: '',
    mensaje: ''
  });

  useEffect(() => {
    let currentIndex = 0;
    const typeText = () => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
        setTimeout(typeText, 150);
      }
    };
    typeText();
  }, []);

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

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:8000/proX/usuarios/');
        setUsuarios(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    const fetchServicios = async () => {
      try {
        const response = await axios.get('http://localhost:8000/proX/servicios/');
        setServicios(response.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };

    fetchUsuarios();
    fetchServicios();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: '¿Enviar comentario?',
      text: "¿Estás seguro de que quieres enviar este comentario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, enviar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post('http://localhost:8000/proX/comentarios/crear/', formData);
          Swal.fire('Enviado!', 'Tu comentario ha sido enviado.', 'success');
          setFormData({
            usuario: '',
            servicio: '',
            mensaje: ''
          });
        } catch (err) {
          console.error('Error sending comment:', err);
          Swal.fire('Error', 'No se pudo enviar tu comentario.', 'error');
        }
      }
    });
  };

  return (
    <section className="sec1">
      <Container>
        <Row className="g-4">
          <Col lg={6}>
            <div className="hero-content" id="hero-1">
              <h2 
                className="display-4 text-primary mb-3 animate__animated animate__fadeInLeft"
                style={{ color: 'inherit' }}
              >
                Bienvenido a pro
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
                imidad
              </h2>
              <p className="lead mb-4 typing-effect" style={{ color: '#ffffff' }}>
                {displayText}
                <span className="cursor">|</span>
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                className="btn-hover-rise d-flex align-items-center mx-auto"
              >
                Comienza Ahora
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </Col>
          <Col lg={6}>
            <div className="hero-content" id='hero-2'>
              <h2 
                className="display-4 mb-3 animate__animated animate__fadeInLeft"
                style={{ color: '#ffffff' }}
              >
                Tus ideas son importantes para nosotros. ¡Compártelas!
              </h2>
              <Button 
                variant="primary" 
                size="lg" 
                className="btn-hover-rise d-flex align-items-center justify-content-center mx-auto rounded-circle"
                style={{
                  width: '10rem',
                  height: '10rem',
                  padding: 0,
                  overflow: 'hidden'
                }}
              >
                <img 
                  src="/ruta-a-tu-imagen.png" 
                  alt="Icono del botón"
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover'
                  }}
                />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Sec1;
