"use client"

import { Container, Row, Col, Form, Button } from "react-bootstrap"
import { Facebook, Twitter, Instagram, Linkedin, Send, MapPin, Phone, Mail } from "lucide-react"
import { useState } from "react"
import { buildApiUrl } from "../../config/env"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSocialClick = (red) => {
    alert(`Próximamente estaremos en ${red}. ¡Síguenos para no perderte las novedades!`)
  }

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      alert('Por favor ingresa un correo electrónico válido')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(buildApiUrl('/contacto/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: 'Suscriptor',
          email: email,
          mensaje: 'Quiero suscribirme al boletín de noticias',
          tipo: 'newsletter'
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('¡Gracias por suscribirte! Recibirás nuestras novedades en tu correo.')
        setEmail('')
      } else {
        alert(data.error || 'Error al suscribirse. Intenta nuevamente.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al enviar. Verifica tu conexión e intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="footer" id="contacto">
      <div className="footer-main">
        <Container>
          <Row className="gy-4">
            <Col lg={3} md={6}>
              <div className="footer-info">
                <div className="footer-logo">
                  <img 
                    src="/Proximidad.svg" 
                    alt="ProXimidad Logo" 
                    height="30"
                    style={{ filter: 'brightness(0) invert(1)' }} 
                  />
                  <h3>ProXimidad</h3>
                </div>
                <p className="footer-description mt-3">
                  Conectamos profesionales calificados con personas que necesitan servicios confiables en un solo lugar.
                </p>
                <div className="social-links mt-4">
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handleSocialClick('Facebook'); }} 
                    className="social-link" 
                    aria-label="Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handleSocialClick('Twitter'); }} 
                    className="social-link" 
                    aria-label="Twitter"
                  >
                    <Twitter size={18} />
                  </a>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handleSocialClick('Instagram'); }} 
                    className="social-link" 
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handleSocialClick('LinkedIn'); }} 
                    className="social-link" 
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>
            </Col>

            <Col lg={2} md={6}>
              <div className="footer-links">
                <h4>Enlaces Rápidos</h4>
                <ul>
                  <li>
                    <a href="#inicio">Inicio</a>
                  </li>
                  <li>
                    <a href="#servicios">Servicios</a>
                  </li>
                  <li>
                    <a href="#testimonios">Testimonios</a>
                  </li>
                  <li>
                    <a href="#contacto">Contacto</a>
                  </li>
                </ul>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="footer-contact">
                <h4>Contáctanos</h4>
                <div className="contact-info">
                  <div className="contact-item">
                    <MapPin size={16} className="contact-icon" />
                    <p>Av. Principal 123, Ciudad</p>
                  </div>
                  <div className="contact-item">
                    <Phone size={16} className="contact-icon" />
                    <p>+57 300 123 4567</p>
                  </div>
                  <div className="contact-item">
                    <Mail size={16} className="contact-icon" />
                    <p>proximidadapp@gmail.com</p>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="footer-newsletter">
                <h4>Suscríbete a Nuestro Boletín</h4>
                <p>Recibe las últimas noticias y actualizaciones directamente en tu bandeja de entrada.</p>
                <Form className="newsletter-form mt-3" onSubmit={handleNewsletterSubmit}>
                  <div className="input-group">
                    <Form.Control
                      type="email"
                      placeholder="Tu correo electrónico"
                      aria-label="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="newsletter-button"
                      disabled={loading}
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="footer-bottom">
        <Container>
          <Row>
            <Col md={6}>
              <p className="copyright">
                &copy; {currentYear} <strong>proXimidad</strong>. Todos los derechos reservados.
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <div className="footer-legal">
                <a href="#">Términos de Servicio</a>
                <a href="#">Política de Privacidad</a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  )
}
