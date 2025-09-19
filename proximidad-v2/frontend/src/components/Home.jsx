import React, { useState } from 'react';
import Header from './modules/Header';
import Sec1 from './modules/Sec1';
import Sec2 from './modules/Sec2';
import Sec3 from './modules/Sec3';
import Footer from './modules/Footer'
import Registrar from './modules/Registrar';
import IniciarSesion from './modules/Iniciar';
import Editar_p from './modules/Editar_p';
import { X } from 'lucide-react';
import { useAuth } from '../Auth';
import { UserProvider } from '../context/UserContext';

function Home() {
  const { user } = useAuth();
  const [formularioVisible, setFormularioVisible] = useState(null);

  const handleAbrirFormulario = (formulario) => {
    setFormularioVisible(formulario);
  };

  const handleCerrarFormulario = () => {
    setFormularioVisible(null);
  };

  return (
    <>
      <Header handleAbrirFormulario={handleAbrirFormulario} />
      <Sec1 handleAbrirFormulario={handleAbrirFormulario} />
      <Sec2 />
      <Sec3 handleAbrirFormulario={handleAbrirFormulario} />
      <Footer />

      {formularioVisible && (
        <div className="overlay">
          <div className="form-container">
            <button className="close-button" onClick={handleCerrarFormulario}><X size={20} /></button>
            {formularioVisible === 'registrar' && (
              <Registrar onClose={handleCerrarFormulario} onFormularioChange={handleAbrirFormulario} />
            )}
            {formularioVisible === 'iniciarSesion' && (
              <IniciarSesion onClose={handleCerrarFormulario} onFormularioChange={handleAbrirFormulario} />
            )}
            {formularioVisible === 'editarPerfil' && (
              <Editar_p onClose={handleCerrarFormulario} user={user} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function HomeWrapped() {
  return (
    <UserProvider>
      <Home />
    </UserProvider>
  );
}

export default HomeWrapped;
