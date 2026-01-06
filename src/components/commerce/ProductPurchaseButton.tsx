import React, { useEffect, useState } from 'react';
import { AlertCircle, ShoppingCart, Check } from 'lucide-react';
import type { ProductResponse, ProductVariantResponse } from '../../types/types';
import { useAddToCart } from '@/utils/cart';

interface ProductPurchaseButtonProps {
  product: ProductResponse;
  variant: ProductVariantResponse | null;
}

import { useCartStore } from '@/stores/cartStore';

export const ProductPurchaseButton: React.FC<ProductPurchaseButtonProps> = ({ product, variant }) => {
  const { addProductToCart } = useAddToCart();
  const { openCart } = useCartStore();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (added) {
      timeout = setTimeout(() => setAdded(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [added]);

  const handleAddToCart = () => {
    if (!variant || variant.stock === 0) return;
    addProductToCart(product, variant, 1);
    setAdded(true);
    openCart();
  };

  return (
    <div className="pt-4 space-y-3">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!variant || variant.stock === 0}
        className={`w-full py-4 text-sm uppercase tracking-widest transition-colors shadow-sm flex items-center justify-center gap-2 ${added
            ? 'bg-green-600 text-white'
            : 'bg-stone-900 text-white hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed'
          }`}
      >
        {added ? (
          <>
            <Check size={18} />
            Agregado al Carrito
          </>
        ) : !variant ? (
          'Selecciona opciones'
        ) : variant.stock === 0 ? (
          'Sin Stock'
        ) : (
          <>
            <ShoppingCart size={18} />
            Agregar al Carrito
          </>
        )}
      </button>

      {/* Alerta de stock bajo */}
      {variant && variant.stock > 0 && variant.stock < 5 && (
        <p className="text-xs text-orange-600 flex items-center gap-1">
          <AlertCircle size={12} />
          ¡Solo quedan {variant.stock} unidades!
        </p>
      )}
    </div>
  );
};
