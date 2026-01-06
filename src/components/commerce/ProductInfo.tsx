import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import type { ProductResponse, ProductVariantResponse } from '../../types/types';

interface ProductInfoProps {
  product: ProductResponse;
  variant: ProductVariantResponse | null;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product, variant }) => {
  return (
    <div className="flex flex-col space-y-8">
      {/* Categoría */}
      {product.category?.name && (
        <Link
          to={`/categoria/${product.category.slug}`}
          className="text-sm text-stone-500 uppercase tracking-[0.2em] hover:text-stone-900 transition-colors inline-block w-fit font-light border-b border-stone-300 hover:border-stone-900 pb-1"
        >
          {product.category.name}
        </Link>
      )}

      {/* Título y Precio */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-light text-stone-900 tracking-tight">
          {product.name}
        </h1>
        <div className="mt-4">
          <span className="text-3xl font-medium text-stone-900">
            ${variant?.price.toLocaleString('es-AR', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </span>
        </div>
      </div>

      {/* Stock Info */}
      {variant && (
        <div className="flex items-center gap-2 text-sm">
          <Package size={16} className="text-stone-600" />
          {variant.stock > 0 ? (
            <span className="text-green-600 font-medium">
              En stock ({variant.stock} disponibles)
            </span>
          ) : (
            <span className="text-red-600 font-medium">Sin stock</span>
          )}
        </div>
      )}

      {/* Descripción */}
      {product.description && (
        <div className="pb-6 border-b border-stone-200">
          <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
};
