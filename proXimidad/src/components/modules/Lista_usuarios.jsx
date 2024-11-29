import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header'
import '../../scss/component-styles/Listaust.scss'

const UsuarioList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('http://localhost:8000/proX/usuarios/'); 
                setUsuarios(response.data);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('No se pudieron cargar los usuarios');
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, []);

    const renderUserList = (title, listId, users) => (
        <div className='container-fluid' id={listId}>
            <div className='container'>
                <h1>{title}</h1>
                {users.length > 0 ? (
                    <ul>
                        {users.map(usuario => (
                            <li key={usuario.id} id='u'>
                                {usuario.nombre_completo} - {usuario.correo_electronico}
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
                {renderUserList('Favoritos', 'favoritos', usuarios)}
                {renderUserList('Lista de Usuarios', 'usuarios', usuarios)}
            </div>
        </>
    );
};

export default UsuarioList;