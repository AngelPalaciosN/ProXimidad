"use client"

import { useState, useRef, useEffect } from "react"
import { Container, Navbar, Nav, Button } from "react-bootstrap"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../../Auth"
import Editar_p from "./Editar_p"
import Usuarios from "./Lista_usuarios"
import Buscar from "./BuscarS"
import { useNavigate } from 'react-router-dom';
import IniciarSesion from "./Iniciar";
import Registrar from "./Registrar";

export default function Header({ handleAbrirFormulario }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showEditar_p, setShowEditar_p] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' o 'registrar'
  const userMenuRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const openRegistrarForm = () => {
    setIsOpen(false);
    if (handleAbrirFormulario) {
      handleAbrirFormulario('registrar');
    } else {
      // Usar modal interno si no hay función padre
      setAuthMode('registrar');
      setShowAuthModal(true);
    }
  };

  const openLoginForm = () => {
    setIsOpen(false);
    if (handleAbrirFormulario) {
      handleAbrirFormulario('iniciarSesion');  // Corregir nombre
    } else {
      // Usar modal interno si no hay función padre
      setAuthMode('login');
      setShowAuthModal(true);
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <Container>
        <Navbar expand="lg" variant="dark" className="p-0">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src="/Proximidad.svg" alt="ProXimidad Logo" className="logo" />
            <span className="ms-2 brand-text">proXimidad</span>
          </Link>

          <div className="d-lg-none">
            <Button
              variant="link"
              className="hamburger-button p-0"
              onClick={toggleMenu}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
            </Button>
          </div>

          <Navbar.Collapse id="basic-navbar-nav" className={isOpen ? "show" : ""}>
            <Nav className="ms-auto nav-buttons">
              <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
                Contactanos
              </Link>
              {user && (
                <>
                  <Link to="/servicios" className="nav-link" onClick={() => setIsOpen(false)}>
                    Servicios
                  </Link>
                  <Link to="/usuarios" className="nav-link" onClick={() => setIsOpen(false)}>
                    Usuarios
                  </Link>
                </>
              )}
              {user ? (
                <div className="user-menu-container" ref={userMenuRef}>
                  <button className="user-menu-trigger" onClick={toggleUserMenu} aria-label="User menu">
                    <div className="user-avatar">
                      <img
                        src={user.imagen_url || "/placeholder.svg?height=32&width=32"}
                        alt={user.nombre_completo || "Usuario"}
                      />
                    </div>
                    <span className="user-name">{user.nombre_completo || "Usuario"}</span>
                    <svg
                      className={`dropdown-arrow ${isUserMenuOpen ? "open" : ""}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                      <div className="user-dropdown-avatar">
                        <img
                          src={user.imagen_url || "/placeholder.svg?height=48&width=48"}
                          alt={user.nombre_completo || "Usuario"}
                        />
                      </div>
                        <div className="user-dropdown-info">
                          <h4>{user.nombre_completo || "Usuario"}</h4>
                          <p>{user.correo_electronico}</p>
                          <span className="user-type">
                            {user.tipo_usuario === "proveedor" ? "Proveedor" : "Arrendador"}
                          </span>
                        </div>
                      </div>

                      <div className="user-dropdown-menu">
                        <button className="dropdown-item" onClick={() => { setIsUserMenuOpen(false); handleAbrirFormulario('editarPerfil'); }}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M20 6L9 17l-5-5"></path>
                          </svg>
                          Editar Perfil
                        </button>

                        <button className="dropdown-item">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M9 12l2 2 4-4"></path>
                            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                          </svg>
                          Mis Servicios
                        </button>

                        <button className="dropdown-item">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                          Mensajes
                        </button>

                        <div className="dropdown-divider"></div>

                        <button className="dropdown-item">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                          </svg>
                          Configuración
                        </button>

                        <button className="dropdown-item logout" onClick={handleLogout}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16,17 21,12 16,7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                          </svg>
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button variant="outline-light" className="login-button ms-lg-3" onClick={openLoginForm}>
                  Iniciar Sesión
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

          {/* Mobile Menu Overlay */}
          <div className={`mobile-menu-overlay ${isOpen ? "active" : ""}`}>
            <Nav className="mobile-nav-links">
              <Link to="/" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                Contactanos
              </Link>
              {user && (
                <>
                  <Link to="/servicios" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                    Servicios
                  </Link>
                  <Link to="/usuarios" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                    Usuarios
                  </Link>
                </>
              )}
              <button variant="outline-light" className="mobile-login-button" onClick={openLoginForm}>
                Iniciar Sesión
              </button>
            </Nav>
          </div>
        {showEditar_p && <Editar_p onClose={() => setShowEditar_p(false)} user={user} />}
        
        {/* Modal de autenticación interno */}
        {showAuthModal && (
          <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1060
          }}>
            <div className="modal-content" style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              maxWidth: '500px',
              width: '90%',
              position: 'relative'
            }}>
              <button 
                onClick={() => setShowAuthModal(false)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
              {authMode === 'login' ? (
                <IniciarSesion 
                  onClose={() => setShowAuthModal(false)}
                  onFormularioChange={(modo) => setAuthMode(modo)}
                />
              ) : (
                <Registrar 
                  onClose={() => setShowAuthModal(false)}
                  onFormularioChange={(modo) => setAuthMode(modo)}
                />
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
