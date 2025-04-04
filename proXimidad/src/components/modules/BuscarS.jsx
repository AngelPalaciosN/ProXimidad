import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import '../../scss/component-styles/Buscars.scss';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';

const BuscarS = () => {
    const [servicios, setServicios] = useState([]);
    const [serviciosFiltrados, setServiciosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await axios.get('http://192.168.207.112:8000/servicios/');
                
                // Transformar datos para manejar la estructura específica
                const serviciosTransformados = response.data.map(servicio => ({
                    ...servicio,
                    nombre: servicio.nombre_servicio,
                    precio: parseFloat(servicio.precio_base),
                    categoria: servicio.categoria_id,
                    nombre_categoria: servicio.nombre_categoria,
                    nombre_proveedor: servicio.nombre_proveedor
                }));

                setServicios(serviciosTransformados);
                setServiciosFiltrados(serviciosTransformados);
            } catch (err) {
                console.error('Error fetching servicios:', err);
                setError('No se pudieron cargar los servicios');
            } finally {
                setLoading(false);
            }
        };

        fetchServicios();
    }, []);

    useEffect(() => {
        // Filtrar servicios
        const resultados = servicios.filter(servicio => {
            const matchCategoria = categoriaSeleccionada 
                ? servicio.categoria === parseInt(categoriaSeleccionada)
                : true;
            
            const matchSearch = searchTerm 
                ? (servicio.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (servicio.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase())
                : true;

            return matchCategoria && matchSearch;
        });

        setServiciosFiltrados(resultados);
    }, [searchTerm, categoriaSeleccionada, servicios]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoriaChange = (e) => {
        setCategoriaSeleccionada(e.target.value);
    };

    const handleServiceClick = (service) => {
        setSelectedService(service);
    };

    const handleCloseModal = () => {
        setSelectedService(null);
    };

    const handleViewUsuarios = () => {
        navigate('/usuarios');
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Header />
            <div className='container-fluid' id='main-servicios'>
                <div className='container'>
                    <div className='filtros'>
                        <input 
                            type="text" 
                            placeholder="Buscar servicios..." 
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className='buscador'
                        />
                    </div>
                    
                    <div className='lista-servicios'>
                        <h1>Servicios</h1>
                        {serviciosFiltrados.length > 0 ? (
                            <ul>
                                {serviciosFiltrados.map(servicio => (
                                    <li 
                                        key={servicio.id} 
                                        className='servicio-item cursor-pointer hover:bg-gray-100 transition-colors'
                                        onClick={() => handleServiceClick(servicio)}
                                    >
                                        <h3>{servicio.nombre}</h3>
                                        <p>{servicio.descripcion}</p>
                                        <div className='servicio-detalles'>
                                            <span className='categoria'>Categoría: {servicio.nombre_categoria}</span>
                                            <span className='precio'>Precio: ${servicio.precio.toLocaleString()}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay servicios disponibles</p>
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
                                <strong>Precio:</strong> ${selectedService.precio.toFixed(2)}
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
                        <Button onClick={handleCloseModal} style={{ backgroundColor: '#005187', color: '#fcffff' }}>Cerrar</Button>
                        <Button onClick={handleViewUsuarios} style={{ backgroundColor: '#4d82bc', color: '#fcffff' }}>Ver Usuarios</Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default BuscarS;
