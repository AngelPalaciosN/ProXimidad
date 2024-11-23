import * as React from 'react';
import Form from '../Registrar';
import { Container, Row, Col } from 'react-bootstrap';
import '../../scss/component-styles/Header.scss';

const Header = () => {
  const [isFormVisible, setFormVisible] = React.useState(false);
  
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
                <li><a href="#" className="text-white me-3">Inicio</a></li>
                <li><a href="#" className="text-white me-3">Servicios</a></li>
                <li><a href="#" className="text-white me-3">Acerca de</a></li>
                <li><a href="#" onClick={() => { handleabrirform(); }} className="text-white">Iniciar sesion</a></li>
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
