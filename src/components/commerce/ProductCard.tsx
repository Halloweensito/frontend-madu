// components/commerce/ProductCard.tsx
// Card component that works with both ProductResponse and ProductSummary

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProductResponse } from '@/types/types';
import type { ProductSummary } from '@/types/homeSection';

// Union type for both full product and summary
type ProductData = ProductResponse | ProductSummary;

// Type guard to check if it's a ProductSummary
function isProductSummary(product: ProductData): product is ProductSummary {
  return 'mainImageUrl' in product || !('variants' in product);
}

interface ProductCardProps {
  product: ProductData;
  onClick?: (product: ProductData) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [imageError, setImageError] = useState(false);

  // Get image URL based on product type
  let displayImage: string;
  let productPrice: number | null = null;
  let promotionalPrice: number | null = null;
  let stock: number | undefined;
  let categoryName: string | undefined;

  if (isProductSummary(product)) {
    // ProductSummary from home sections (ProductSummaryDTO)
    displayImage = product.mainImageUrl || "https://placehold.co/600x800/1a1a1a/ffffff?text=No+Image";
    productPrice = product.price ?? null;
    promotionalPrice = product.promotionalPrice ?? null;
    stock = product.stock;
  } else {
    // Full ProductResponse with variants
    displayImage = product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0
      ? product.variants[0].images[0].url
      : "https://placehold.co/600x800/1a1a1a/ffffff?text=No+Image";
    productPrice = product.variants && product.variants.length > 0
      ? product.variants[0].price
      : null;
    categoryName = product.category?.name;
  }

  const hasDiscount = promotionalPrice !== null && promotionalPrice < (productPrice || 0);
  const displayPrice = hasDiscount ? promotionalPrice : productPrice;
  const isOutOfStock = stock === 0;

  return (
    <Link
      to={`/producto/${product.slug}`}
      onClick={() => onClick && onClick(product)}
      className="group block h-full cursor-pointer"
      aria-label={`Ver detalles de ${product.name}`}
    >
      <div className="h-full flex flex-col">
        {/* IMAGE */}
        <div className="relative overflow-hidden aspect-3/4 mb-4 bg-stone-100">
          {!imageError ? (
            <img
              src={displayImage}
              alt={product.name}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
              <span className="text-stone-400 text-4xl">📷</span>
            </div>
          )}

          {/* Out of stock badge */}
          {isOutOfStock && (
            <div className="absolute top-2 left-2 bg-stone-900 text-white text-xs font-medium px-2 py-1 rounded">
              Sin Stock
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && !isOutOfStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
              Oferta
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="flex-1 flex flex-col text-left px-2">
          {categoryName && (
            <p className="text-[10px] text-stone-500 mb-1 uppercase tracking-[0.2em]">
              {categoryName}
            </p>
          )}

          <h3
            className="text-sm font-light text-stone-900 mb-1 group-hover:text-stone-600 transition-colors overflow-hidden text-ellipsis whitespace-nowrap"
            title={product.name}
          >
            {product.name}
          </h3>

          <div className="mt-auto flex items-center gap-2">
            {displayPrice !== null && displayPrice !== undefined ? (
              <>
                <span className="text-sm font-medium text-stone-900">
                  ${displayPrice.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                {hasDiscount && productPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    ${productPrice.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm font-medium text-stone-500">Consultar</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};