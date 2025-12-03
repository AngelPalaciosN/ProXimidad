import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { MessageCircle, Send } from 'lucide-react';
import { buildApiUrl } from '../../config/env';

export default function ComentariosPublicos() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      alert('Por favor ingresa un correo electrónico válido');
      return;
    }

    if (!formData.mensaje.trim() || formData.mensaje.trim().length < 10) {
      alert('Por favor ingresa un mensaje de al menos 10 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(buildApiUrl('/contacto/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tipo: 'comentario'
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('¡Gracias por tu comentario! Hemos recibido tu mensaje y te responderemos pronto a tu correo.');
        setFormData({ nombre: '', email: '', mensaje: '' });
      } else {
        alert(data.error || 'Error al enviar el comentario. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar. Verifica tu conexión e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="comentarios-publicos py-5 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <MessageCircle size={48} className="text-primary mb-3" />
                  <h2 className="h3 fw-bold">Déjanos tu Comentario o Sugerencia</h2>
                  <p className="text-muted">
                    Tu opinión es muy importante para nosotros. Cuéntanos cómo podemos mejorar o qué te gustaría ver en ProXimidad.
                  </p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Nombre <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="nombre"
                          placeholder="Tu nombre completo"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Correo Electrónico <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="tu@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                        <Form.Text className="text-muted">
                          Para poder responderte
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    <Col xs={12} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Mensaje <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          name="mensaje"
                          rows={5}
                          placeholder="Escribe tu comentario, sugerencia o pregunta aquí..."
                          value={formData.mensaje}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          style={{ resize: 'vertical' }}
                        />
                        <Form.Text className="text-muted">
                          Mínimo 10 caracteres
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <div className="d-grid">
                        <Button
                          variant="primary"
                          size="lg"
                          type="submit"
                          disabled={loading}
                          className="d-flex align-items-center justify-content-center gap-2"
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Send size={20} />
                              Enviar Comentario
                            </>
                          )}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>

                <div className="mt-4 pt-3 border-top text-center">
                  <p className="text-muted small mb-0">
                    <strong>Nota:</strong> Tu mensaje será enviado directamente a nuestro equipo. 
                    Responderemos a tu correo en un plazo de 24-48 horas.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
