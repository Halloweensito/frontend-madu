// components/cart/CartItem.tsx
// Componente de presentación para un item del carrito

import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types/types';

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (variantId: number, quantity: number) => void;
    onRemove: (variantId: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    return (
        <div className="flex gap-4 py-4">
            {/* Imagen */}
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-stone-200 bg-stone-100">
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover object-center"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-stone-300">
                        <ShoppingBag size={24} />
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
                <div className="grid gap-1">
                    {/* Título y Precio */}
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-stone-900 line-clamp-2 pr-4">
                            {item.productName}
                        </h3>
                        <p className="text-sm font-semibold text-stone-900 whitespace-nowrap">
                            ${(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>

                    {/* Atributos */}
                    {item.attributes && item.attributes.length > 0 && (
                        <div className="flex flex-wrap gap-1 text-xs text-stone-500">
                            {item.attributes.map((attr, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200"
                                >
                                    {attr.value}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="text-xs text-stone-400">
                        Unitario: ${item.price.toFixed(2)}
                    </div>
                </div>

                {/* Controles */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-stone-200 rounded-md">
                        <button
                            onClick={() => onUpdateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1 hover:bg-stone-100 disabled:opacity-50 transition-colors"
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-medium tabular-nums">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1 hover:bg-stone-100 transition-colors"
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>

                    <button
                        onClick={() => onRemove(item.variantId)}
                        className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:inline">Eliminar</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
