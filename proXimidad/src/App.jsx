// App.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Lista from './components/modules/Lista_usuarios';
import Buscars from './components/modules/BuscarS';
import IniciarSe from './components/modules/Iniciar';
import Registrar from './components/modules/Registrar';
import { AuthProvider } from './Auth';
import './scss/style.scss';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usuarios" element={<Lista />} />
          <Route path="/servicios" element={<Buscars />} />
          <Route path="/Iniciar" element={<IniciarSe />} />
          <Route path="/registrar" element={<Registrar />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
