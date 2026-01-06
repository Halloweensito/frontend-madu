import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { type CategoryResponse } from '../../types/types';

interface CategoryCardProps {
  category: CategoryResponse;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const [imageError, setImageError] = useState(false);
  
  const getDisplayImage = () => {
    if (category.imageUrl) return category.imageUrl;
    return "https://placehold.co/800x600/1a1a1a/ffffff?text=Category";
  };

  const displayImage = getDisplayImage();

  return (
    <Link 
    to={`/categoria/${category.slug}`}
      className="block group"
      aria-label={`Ver categoría ${category.name}`}
    >
      <div className="relative h-[90vh] w-full overflow-hidden">
        {!imageError ? (
          <img 
            src={displayImage} 
            alt={category.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-stone-800 to-stone-900" />
        )}

        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
          <div className="text-center px-10 py-8 border border-white/60 bg-white/5 backdrop-blur-[2px] transition-all duration-300 group-hover:border-white group-hover:bg-white/10">
            <h3 className="text-white text-3xl md:text-4xl font-light uppercase tracking-[0.3em] drop-shadow-lg">
              {category.name}
            </h3>

            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
              <div className="overflow-hidden">
                <p className="text-white/90 text-xs mt-4 font-normal tracking-[0.2em] uppercase border-b border-white/80 inline-block pb-1">
                  Ver Colección
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};