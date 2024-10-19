import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../../scss/component-styles/Header.scss';

const Header = () => {
  return (
    <header className="header">
      <Container>
        <Row className="align-items-center">
          <Col>
            <h1 className="text-white">ProXimidad</h1>
          </Col>
          <Col>
            <nav>
              <ul className="list-unstyled d-flex justify-content-end mb-0">
                <li><a href="#" className="text-white me-3">Inicio</a></li>
                <li><a href="#" className="text-white me-3">Servicios</a></li>
                <li><a href="#" className="text-white me-3">Acerca de</a></li>
                <li><a href="#" className="text-white">Contacto</a></li>
              </ul>
            </nav>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
