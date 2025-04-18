import React, { useState } from 'react';
import Header from './modules/Header';
import Sec1 from './modules/Sec1';
import Sec2 from './modules/Sec2';
import Sec3 from './modules/Sec3';
import Footer from './modules/Footer'
import Registrar from './modules/Registrar';
import IniciarSesion from './modules/Iniciar';
import { X } from 'lucide-react';

function Home (){
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
       <Sec2/>
       <Sec3/>
       <Footer/>

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
          </div>
        </div>
      )}
    </>
    );

}


export default Home;