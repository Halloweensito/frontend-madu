// components/ui/pagination-controls.tsx
// Componente reutilizable de paginación del lado del servidor

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export function PaginationControls({
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    onPageChange,
    isLoading = false,
}: PaginationControlsProps) {
    // Safeguards para valores inválidos
    const safeTotalElements = Number.isFinite(totalElements) ? totalElements : 0;
    const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10;
    const safeTotalPages = Number.isFinite(totalPages) ? totalPages : 1;
    const safeCurrentPage = Number.isFinite(currentPage) ? currentPage : 0;

    const startItem = safeTotalElements > 0 ? safeCurrentPage * safePageSize + 1 : 0;
    const endItem = Math.min((safeCurrentPage + 1) * safePageSize, safeTotalElements);

    const canGoPrevious = safeCurrentPage > 0;
    const canGoNext = safeCurrentPage < safeTotalPages - 1;

    if (safeTotalElements === 0) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
            {/* Info de resultados */}
            <div className="text-sm text-stone-500 order-2 sm:order-1">
                Mostrando <span className="font-medium text-stone-900">{startItem}</span> a{" "}
                <span className="font-medium text-stone-900">{endItem}</span> de{" "}
                <span className="font-medium text-stone-900">{safeTotalElements}</span> resultados
            </div>

            {/* Botones de navegación */}
            <div className="flex items-center gap-1 order-1 sm:order-2">
                {/* Primera página */}
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(0)}
                    disabled={!canGoPrevious || isLoading}
                    title="Primera página"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Página anterior */}
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(safeCurrentPage - 1)}
                    disabled={!canGoPrevious || isLoading}
                    title="Anterior"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Indicador de página */}
                <div className="flex items-center gap-1 px-2 text-sm">
                    <span className="font-medium">{safeCurrentPage + 1}</span>
                    <span className="text-stone-400">/</span>
                    <span className="text-stone-500">{safeTotalPages || 1}</span>
                </div>

                {/* Página siguiente */}
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(safeCurrentPage + 1)}
                    disabled={!canGoNext || isLoading}
                    title="Siguiente"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Última página */}
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(safeTotalPages - 1)}
                    disabled={!canGoNext || isLoading}
                    title="Última página"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
