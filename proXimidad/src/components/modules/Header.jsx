import React, { useState } from 'react';
import Form from './Registrar';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../../Auth';
import '../../scss/component-styles/Header.scss';

const Header = () => {
  const [isFormVisible, setFormVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleabrirform = () => {
    setFormVisible(true);
    setIsMobileMenuOpen(false);
  };

  const handlecerrarForm = () => {
    setFormVisible(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderNavButtons = (isMobile = false) => (
    <div className={`nav-buttons ${isMobile ? 'mobile-menu' : ''}`}>
      <Link 
        to="/" 
        className="nav-link"
        onClick={isMobile ? toggleMobileMenu : undefined}
      >
        Inicio
      </Link>

      <Link 
        to="/usuarios" 
        className="nav-link"
        onClick={isMobile ? toggleMobileMenu : undefined}
      >
        Proveedores
      </Link>

      {/* <Link 
        to="/Sobre" 
        className="nav-link"
        onClick={isMobile ? toggleMobileMenu : undefined}
      >
        Nosotros
      </Link> */}

      <Link 
        to="/servicios" 
        className="nav-link"
        onClick={isMobile ? toggleMobileMenu : undefined}
      >
        <FaSearch /> Buscar
      </Link>

      {user ? (
        <>
          <span className="nav-link">Hola, {user.nombre}</span>
          <button 
            onClick={logout} 
            className="login-button"
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <button 
          onClick={(e) => {
            e.preventDefault(); 
            handleabrirform();
          }} 
          className="login-button"
        >
          Registrate!!
        </button>
      )}
    </div>
  );

  return (
    <header className="header">
      <Container>
        <Row className="align-items-center">
          <Col>
            <h1 className="text-white" id='h1'>ProXimidad</h1>
          </Col>
          <Col className="d-flex justify-content-end align-items-center">
            <div className="d-none d-md-flex">
              {renderNavButtons()}
            </div>
            
            {/* Mobile hamburger menu */}
            <div 
              className={`hamburger-menu ${isMobileMenuOpen ? 'open' : ''}`} 
              onClick={toggleMobileMenu}
            >
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </Col>
        </Row>
      </Container>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {renderNavButtons(true)}
        </div>
      )}

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
