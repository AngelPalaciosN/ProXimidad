import React from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import '../../scss/component-styles/Sec2.scss';

export default function Sec1() {
  return (
    <>
        <section className="sec1">
          <Container>
            <Row className="align-items-center">
              <Col md={6}>
                <h2 className="text-primary mb-4">Bienvenido a Nuestra Página</h2>
                <p className="text-secondary mb-4">Ofrecemos a cardenas por 100 pesos</p>
                <Button variant="primary" size="lg">Comienza Ahora</Button>
              </Col>
              <Col md={6}>
                <div className="contact-form-container">
                  <h3 className="text-primary mb-4">Contáctanos</h3>
                  <Form>
                    <Form.Group className="mb-3" controlId="formName">
                      <Form.Control type="text" placeholder="Nombre" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Control type="email" placeholder="Correo electrónico" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formMessage">
                      <Form.Control as="textarea" rows={3} placeholder="Mensaje" />
                    </Form.Group>
                    <Button variant="secondary" type="submit" className="w-100">
                      Enviar
                    </Button>
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
       </> 
  );
}
