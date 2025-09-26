"use client"

import React, { useState, useEffect, useCallback } from "react"
import axios from "axios"
import Header from "./Header"
import { useAuth } from "../../Auth"
import { 
  FaStar, FaTimes, FaSearch, FaFilter, 
  FaUserTie, FaUserCheck, FaEnvelope, FaPhone, 
  FaMapMarkerAlt, FaBriefcase, FaSortAmountDown, FaSortAmountUp 
} from "react-icons/fa"
import Swal from "sweetalert2"
import { useUserContext } from '../../context/UserContext';

const UsuarioList = () => {
  const { usuarios, loading, error, fetchUsuarios } = useUserContext();
  const [favoritos, setFavoritos] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("todos")
  const [sortOrder, setSortOrder] = useState("asc")
  const [activeTab, setActiveTab] = useState("todos")
  const [selectedUser, setSelectedUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  const { user } = useAuth()
  // Usar la variable de entorno de Vite
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

  useEffect(() => {
    fetchUsuarios()
    fetchFavoritos()
  }, [fetchUsuarios])

  const fetchFavoritos = useCallback(async () => {
    if (user && user.id) {
      try {
        // Llamada real a la API para obtener favoritos
        const response = await axios.get(`${baseUrl}/favoritos/${user.id}/`)
        // Extraer solo los IDs de los usuarios favoritos
        const favoritosIds = response.data.map(favorito => favorito.favorito_id)
        setFavoritos(favoritosIds)
      } catch (err) {
        console.error("Error fetching favorites:", err)
        // Si hay error, inicializar con array vacío
        setFavoritos([])
      }
    }
  }, [user, baseUrl])

  const handleAddToFavorites = async (usuarioId, event) => {
    // Evitar que el clic se propague al elemento padre
    if (event) {
      event.stopPropagation()
    }
    
    if (!user || !user.id) {
      Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para añadir favoritos",
        icon: "warning",
        confirmButtonColor: "#005187",
      })
      return
    }

    Swal.fire({
      title: "¿Añadir a favoritos?",
      text: "¿Estás seguro de que quieres añadir este usuario a tus favoritos?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#005187",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, añadir",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Intentar añadir a favoritos en la API
          try {
            await axios.post(`${baseUrl}/favoritos/`, { usuario_id: user.id, favorito_id: usuarioId })
          } catch (apiError) {
            console.warn("No se pudo conectar a la API para añadir favorito", apiError)
          }

          // Actualizar estado local de favoritos
          setFavoritos([...favoritos, usuarioId])
          Swal.fire({
            title: "¡Añadido!",
            text: "El usuario ha sido añadido a tus favoritos",
            icon: "success",
            confirmButtonColor: "#005187",
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
          })
        } catch (err) {
          console.error("Error adding to favorites:", err)
          Swal.fire({
            title: "Error",
            text: "No se pudo añadir el usuario a favoritos",
            icon: "error",
            confirmButtonColor: "#005187"
          })
        }
      }
    })
  }

  const handleRemoveFromFavorites = async (usuarioId, event) => {
    // Evitar que el clic se propague al elemento padre
    if (event) {
      event.stopPropagation()
    }
    
    if (!user || !user.usuario_id) {
      Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para eliminar favoritos",
        icon: "warning",
        confirmButtonColor: "#005187",
      })
      return
    }

    Swal.fire({
      title: "¿Eliminar de favoritos?",
      text: "¿Estás seguro de que quieres eliminar este usuario de tus favoritos?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#005187",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Intentar eliminar de favoritos en la API
          try {
            await axios.delete(`${baseUrl}/favoritos/eliminar/${user.id}/${usuarioId}/`)
          } catch (apiError) {
            console.warn("No se pudo conectar a la API para eliminar favorito", apiError)
          }

          // Actualizar estado local de favoritos
          setFavoritos(favoritos.filter((fav) => fav !== usuarioId))
          Swal.fire({
            title: "¡Eliminado!",
            text: "El usuario ha sido eliminado de tus favoritos",
            icon: "success",
            confirmButtonColor: "#005187",
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
          })
        } catch (err) {
          console.error("Error removing from favorites:", err)
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el usuario de favoritos",
            icon: "error",
            confirmButtonColor: "#005187"
          })
        }
      }
    })
  }

  const handleUserClick = (usuario) => {
    setSelectedUser(usuario)
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Resetear a la primera página al buscar
  }

  const handleTipoFiltroChange = (e) => {
    setTipoFiltro(e.target.value)
    setCurrentPage(1) // Resetear a la primera página al filtrar
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1) // Resetear a la primera página al cambiar de pestaña
  }

  // Filtrar y ordenar usuarios
  const filteredUsuarios = usuarios.filter((usuario) => {
    // Filtro por tipo de usuario
    const matchTipo = tipoFiltro === "todos" 
      ? true 
      : usuario.tipo_usuario === tipoFiltro

    // Filtro por búsqueda
    const matchSearch = searchTerm
      ? usuario.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.correo_electronico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (usuario.especialidad && usuario.especialidad.toLowerCase().includes(searchTerm.toLowerCase()))
      : true

    // Filtro por pestaña activa
    const matchTab = activeTab === "todos" 
      ? true 
      : activeTab === "favoritos" 
        ? favoritos.includes(usuario.id)
        : activeTab === "proveedores" 
          ? usuario.tipo_usuario === "proveedor"
          : activeTab === "arrendadores" 
            ? usuario.tipo_usuario === "arrendador"
            : true

    return matchTipo && matchSearch && matchTab
  }).sort((a, b) => {
    // Ordenar por nombre
    const nameA = a.nombre_completo.toLowerCase()
    const nameB = b.nombre_completo.toLowerCase()
    
    if (sortOrder === "asc") {
      return nameA.localeCompare(nameB)
    } else {
      return nameB.localeCompare(nameA)
    }
  })

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage)

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  // Renderizar estrellas de calificación
  const renderStars = (rating) => {
    if (!rating) return null
    
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
    
    return (
      <div className="rating">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star full">★</span>
        ))}
        {halfStar && <span className="star half">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star empty">☆</span>
        ))}
        <span className="rating-value">{rating.toFixed(1)}</span>
      </div>
    )
  }

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    )

  if (error)
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    )

  return (
    <>
      <Header />
      <div className="usuarios-container">
        <div className="usuarios-header">
          <h1>Directorio de Usuarios</h1>
          <p>Encuentra profesionales y arrendadores en nuestra plataforma</p>
        </div>

        <div className="usuarios-controls">
          <div className="search-filter">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por nombre, correo o especialidad..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            
            <div className="filter-box">
              <FaFilter className="filter-icon" />
              <select 
                value={tipoFiltro} 
                onChange={handleTipoFiltroChange}
                className="filter-select"
              >
                <option value="todos">Todos los usuarios</option>
                <option value="proveedor">Solo proveedores</option>
                <option value="arrendador">Solo arrendadores</option>
              </select>
            </div>
            
            <button 
              className="sort-button" 
              onClick={toggleSortOrder}
              title={sortOrder === "asc" ? "Ordenar Z-A" : "Ordenar A-Z"}
            >
              {sortOrder === "asc" ? <FaSortAmountDown /> : <FaSortAmountUp />}
            </button>
          </div>
          
          <div className="tabs">
            <button 
              className={`tab ${activeTab === "todos" ? "active" : ""}`}
              onClick={() => handleTabChange("todos")}
            >
              Todos
            </button>
            <button 
              className={`tab ${activeTab === "favoritos" ? "active" : ""}`}
              onClick={() => handleTabChange("favoritos")}
            >
              Favoritos
              <span className="badge">{favoritos.length}</span>
            </button>
            <button 
              className={`tab ${activeTab === "proveedores" ? "active" : ""}`}
              onClick={() => handleTabChange("proveedores")}
            >
              Proveedores
            </button>
            <button 
              className={`tab ${activeTab === "arrendadores" ? "active" : ""}`}
              onClick={() => handleTabChange("arrendadores")}
            >
              Arrendadores
            </button>
          </div>
        </div>

        <div className="usuarios-list">
          {currentItems.length > 0 ? (
            <>
              <div className="usuarios-grid">
                {currentItems.map((usuario) => (
                  <div 
                    key={usuario.id} 
                    className={`usuario-card ${favoritos.includes(usuario.id) ? "favorito" : ""}`}
                    onClick={() => handleUserClick(usuario)}
                  >
                    <div className="usuario-header">
                    <div className="usuario-avatar">
                        <img src={usuario.imagen_url || "/placeholder.svg?height=80&width=80"} alt={usuario.nombre_completo} />
                      </div>
                      <div className="usuario-info">
                        <h3>{usuario.nombre_completo}</h3>
                        <p className="usuario-tipo">
                          {usuario.tipo_usuario === "proveedor" ? (
                            <><FaUserTie className="icon" /> Proveedor</>
                          ) : (
                            <><FaUserCheck className="icon" /> Arrendador</>
                          )}
                        </p>
                        {usuario.especialidad && (
                          <p className="usuario-especialidad">
                            <FaBriefcase className="icon" /> {usuario.especialidad}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="usuario-body">
                      <p className="usuario-email">
                        <FaEnvelope className="icon" /> {usuario.correo_electronico}
                      </p>
                      {usuario.telefono && (
                        <p className="usuario-phone">
                          <FaPhone className="icon" /> {usuario.telefono}
                        </p>
                      )}
                      {usuario.direccion && (
                        <p className="usuario-location">
                          <FaMapMarkerAlt className="icon" /> {usuario.direccion}
                        </p>
                      )}
                      
                      {usuario.tipo_usuario === "proveedor" && (
                        <div className="usuario-stats">
                          {renderStars(usuario.calificacion)}
                          {usuario.proyectos_completados > 0 && (
                            <p className="proyectos">
                              {usuario.proyectos_completados} proyectos completados
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="usuario-actions">
                      {favoritos.includes(usuario.id) ? (
                        <button 
                          className="action-button remove-favorite" 
                          onClick={(e) => handleRemoveFromFavorites(usuario.id, e)}
                          title="Eliminar de favoritos"
                        >
                          <FaTimes className="icon" /> Eliminar de favoritos
                        </button>
                      ) : (
                        <button 
                          className="action-button add-favorite" 
                          onClick={(e) => handleAddToFavorites(usuario.id, e)}
                          title="Añadir a favoritos"
                        >
                          <FaStar className="icon" /> Añadir a favoritos
                        </button>
                      )}
                      <button className="action-button view-profile">
                        Ver perfil completo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    &laquo; Anterior
                  </button>
                  
                  <div className="pagination-info">
                    Página {currentPage} de {totalPages}
                  </div>
                  
                  <button 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                  >
                    Siguiente &raquo;
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-resultados">
              <h3>No se encontraron usuarios</h3>
              {searchTerm && (
                <p>No hay resultados para "{searchTerm}"</p>
              )}
              <button onClick={() => {
                setSearchTerm("")
                setTipoFiltro("todos")
                setActiveTab("todos")
              }}>
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalle de usuario */}
      {selectedUser && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            
            <div className="modal-header">
              <div className="modal-avatar">
                <img src={selectedUser.imagen_url || "/placeholder.svg?height=120&width=120"} alt={selectedUser.nombre_completo} />
              </div>
              <div className="modal-title">
                <h2>{selectedUser.nombre_completo}</h2>
                <p className="modal-subtitle">
                  {selectedUser.tipo_usuario === "proveedor" ? (
                    <><FaUserTie className="icon" /> Proveedor de servicios</>
                  ) : (
                    <><FaUserCheck className="icon" /> Arrendador</>
                  )}
                </p>
                {selectedUser.especialidad && (
                  <p className="modal-especialidad">{selectedUser.especialidad}</p>
                )}
                {selectedUser.calificacion && renderStars(selectedUser.calificacion)}
              </div>
            </div>
            
            <div className="modal-body">
              <div className="modal-section">
                <h3>Información de contacto</h3>
                <div className="contact-info">
                  <p><FaEnvelope className="icon" /> {selectedUser.correo_electronico}</p>
                  {selectedUser.telefono && (
                    <p><FaPhone className="icon" /> {selectedUser.telefono}</p>
                  )}
                  {selectedUser.direccion && (
                    <p><FaMapMarkerAlt className="icon" /> {selectedUser.direccion}</p>
                  )}
                </div>
              </div>
              
              {selectedUser.tipo_usuario === "proveedor" && (
                <div className="modal-section">
                  <h3>Estadísticas profesionales</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-value">{selectedUser.proyectos_completados || 0}</div>
                      <div className="stat-label">Proyectos completados</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{selectedUser.calificacion?.toFixed(1) || "N/A"}</div>
                      <div className="stat-label">Calificación promedio</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">
                        {favoritos.includes(selectedUser.id) ? "Sí" : "No"}
                      </div>
                      <div className="stat-label">En tus favoritos</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="modal-actions">
                {favoritos.includes(selectedUser.id) ? (
                  <button 
                    className="modal-button secondary" 
                    onClick={(e) => handleRemoveFromFavorites(selectedUser.id, e)}
                  >
                    <FaTimes className="icon" /> Eliminar de favoritos
                  </button>
                ) : (
                  <button 
                    className="modal-button primary" 
                    onClick={(e) => handleAddToFavorites(selectedUser.id, e)}
                  >
                    <FaStar className="icon" /> Añadir a favoritos
                  </button>
                )}
                <button className="modal-button primary">
                  Contactar
                </button>
                {selectedUser.tipo_usuario === "proveedor" && (
                  <button className="modal-button secondary">
                    Ver servicios
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UsuarioList
