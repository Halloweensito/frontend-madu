// src/components/layout/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { usePublicSiteSettings } from '@/hooks/useSiteSettings';
import { useFavicon } from '@/hooks/useFavicon';
import { useAuth } from '@/hooks/useAuth';
import MaintenancePage from '@/pages/public/MaintenancePage';

export const Layout: React.FC = () => {
  const { data: settings } = usePublicSiteSettings();
  const { isAdmin } = useAuth();

  // Actualizar favicon dinámicamente
  useFavicon(settings?.faviconUrl);

  // Si está en modo mantenimiento y NO es admin, mostrar página de mantenimiento
  const isMaintenanceMode = settings?.maintenanceMode && !isAdmin;

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  // ✅ Determinar si mostrar el footer (ocultar en ciertas páginas si es necesario)
  const showFooter = true; // Puedes cambiar esto según tus necesidades

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">

      <Navbar />

      <main className="grow bg-stone-50">
        <Outlet />
      </main>

      {showFooter && <Footer />}

    </div>
  );
};