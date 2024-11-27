import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Lista from './components/modules/Lista_usuarios';
import './scss/style.scss';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<Lista />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
