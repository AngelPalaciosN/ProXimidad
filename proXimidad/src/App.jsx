// App.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ListaUsuarios from './components/modules/Lista_usuarios';
import Buscars from './components/modules/BuscarS';
import IniciarSe from './components/modules/Iniciar';
import './scss/style.scss';
import { AuthProvider } from './Auth';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usuarios" element={<ListaUsuarios />} />
          <Route path="/servicios" element={<Buscars />} />
          <Route path="/Iniciar" element={<IniciarSe />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
