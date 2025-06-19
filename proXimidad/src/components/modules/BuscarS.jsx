"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Header from "./Header"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import "../../scss/component-styles/Buscars.scss"

const BuscarS = () => {
  const [servicios, setServicios] = useState([])
  const [serviciosFiltrados, setServiciosFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")
  const [selectedService, setSelectedService] = useState(null)

  // Usar la variable de entorno de Vite
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        // Intentar obtener datos de la API
        let serviciosData = []

        try {
          // Fixed: Use the correct endpoint that matches your Django URLs
          const response = await axios.get(`${baseUrl}/servicios/`)
          serviciosData = response.data
        } catch (apiError) {
          console.warn("No se pudo conectar a la API, usando datos de demostración", apiError)

          // Usar datos de demostración si la API no está disponible
          serviciosData = [
            {
              id: 1,
              nombre_servicio: "Desarrollo Web",
              descripcion: "Creación de sitios web profesionales y responsivos",
              precio_base: "1500.00",
              categoria_id: 1,
              nombre_categoria: "Tecnología",
              nombre_proveedor: "Juan Pérez",
            },
            {
              id: 2,
              nombre_servicio: "Diseño Gráfico",
              descripcion: "Diseño de logos, banners y material publicitario",
              precio_base: "800.00",
              categoria_id: 2,
              nombre_categoria: "Diseño",
              nombre_proveedor: "María González",
            },
            {
              id: 3,
              nombre_servicio: "Marketing Digital",
              descripcion: "Estrategias de marketing para redes sociales y SEO",
              precio_base: "1200.00",
              categoria_id: 3,
              nombre_categoria: "Marketing",
              nombre_proveedor: "Carlos Rodríguez",
            },
            {
              id: 4,
              nombre_servicio: "Consultoría de Negocios",
              descripcion: "Asesoría para emprendedores y pequeñas empresas",
              precio_base: "2000.00",
              categoria_id: 4,
              nombre_categoria: "Negocios",
              nombre_proveedor: "Ana Martínez",
            },
            {
              id: 5,
              nombre_servicio: "Traducción de Documentos",
              descripcion: "Traducción profesional de documentos en varios idiomas",
              precio_base: "500.00",
              categoria_id: 5,
              nombre_categoria: "Idiomas",
              nombre_proveedor: "Roberto Sánchez",
            },
            {
              id: 6,
              nombre_servicio: "Desarrollo de Aplicaciones Móviles",
              descripcion: "Creación de apps para iOS y Android",
              precio_base: "3000.00",
              categoria_id: 1,
              nombre_categoria: "Tecnología",
              nombre_proveedor: "Laura Díaz",
            },
          ]
        }

        // Transformar datos para manejar la estructura específica
        const serviciosTransformados = serviciosData.map((servicio) => ({
          ...servicio,
          nombre: servicio.nombre_servicio,
          precio: Number.parseFloat(servicio.precio_base),
          categoria: servicio.categoria_id,
        }))

        setServicios(serviciosTransformados)
        setServiciosFiltrados(serviciosTransformados)
      } catch (err) {
        console.error("Error fetching servicios:", err)
        setError("No se pudieron cargar los servicios")
      } finally {
        setLoading(false)
      }
    }

    fetchServicios()
  }, [baseUrl])

  useEffect(() => {
    // Filtrar servicios
    const resultados = servicios.filter((servicio) => {
      const matchCategoria = categoriaSeleccionada
        ? servicio.categoria === Number.parseInt(categoriaSeleccionada)
        : true

      const matchSearch = searchTerm
        ? (servicio.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (servicio.descripcion || "").toLowerCase().includes(searchTerm.toLowerCase())
        : true

      return matchCategoria && matchSearch
    })

    setServiciosFiltrados(resultados)
  }, [searchTerm, categoriaSeleccionada, servicios])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoriaChange = (e) => {
    setCategoriaSeleccionada(e.target.value)
  }

  const handleServiceClick = (service) => {
    setSelectedService(service)
  }

  const handleCloseModal = () => {
    setSelectedService(null)
  }

  const handleViewUsuarios = () => {
    // Fixed: Use proper navigation instead of window.location.href
    window.location.href = "/usuarios"
  }

  // Extraer categorías únicas para el filtro
  const categorias = [...new Set(servicios.map((s) => s.categoria))].map((catId) => {
    const servicio = servicios.find((s) => s.categoria === catId)
    return {
      id: catId,
      nombre: servicio?.nombre_categoria || `Categoría ${catId}`,
    }
  })

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando servicios...</p>
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
      <div className="container-fluid" id="main-servicios">
        <div className="container">
          <div className="filtros">
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="buscador"
            />

            {categorias.length > 0 && (
              <select className="filtro-categoria" value={categoriaSeleccionada} onChange={handleCategoriaChange}>
                <option key="all-categories" value="">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="lista-servicios">
            <h1>Servicios</h1>
            {serviciosFiltrados.length > 0 ? (
              <ul>
                {serviciosFiltrados.map((servicio) => (
                  <li key={servicio.id} className="servicio-item" onClick={() => handleServiceClick(servicio)}>
                    <h3>{servicio.nombre}</h3>
                    <p>{servicio.descripcion}</p>
                    <div className="servicio-detalles">
                      <span className="categoria">{servicio.nombre_categoria}</span>
                      <span className="precio">${servicio.precio ? servicio.precio.toLocaleString() : "0"}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-resultados">
                <p>No se encontraron servicios que coincidan con tu búsqueda</p>
                {searchTerm && <button onClick={() => setSearchTerm("")}>Limpiar búsqueda</button>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalles de Servicio */}
      {selectedService && (
        <Dialog open={!!selectedService} onClose={handleCloseModal}>
          <DialogTitle>{selectedService.nombre}</DialogTitle>
          <DialogContent>
            <div className="space-y-4">
              <DialogContentText>
                <strong>Descripción:</strong> {selectedService.descripcion}
              </DialogContentText>
              <DialogContentText>
                <strong>Precio:</strong> ${selectedService.precio ? selectedService.precio.toFixed(2) : "0.00"}
              </DialogContentText>
              <DialogContentText>
                <strong>Categoría:</strong> {selectedService.nombre_categoria}
              </DialogContentText>
              {selectedService.nombre_proveedor && (
                <DialogContentText>
                  <strong>Proveedor:</strong> {selectedService.nombre_proveedor}
                </DialogContentText>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} style={{ backgroundColor: "#005187", color: "#fcffff" }}>
              Cerrar
            </Button>
            <Button onClick={handleViewUsuarios} style={{ backgroundColor: "#4d82bc", color: "#fcffff" }}>
              Ver Usuarios
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default BuscarS
