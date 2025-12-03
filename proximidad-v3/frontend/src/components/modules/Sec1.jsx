import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { ArrowRight, Send, MessageSquare } from "lucide-react";
import axios from 'axios';
import Swal from 'sweetalert2';
import { buildApiUrl } from '../../config/env';

export default function Sec1({ handleAbrirFormulario }) {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Haciendo facil tu dedicacion";
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const formRef = useRef(null);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = buildApiUrl('/contacto/');
    Swal.fire({
      title: '¿Enviar sugerencia?',
      text: "¿Estás seguro de que quieres enviar esta sugerencia?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(apiUrl, {
            nombre: formData.nombre,
            email: formData.email,
            mensaje: formData.mensaje,
            tipo: 'sugerencia'
          });
          Swal.fire('Enviado!', 'Tu sugerencia ha sido enviada.', 'success');
          setFormData({
            nombre: "",
            email: "",
            mensaje: "",
          });
          setIsFormVisible(false);
        } catch (err) {
          console.error('Error sending suggestion:', err);
          Swal.fire('Error', 'No se pudo enviar tu sugerencia. Intenta de nuevo más tarde.', 'error');
        }
      }
    });
  };

  return (
    <section className="sec1" id="inicio">
      <Container>
        <Row className="g-4 align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="hero-content" id="hero-1">
              <div>
                <h2 className="display-4 fw-bold mb-3 animate__animated animate__fadeInLeft">
                  Bienvenido a <span className="text-highlight">proXimidad</span>
                </h2>
                <p className="lead mb-4 typing-effect">
                  {displayText}
                  <span className="cursor">|</span>
                </p>
                <p className="hero-description">
                  Conectamos profesionales calificados con personas que necesitan servicios confiables en un solo lugar.
                </p>
              </div>
              <Button 
                variant="primary" 
                size="lg" 
                className="btn-hover-rise d-flex align-items-center" 
                onClick={() => handleAbrirFormulario('registrar')}
               >
                Comienza Ahora
                <ArrowRight className="ms-2" size={20} />
              </Button>
            </div>
          </Col>
          <Col lg={6}>
            <div className="hero-content" id="hero-2">
              <div>
                <h2 className="display-5 mb-3 animate__animated animate__fadeInLeft">
                  Tus ideas son importantes para nosotros
                </h2>
                <p className="hero-description mb-4">
                  ¡Comparte tus comentarios y ayúdanos a mejorar nuestra plataforma!
                </p>
              </div>

              {isFormVisible ? (
                <div className="comment-form-container" ref={formRef}>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Correo Electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="tu@email.com"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Mensaje</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleInputChange}
                        placeholder="¿Qué te gustaría ver en ProXimidad?"
                        required
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-between">
                      <Button variant="outline-secondary" onClick={toggleForm}>
                        Cancelar
                      </Button>
                      <Button variant="primary" type="submit" className="d-flex align-items-center">
                        Enviar
                        <Send className="ms-2" size={16} />
                      </Button>
                    </div>
                  </Form>
                </div>
              ) : (
                <Button
                  variant="primary"
                  className="comment-button d-flex align-items-center justify-content-center mx-auto"
                  onClick={toggleForm}
                >
                  <MessageSquare size={24} />
                  <span className="ms-2">Compartir Comentario</span>
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
