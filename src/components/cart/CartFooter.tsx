// components/cart/CartFooter.tsx
// Componente de presentación para el footer del carrito

import { MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartFooterProps {
    totalPrice: number;
    isValidating: boolean;
    onCheckout: () => void;
    onClearCart: () => void;
}

export function CartFooter({
    totalPrice,
    isValidating,
    onCheckout,
    onClearCart
}: CartFooterProps) {
    return (
        <div className="border-t border-stone-100 bg-stone-50/50 p-6 space-y-4">
            <div className="space-y-1.5">
                <div className="flex justify-between text-base font-medium text-stone-900">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-stone-500">
                    El envío y los impuestos se calculan al coordinar por WhatsApp.
                </p>
            </div>

            <div className="grid gap-3">
                <Button
                    onClick={onCheckout}
                    disabled={isValidating}
                    className="w-full bg-black hover:bg-stone-800 text-white shadow-sm transition-colors"
                    size="lg"
                >
                    {isValidating ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Validando stock...
                        </>
                    ) : (
                        <>
                            <MessageCircle className="mr-2 h-5 w-5" />
                            Completar pedido
                        </>
                    )}
                </Button>

                <Button
                    variant="ghost"
                    onClick={onClearCart}
                    className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 h-auto py-2"
                >
                    Vaciar carrito
                </Button>
            </div>
        </div>
    );
}
