// hooks/useSearch.ts
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { useDebounce } from './useDebounce';

/**
 * Hook personalizado para búsqueda de productos
 * Incluye debouncing automático y gestión de estado con React Query
 */
export function useSearch(initialQuery: string = '') {
    const [query, setQuery] = useState(initialQuery);
    const [page, setPage] = useState(0);
    const size = 12; // Productos por página

    // Debounce del query para evitar búsquedas en cada tecla
    const debouncedQuery = useDebounce(query, 300);

    // Query con React Query para caché y gestión de estado
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['search', debouncedQuery, page],
        queryFn: () => productService.searchProducts({
            query: debouncedQuery,
            page,
            size,
        }),
        enabled: debouncedQuery.length >= 2, // Solo buscar si hay al menos 2 caracteres
        staleTime: 1000 * 60 * 5, // 5 minutos de caché
    });

    return {
        // Estado
        query,
        setQuery,
        page,
        setPage,

        // Resultados
        products: data?.content || [],
        totalElements: data?.page?.totalElements || 0,
        totalPages: data?.page?.totalPages || 0,

        // Estados de carga
        isLoading,
        isFetching,
        error,

        // Helpers
        hasResults: (data?.content?.length || 0) > 0,
        isEmpty: debouncedQuery.length >= 2 && !isLoading && (data?.content?.length || 0) === 0,
    };
}
