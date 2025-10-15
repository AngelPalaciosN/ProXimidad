import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { ArrowRight, Send, MessageSquare } from "lucide-react";
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Sec1({ handleAbrirFormulario }) {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Haciendo facil tu dedicacion";
  const [usuarios, setUsuarios] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [formData, setFormData] = useState({
    usuario_fk: "",
    servicio_fk: "",
    mensaje: "",
    calificacion: "",
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

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(`${baseUrl}/usuarios/`);
        // Los usuarios vienen directamente como array
        setUsuarios(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setUsuarios([]);
      }
    };

    const fetchServicios = async () => {
      try {
        const response = await axios.get(`${baseUrl}/servicios/`);
        setServicios(response.data.servicios || []);
      } catch (err) {
        console.error('Error fetching services:', err);
        setServicios([]);
      }
    };

    fetchUsuarios();
    fetchServicios();
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
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/comentarios/crear/`;
    Swal.fire({
      title: '¿Enviar comentario?',
      text: "¿Estás seguro de que quieres enviar este comentario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Preparar datos para envío
          const dataToSend = {
            ...formData,
            calificacion: formData.calificacion ? parseInt(formData.calificacion) : null
          };
          await axios.post(apiUrl, dataToSend);
          Swal.fire('Enviado!', 'Tu comentario ha sido enviado.', 'success');
          setFormData({
            usuario_fk: "",
            servicio_fk: "",
            mensaje: "",
            calificacion: "",
          });
          setIsFormVisible(false);
        } catch (err) {
          console.error('Error sending comment:', err);
          Swal.fire('Error', 'No se pudo enviar tu comentario. Intenta de nuevo más tarde.', 'error');
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
                      <Form.Label>Usuario</Form.Label>
                      <Form.Select name="usuario_fk" value={formData.usuario_fk} onChange={handleInputChange} required>
                        <option value="">Selecciona un usuario</option>
                        {usuarios.map(usuario => (
                          <option key={usuario.id} value={usuario.id}> 
                            {usuario.nombre_completo}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Servicio Relacionado</Form.Label>
                      <Form.Select name="servicio_fk" value={formData.servicio_fk} onChange={handleInputChange} required>
                        <option value="">Selecciona un servicio</option>
                        {servicios.map(servicio => (
                          <option key={servicio.id} value={servicio.id}> 
                            {servicio.nombre_servicio}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Calificación (Opcional)</Form.Label>
                      <Form.Select name="calificacion" value={formData.calificacion} onChange={handleInputChange}>
                        <option value="">Sin calificación</option>
                        <option value="1">⭐ 1 - Muy malo</option>
                        <option value="2">⭐⭐ 2 - Malo</option>
                        <option value="3">⭐⭐⭐ 3 - Regular</option>
                        <option value="4">⭐⭐⭐⭐ 4 - Bueno</option>
                        <option value="5">⭐⭐⭐⭐⭐ 5 - Excelente</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Mensaje</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleInputChange}
                        placeholder="Tu comentario"
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
