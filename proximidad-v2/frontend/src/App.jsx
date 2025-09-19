// App.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ListaUsuarios from './components/modules/Lista_usuarios';
import Buscars from './components/modules/BuscarS';
import IniciarSe from './components/modules/Iniciar';
import { AuthProvider } from './Auth';
import { UserProvider } from './context/UserContext'; // Import UserProvider

function App() {
  return (
    <AuthProvider>
      <UserProvider> {/* Wrap BrowserRouter with UserProvider */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/usuarios" element={<ListaUsuarios />} />
            <Route path="/servicios" element={<Buscars />} />
            <Route path="/Iniciar" element={<IniciarSe />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;