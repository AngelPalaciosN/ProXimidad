"use client"

import { Container, Row, Col, Form, Button } from "react-bootstrap"
import { Facebook, Twitter, Instagram, Linkedin, Send, MapPin, Phone, Mail } from "lucide-react"
// import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

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
                  <a href="#" className="social-link" aria-label="Facebook">
                    <Facebook size={18} />
                  </a>
                  <a href="#" className="social-link" aria-label="Twitter">
                    <Twitter size={18} />
                  </a>
                  <a href="#" className="social-link" aria-label="Instagram">
                    <Instagram size={18} />
                  </a>
                  <a href="#" className="social-link" aria-label="LinkedIn">
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
                    <p>+123 456 7890</p>
                  </div>
                  <div className="contact-item">
                    <Mail size={16} className="contact-icon" />
                    <p>info@proximidad.com</p>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="footer-newsletter">
                <h4>Suscríbete a Nuestro Boletín</h4>
                <p>Recibe las últimas noticias y actualizaciones directamente en tu bandeja de entrada.</p>
                <Form className="newsletter-form mt-3">
                  <div className="input-group">
                    <Form.Control
                      type="email"
                      placeholder="Tu correo electrónico"
                      aria-label="Email address"
                      required
                    />
                    <Button variant="primary" type="submit" className="newsletter-button">
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
