// src/components/layout/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout: React.FC = () => {

  // ✅ Determinar si mostrar el footer (ocultar en ciertas páginas si es necesario)
  const showFooter = true; // Puedes cambiar esto según tus necesidades

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">

      <Navbar />

      <main className="growbg-stone-50">
        <Outlet />
      </main>

      {showFooter && <Footer />}

    </div>
  );
};