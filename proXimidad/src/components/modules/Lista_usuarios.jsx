import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { useAuth } from '../../Auth';
import { FaStar, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../../scss/component-styles/Listaust.scss';

const UsuarioList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('http://192.168.207.112:8000/usuarios/');
                setUsuarios(response.data);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('No se pudieron cargar los usuarios');
            } finally {
                setLoading(false);
            }
        };

        const fetchFavoritos = async () => {
            if (user && user.usuario_id) {
                try {
                    const response = await axios.get(`http://192.168.207.112:8000/favoritos/usuario/${user.usuario_id}/`);
                    setFavoritos(response.data.map(fav => fav.favorito));
                } catch (err) {
                    console.error('Error fetching favorites:', err);
                }
            }
        };

        fetchUsuarios();
        fetchFavoritos();
    }, [user]);

    const handleAddToFavorites = async (usuarioId) => {
        Swal.fire({
            title: '¿Añadir a favoritos?',
            text: "¿Estás seguro de que quieres añadir este usuario a tus favoritos?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, añadir'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post('http://192.168.207.11:8000/favoritos/', { usuario: user.usuario_id, favorito: usuarioId });
                    setFavoritos([...favoritos, usuarioId]);
                    Swal.fire('Añadido!', 'El usuario ha sido añadido a tus favoritos.', 'success');
                } catch (err) {
                    console.error('Error adding to favorites:', err);
                    Swal.fire('Error', 'No se pudo añadir el usuario a favoritos.', 'error');
                }
            }
        });
    };

    const handleRemoveFromFavorites = async (usuarioId) => {
        Swal.fire({
            title: '¿Eliminar de favoritos?',
            text: "¿Estás seguro de que quieres eliminar este usuario de tus favoritos?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://192.168.207.112:8000/favoritos/eliminar/${user.usuario_id}/${usuarioId}/`);
                    setFavoritos(favoritos.filter(fav => fav !== usuarioId));
                    Swal.fire('Eliminado!', 'El usuario ha sido eliminado de tus favoritos.', 'success');
                } catch (err) {
                    console.error('Error removing from favorites:', err);
                    Swal.fire('Error', 'No se pudo eliminar el usuario de favoritos.', 'error');
                }
            }
        });
    };

    const renderUserList = (title, listId, users) => (
        <div className='container-fluid' id={listId}>
            <div className='container'>
                <h1>{title}</h1>
                {users.length > 0 ? (
                    <ul>
                        {users.map(usuario => (
                            <li key={usuario.id} id='u'>
                                <span>{usuario.nombre_completo} - {usuario.correo_electronico}</span>
                                <div className='user-actions'>
                                    {favoritos.includes(usuario.id) ? (
                                        <button className='icon-button' disabled>
                                            Ya es favorito
                                        </button>
                                    ) : (
                                        <button 
                                            className='icon-button' 
                                            onClick={() => handleAddToFavorites(usuario.id)}
                                        >
                                            <FaStar className='icon star' />
                                        </button>
                                    )}
                                    <button 
                                        className='icon-button' 
                                        onClick={() => handleRemoveFromFavorites(usuario.id)}
                                    >
                                        <FaTimes className='icon delete' />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay usuarios disponibles</p>
                )}
            </div>
        </div>
    );

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Header />
            <div className='container-fluid' id='main'>
                {renderUserList('Favoritos', 'favoritos', usuarios.filter(usuario => favoritos.includes(usuario.id)))}
                {renderUserList('Proveedores', 'usuarios', usuarios.filter(usuario => usuario.tipo_usuario === 'proveedor'))}
            </div>
        </>
    );
};

export default UsuarioList;
