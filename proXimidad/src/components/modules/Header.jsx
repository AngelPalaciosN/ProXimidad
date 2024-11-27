import React, { useState } from 'react';
import Form from '../Registrar';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import '../../scss/component-styles/Header.scss';

const Header = () => {
  const [isFormVisible, setFormVisible] = useState(false);

  const handleabrirform = () => {
    setFormVisible(true);
  };

  const handlecerrarForm = () => {
    setFormVisible(false);
  };

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
                <li><Link to="/" className="text-white me-3">Inicio</Link></li>
                <li><Link to="/servicios" className="text-white me-3">Servicios</Link></li>
                <li>
                  <button 
                    onClick={(e) => {
                      e.preventDefault(); 
                      handleabrirform();
                    }} 
                    className="text-white bg-transparent border-0"
                  >
                    Iniciar sesión
                  </button>
                </li>
                <li><Link to="/usuarios" className="text-white me-3">Lista de usuarios</Link></li>
              </ul>
            </nav>
          </Col>
        </Row>
      </Container>

      {isFormVisible && (
        <div className="overlay">
          <div className="form-container">
            <Form onClose={handlecerrarForm} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
