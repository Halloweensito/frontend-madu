// components/commerce/StorePagination.tsx
// Paginación elegante para la tienda pública

import { ChevronLeft, ChevronRight } from "lucide-react";

interface StorePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export function StorePagination({
    currentPage,
    totalPages,
    onPageChange,
    isLoading = false,
}: StorePaginationProps) {
    if (totalPages <= 1) return null;

    const canGoPrevious = currentPage > 0;
    const canGoNext = currentPage < totalPages - 1;

    // Generar array de páginas a mostrar
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // Mostrar todas las páginas
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Mostrar primera, última y algunas del medio
            pages.push(0);

            if (currentPage > 2) {
                pages.push('ellipsis');
            }

            for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            if (currentPage < totalPages - 3) {
                pages.push('ellipsis');
            }

            if (!pages.includes(totalPages - 1)) {
                pages.push(totalPages - 1);
            }
        }

        return pages;
    };

    return (
        <nav className="flex items-center justify-center gap-1 mt-12" aria-label="Paginación">
            {/* Botón anterior */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!canGoPrevious || isLoading}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Página anterior"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Números de página */}
            <div className="flex items-center gap-1 mx-2">
                {getPageNumbers().map((page, index) => (
                    page === 'ellipsis' ? (
                        <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-stone-400">
                            •••
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            disabled={isLoading}
                            className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${currentPage === page
                                    ? 'bg-stone-900 text-white'
                                    : 'border border-stone-200 text-stone-600 hover:bg-stone-100'
                                }`}
                            aria-label={`Página ${page + 1}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page + 1}
                        </button>
                    )
                ))}
            </div>

            {/* Botón siguiente */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!canGoNext || isLoading}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Página siguiente"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </nav>
    );
}
