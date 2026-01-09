// pages/MaintenancePage.tsx
// Página que se muestra cuando el sitio está en modo mantenimiento

import { Link } from 'react-router-dom';
import { Settings, LogIn } from 'lucide-react';
import { usePublicSiteSettings } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';

export default function MaintenancePage() {
    const { data: settings } = usePublicSiteSettings();

    const siteName = settings?.siteName || 'Nuestra Tienda';

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-8">

                {/* Ícono animado */}
                <div className="flex justify-center">
                    <div className="p-6 bg-stone-100 rounded-full">
                        <Settings className="w-16 h-16 text-stone-400 animate-spin-slow" />
                    </div>
                </div>

                {/* Mensaje principal */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-light tracking-wide text-stone-800">
                        Estamos mejorando
                    </h1>
                    <p className="text-stone-500 leading-relaxed">
                        <span className="font-medium text-stone-700">{siteName}</span> está
                        en mantenimiento. Volveremos muy pronto con novedades increíbles.
                    </p>
                </div>

                {/* Línea decorativa */}
                <div className="flex items-center justify-center gap-2 pt-8">
                    <div className="w-12 h-px bg-stone-200" />
                    <span className="text-xs text-stone-400 uppercase tracking-widest">
                        Gracias por tu paciencia
                    </span>
                    <div className="w-12 h-px bg-stone-200" />
                </div>

                {/* Link de acceso admin */}
                <div className="pt-8">
                    <Button variant="ghost" size="sm" asChild className="text-stone-400 hover:text-stone-600">
                        <Link to="/login">
                            <LogIn className="w-4 h-4 mr-2" />
                            Acceso Administrador
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
