"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import Header from "./Header"
import { useAuth } from "../../Auth"
import { 
  FaStar, FaTimes, FaSearch, FaFilter, 
  FaUserTie, FaUserCheck, FaEnvelope, FaPhone, 
  FaMapMarkerAlt, FaBriefcase, FaSortAmountDown, FaSortAmountUp 
} from "react-icons/fa"
import Swal from "sweetalert2"
import "../../scss/component-styles/Listaust.scss"

const UsuarioList = () => {
  const [usuarios, setUsuarios] = useState([])
  const [favoritos, setFavoritos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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

  // Datos de demostración mejorados
  const mockUsuarios = [
    {
      id: 1,
      nombre_completo: "Juan Pérez",
      correo_electronico: "juan.perez@ejemplo.com",
      telefono: "+506 8888-1111",
      direccion: "San José, Costa Rica",
      tipo_usuario: "proveedor",
      especialidad: "Desarrollo Web",
      calificacion: 4.8,
      proyectos_completados: 27,
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 2,
      nombre_completo: "María González",
      correo_electronico: "maria.gonzalez@ejemplo.com",
      telefono: "+506 8888-2222",
      direccion: "Heredia, Costa Rica",
      tipo_usuario: "proveedor",
      especialidad: "Diseño Gráfico",
      calificacion: 4.9,
      proyectos_completados: 34,
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 3,
      nombre_completo: "Carlos Rodríguez",
      correo_electronico: "carlos.rodriguez@ejemplo.com",
      telefono: "+506 8888-3333",
      direccion: "Alajuela, Costa Rica",
      tipo_usuario: "arrendador",
      especialidad: null,
      calificacion: null,
      proyectos_completados: 0,
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      id: 4,
      nombre_completo: "Ana Martínez",
      correo_electronico: "ana.martinez@ejemplo.com",
      telefono: "+506 8888-4444",
      direccion: "Cartago, Costa Rica",
      tipo_usuario: "proveedor",
      especialidad: "Marketing Digital",
      calificacion: 4.7,
      proyectos_completados: 19,
      avatar: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
      id: 5,
      nombre_completo: "Roberto Sánchez",
      correo_electronico: "roberto.sanchez@ejemplo.com",
      telefono: "+506 8888-5555",
      direccion: "Limón, Costa Rica",
      tipo_usuario: "arrendador",
      especialidad: null,
      calificacion: null,
      proyectos_completados: 0,
      avatar: "https://randomuser.me/api/portraits/men/5.jpg"
    },
    {
      id: 6,
      nombre_completo: "Laura Jiménez",
      correo_electronico: "laura.jimenez@ejemplo.com",
      telefono: "+506 8888-6666",
      direccion: "Puntarenas, Costa Rica",
      tipo_usuario: "proveedor",
      especialidad: "Fotografía",
      calificacion: 4.5,
      proyectos_completados: 15,
      avatar: "https://randomuser.me/api/portraits/women/6.jpg"
    },
    {
      id: 7,
      nombre_completo: "Miguel Castro",
      correo_electronico: "miguel.castro@ejemplo.com",
      telefono: "+506 8888-7777",
      direccion: "Guanacaste, Costa Rica",
      tipo_usuario: "proveedor",
      especialidad: "Consultoría de Negocios",
      calificacion: 4.9,
      proyectos_completados: 42,
      avatar: "https://randomuser.me/api/portraits/men/7.jpg"
    },
    {
      id: 8,
      nombre_completo: "Sofía Vargas",
      correo_electronico: "sofia.vargas@ejemplo.com",
      telefono: "+506 8888-8888",
      direccion: "San José, Costa Rica",
      tipo_usuario: "arrendador",
      especialidad: null,
      calificacion: null,
      proyectos_completados: 0,
      avatar: "https://randomuser.me/api/portraits/women/8.jpg"
    }
  ]

  const fetchUsuarios = useCallback(async () => {
    try {
      // Intentar obtener datos de la API
      let usuariosData = []

      try {
        const response = await axios.get(`${baseUrl}/usuarios/`)
        usuariosData = response.data
      } catch (apiError) {
        console.warn("No se pudo conectar a la API, usando datos de demostración", apiError)
        // Usar datos de demostración mejorados
        usuariosData = mockUsuarios
      }

      setUsuarios(usuariosData)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("No se pudieron cargar los usuarios")
    } finally {
      setLoading(false)
    }
  }, [baseUrl])

  const fetchFavoritos = useCallback(async () => {
    if (user && user.usuario_id) {
      try {
        // Intentar obtener favoritos de la API
        try {
          const response = await axios.get(`${baseUrl}/favoritos/usuario/${user.usuario_id}/`)
          setFavoritos(response.data.map((fav) => fav.favorito))
        } catch (apiError) {
          console.warn("No se pudo conectar a la API para favoritos, usando datos de demostración", apiError)
          // Datos de demostración para favoritos
          setFavoritos([1, 4, 7]) // IDs de usuarios favoritos de demostración
        }
      } catch (err) {
        console.error("Error fetching favorites:", err)
      }
    }
  }, [user, baseUrl])

  useEffect(() => {
    fetchUsuarios()
    fetchFavoritos()
  }, [fetchUsuarios, fetchFavoritos])

  const handleAddToFavorites = async (usuarioId, event) => {
    // Evitar que el clic se propague al elemento padre
    if (event) {
      event.stopPropagation()
    }
    
    if (!user || !user.usuario_id) {
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
            await axios.post(`${baseUrl}/favoritos/`, { usuario: user.usuario_id, favorito: usuarioId })
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
            await axios.delete(`${baseUrl}/favoritos/eliminar/${user.usuario_id}/${usuarioId}/`)
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
                        <img src={usuario.imagen ? `${baseUrl}${usuario.imagen}` : "/placeholder.svg?height=80&width=80"} alt={usuario.nombre_completo} />
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
                <img src={selectedUser.imagen ? `${baseUrl}${selectedUser.imagen}` : "/placeholder.svg?height=120&width=120"} alt={selectedUser.nombre_completo} />
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
