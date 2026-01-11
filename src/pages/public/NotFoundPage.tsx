// pages/public/NotFoundPage.tsx
// Página 404 estática

import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center space-y-6">
                <h1 className="text-8xl font-light text-stone-200">404</h1>
                <div className="space-y-2">
                    <h2 className="text-2xl font-light text-stone-900 tracking-wide">
                        Página no encontrada
                    </h2>
                    <p className="text-stone-500 font-light">
                        La página que buscas no existe o ha sido movida.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="font-light tracking-wide"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={1.5} />
                        Volver
                    </Button>
                    <Link to="/">
                        <Button className="bg-stone-900 hover:bg-stone-800 font-light tracking-wide w-full">
                            <Home className="mr-2 h-4 w-4" strokeWidth={1.5} />
                            Ir al inicio
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
