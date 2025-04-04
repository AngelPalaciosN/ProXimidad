import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Send, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Registrar from './Registrar';
import '../../scss/component-styles/Sec1.scss';

const Sec1 = () => {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState('');
  const fullText = "Haciendo facil tu dedicacion";
  const [usuarios, setUsuarios] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [formData, setFormData] = useState({
    usuario: '',
    servicio: '',
    mensaje: ''
  });
  const [formularioVisible, setFormularioVisible] = useState(null);

  const handleAbrirFormulario = (formulario) => {
    setFormularioVisible(formulario);
  };

  const handleCerrarFormulario = () => {
    setFormularioVisible(null);
  };

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
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://192.168.207.112:8000/usuarios/');
        setUsuarios(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    const fetchServicios = async () => {
      try {
        const response = await axios.get('http://192.168.207.112:8000/servicios/');
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
          await axios.post('http://192.168.207.112:8000/proX/comentarios/crear/', formData);
          Swal.fire({
            title: 'Enviado!',
            text: 'Tu comentario ha sido enviado.',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then(() => {
            navigate('/Iniciar');
          });
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
                Bienvenido a proXimidad
              </h2>
              <p className="lead mb-4 typing-effect" style={{ color: '#ffffff' }}>
                {displayText}
                <span className="cursor">|</span>
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                className="btn-hover-rise d-flex align-items-center mx-auto"
                onClick={() => handleAbrirFormulario('registrar')}
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
      {formularioVisible && (
        <div className="overlay">
          <div className="form-container">
            {formularioVisible === 'registrar' && (
              <Registrar onClose={handleCerrarFormulario} />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Sec1;
