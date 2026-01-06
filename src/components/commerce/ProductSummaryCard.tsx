// components/commerce/ProductSummaryCard.tsx
// Card component for ProductSummary (simplified product data from home sections)

import { Link } from 'react-router-dom';
import type { ProductSummary } from '@/types/homeSection';

interface ProductSummaryCardProps {
    product: ProductSummary;
}

export function ProductSummaryCard({ product }: ProductSummaryCardProps) {
    const hasDiscount = product.promotionalPrice && product.promotionalPrice < (product.price || 0);
    const displayPrice = hasDiscount ? product.promotionalPrice : product.price;
    const isOutOfStock = product.stock === 0;

    return (
        <Link
            to={`/producto/${product.slug}`}
            className="group block h-full"
            aria-label={`Ver detalles de ${product.name}`}
        >
            <div className="h-full flex flex-col">
                {/* Image */}
                <div className="relative overflow-hidden aspect-3/4 mb-4 bg-stone-100">
                    {product.mainImageUrl ? (
                        <img
                            src={product.mainImageUrl}
                            alt={product.name}
                            loading="lazy"
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

                {/* Info */}
                <div className="flex-1 flex flex-col text-left px-2">
                    <h3
                        className="text-sm font-light text-stone-900 mb-1 group-hover:text-stone-600 transition-colors overflow-hidden text-ellipsis whitespace-nowrap"
                        title={product.name}
                    >
                        {product.name}
                    </h3>

                    <div className="mt-auto flex items-center gap-2">
                        {displayPrice !== undefined && displayPrice !== null ? (
                            <>
                                <span className="text-sm font-medium text-stone-900">
                                    ${displayPrice.toLocaleString('es-AR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </span>
                                {hasDiscount && product.price && (
                                    <span className="text-xs text-stone-400 line-through">
                                        ${product.price.toLocaleString('es-AR', {
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
}
