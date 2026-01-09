// components/ui/brand-logo.tsx
// Componente reutilizable para mostrar el logo con estados de carga y fallback
// Invisible mientras carga, sin skeleton pulsante

import { useState } from 'react';
import { Cat } from 'lucide-react';

interface BrandLogoProps {
    logoUrl?: string | null;
    siteName: string;
    isLoading?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean; // Mostrar ícono Cat en fallback (para Footer)
    className?: string;
}

const sizeClasses = {
    sm: 'h-6 md:h-8',
    md: 'h-8 md:h-10',
    lg: 'h-10 md:h-12',
};

const textSizeClasses = {
    sm: 'text-lg tracking-[0.2em]',
    md: 'text-xl tracking-[0.25em]',
    lg: 'text-2xl tracking-[0.25em]',
};

export function BrandLogo({
    logoUrl,
    siteName,
    isLoading = false,
    size = 'md',
    showIcon = false,
    className = '',
}: BrandLogoProps) {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Estado: Cargando settings - invisible, no mostrar nada
    if (isLoading) {
        return <div className={`${sizeClasses[size]} w-24 ${className}`} />;
    }

    // Estado: Hay logo URL y no hubo error
    if (logoUrl && !imageError) {
        return (
            <div className={`relative ${className}`}>
                {/* Espacio reservado invisible mientras carga */}
                <div className={`${sizeClasses[size]} w-24 ${imageLoaded ? 'hidden' : 'block'}`} />
                <img
                    src={logoUrl}
                    alt={siteName}
                    className={`${sizeClasses[size]} w-auto object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'} transition-opacity duration-300`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                        setImageError(true);
                        setImageLoaded(true);
                    }}
                />
            </div>
        );
    }

    // Fallback: Texto (con o sin ícono)
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {showIcon && <Cat strokeWidth={1.5} className={`${sizeClasses[size]} text-black`} />}
            <span className={`font-light uppercase text-black select-none ${textSizeClasses[size]}`}>
                {siteName}
            </span>
        </div>
    );
}
