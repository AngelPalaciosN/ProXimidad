import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Send, ArrowRight } from 'lucide-react';

const Sec1 = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = "Ofrecemos servicios a la puerta de tu hogar";
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    
    const typeText = () => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
        
        setTimeout(typeText, 50);
      } else {
        setIsTyping(false);
      }
    };
    typeText();

    return () => {
      currentIndex = fullText.length;
    };
  }, []);

  return (
    <section className="sec1">
      <Container>
        <Row className="g-4"> {/* Added gap between columns */}
          <Col lg={6}>
            <div className="hero-content">
              <h2 className="display-4 text-primary mb-3 animate__animated animate__fadeInLeft">
                Bienvenido a proXimidad
              </h2>
              <p className="lead text-secondary mb-4 typing-effect">
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
            <div className="contact-form-container shadow-lg">
              <h3 className="text-primary mb-4 text-center">Contáctanos</h3>
              <Form>
                <Form.Group className="mb-4">
                  <Form.Control 
                    type="text" 
                    placeholder="Nombre" 
                    className="form-control-custom"
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Control 
                    type="email" 
                    placeholder="Correo electrónico" 
                    className="form-control-custom"
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Mensaje" 
                    className="form-control-custom"
                  />
                </Form.Group>
                <Button 
                  variant="secondary" 
                  type="submit" 
                  className="w-100 btn-hover-rise d-flex align-items-center justify-content-center"
                >
                  <Send className="mr-2" size={18} />
                  Enviar
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Sec1;