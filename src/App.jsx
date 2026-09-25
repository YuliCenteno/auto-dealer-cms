import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import VehiculosPage from './pages/VehiculosPage';
import VehiculoDetallePage from './pages/VehiculoDetallePage';
import NosotrosPage from './pages/NosotrosPage';
import CotizarPage from './pages/CotizarPage';
import BlogPage from './pages/BlogPage';
import ContactoPage from './pages/ContactoPage';

import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* Rutas de Vehículos */}
        <Route path="/vehiculos" element={<VehiculosPage />} />
        <Route path="/vehiculos/:id" element={<VehiculoDetallePage />} />

        {/* Alias/Redirección opcional por si alguien entra a /propiedades por error */}
        <Route path="/propiedades" element={<VehiculosPage />} />
        <Route path="/propiedades/:id" element={<VehiculoDetallePage />} />

        <Route path="/nosotros" element={<NosotrosPage />} />
        
        {/* Rutas de Cotización */}
        <Route path="/cotizar" element={<CotizarPage />} />
        <Route path="/tasaciones" element={<CotizarPage />} /> {/* Alias mantenido */}

        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contacto" element={<ContactoPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;