// components/cart/CartEmptyState.tsx
// Componente de presentación para el estado vacío del carrito

import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartEmptyStateProps {
    onGoToShop: () => void;
}

export function CartEmptyState({ onGoToShop }: CartEmptyStateProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="bg-stone-50 p-6 rounded-full">
                <ShoppingBag className="h-12 w-12 text-stone-300" strokeWidth={1} />
            </div>
            <div className="space-y-1">
                <h3 className="text-lg font-medium text-stone-900">El carrito está vacío</h3>
                <p className="text-sm text-stone-500 max-w-xs mx-auto">
                    Parece que aún no has agregado nada. Explora nuestra colección y encuentra algo que te encante.
                </p>
            </div>
            <Button onClick={onGoToShop} variant="outline" className="mt-4">
                Ir a la Tienda
            </Button>
        </div>
    );
}
