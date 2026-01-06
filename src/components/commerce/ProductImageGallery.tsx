import React, { useState, useEffect, useMemo } from 'react';
import { Camera } from 'lucide-react'; // Icono opcional para fallback
import type { ProductVariantResponse } from '../../types/types';

interface ProductImageGalleryProps {
  variant: ProductVariantResponse | null;
  productName: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  variant,
  productName
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // ✅ SIMPLIFICACIÓN: Cuando cambia el SKU, reseteamos el índice y el error.
  // No necesitamos useRef para esto, el array de dependencias hace el trabajo.
  useEffect(() => {
    setSelectedImageIndex(0);
    setImageError(false);
  }, [variant?.sku]);

  const images = useMemo(() => {
    return variant?.images && variant.images.length > 0
      ? variant.images.map(img => img.url)
      : [];
  }, [variant]);
  
  const currentImage = images.length > 0 ? (images[selectedImageIndex] || images[0]) : null;

  // --- CASO 1: SIN IMÁGENES ---
  if (images.length === 0) {
    return (
      <div className="space-y-4">
        {/* 🚨 CORRECCIÓN: 'lglg:aspect-4/5lex' estaba mal escrito */}
        <div className="relative overflow-hidden bg-stone-100 rounded-lg shadow-sm aspect-[3/4] lg:aspect-[4/5] flex items-center justify-center">
          
          {/* Badge Agotado */}
          {variant && variant.stock === 0 && (
            <div className="absolute top-4 right-4 bg-stone-900 text-white text-xs px-3 py-1 uppercase tracking-widest font-bold z-10">
              Agotado
            </div>
          )}
          
          <div className="flex flex-col items-center gap-2 text-stone-400 px-4">
            <Camera strokeWidth={1.5} size={32} />
            <span className="text-sm text-center">Sin imágenes</span>
          </div>
        </div>
      </div>
    );
  }

  // --- CASO 2: CON IMÁGENES ---
  return (
    <div className="space-y-4">
      {/* Imagen Principal */}
      <div className="relative overflow-hidden bg-white rounded-lg shadow-sm aspect-[3/4] lg:aspect-[4/5] group">
        
        {!imageError && currentImage ? (
          <img
            src={currentImage}
            alt={`${productName} - Vista ${selectedImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
            // 'eager' para la primera imagen (LCP), 'lazy' para las demás si quisieras lógica compleja
            loading="eager" 
          />
        ) : (
          /* 🚨 CORRECCIÓN: bg-linear -> bg-gradient */
          <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
             <Camera strokeWidth={1} size={48} className="text-stone-400 opacity-50" />
          </div>
        )}
        
        {/* Badge Agotado */}
        {variant && variant.stock === 0 && (
          <div className="absolute top-4 right-4 bg-stone-900 text-white text-xs px-3 py-1 uppercase tracking-widest font-bold z-10">
            Agotado
          </div>
        )}
      </div>
      
      {/* Miniaturas (Scroll Horizontal) */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setSelectedImageIndex(index);
                setImageError(false);
              }}
              aria-label={`Ver imagen ${index + 1} de ${productName}`}
              className={`relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden rounded-md border-2 transition-all snap-start ${
                selectedImageIndex === index 
                  ? 'border-stone-900 ring-1 ring-stone-900 opacity-100' 
                  : 'border-transparent hover:border-stone-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img 
                src={img} 
                alt="" 
                className="w-full h-full object-cover" 
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};