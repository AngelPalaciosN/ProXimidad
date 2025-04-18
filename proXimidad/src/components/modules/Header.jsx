import React, { useState } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import { FaSearch } from 'react-icons/fa';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../Auth';
import '../../scss/component-styles/Header.scss';
// Remove unused import if not needed
// import CrudP from './components/modules/Crud-p';

const Header = ({ handleAbrirFormulario }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseMenuAndModal = () => {
    setIsOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    handleCloseMenuAndModal();
  };

  const renderNavContent = () => (
    <>
      <Nav.Link as={Link} to="/" className="nav-link" onClick={handleCloseMenuAndModal}>
        Inicio
      </Nav.Link>
      <Nav.Link as={Link} to="/usuarios" className="nav-link" onClick={handleCloseMenuAndModal}>
        Proveedores
      </Nav.Link>
      <Nav.Link as={Link} to="/servicios" className="nav-link" onClick={handleCloseMenuAndModal}>
        <FaSearch className="me-1" /> Buscar
      </Nav.Link>
      
      {/* Conditional Link for Proveedores - Make sure user object is valid */}
      {user && user.tipo_usuario && user.tipo_usuario === 'proveedor' && (
        <Nav.Link as={Link} to="/crud-proveedor" className="nav-link" onClick={handleCloseMenuAndModal}>
          Gestión Proveedor
        </Nav.Link>
      )}

      {user ? (
        <>
          <Nav.Link as="span" className="nav-link text-light">
            Hola, {user.nombre_completo || 'Usuario'}
          </Nav.Link> 
          <Button variant="outline-light" className="login-button ms-lg-3" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </>
      ) : (
        <Button 
          variant="outline-light" 
          className="login-button ms-lg-3" 
          onClick={() => { handleAbrirFormulario('iniciarSesion'); handleCloseMenuAndModal(); }}
        >
          Iniciar Sesión
        </Button>
      )}
    </>
  );

  return (
    <header className="header">
      <Container>
        <Navbar expand="lg" variant="dark" className="p-0" expanded={isOpen} onToggle={toggleMenu}>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center" onClick={handleCloseMenuAndModal}>
            <img 
              src="/Proximidad.svg"
              alt="ProXimidad Logo"
              height="40"
              className="d-inline-block align-top me-2"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" className="hamburger-button p-0 border-0">
            {isOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />} 
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto nav-buttons align-items-center">
              {renderNavContent()}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;