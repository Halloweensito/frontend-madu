// hooks/usePageContent.ts
// React Query hooks para páginas dinámicas

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pageContentService } from '@/services/pageContentService';
import type { PageContentData } from '@/types/pageContent';

// ========== QUERY KEYS ==========
const pageKeys = {
    all: ['pages'] as const,
    public: () => [...pageKeys.all, 'public'] as const,
    publicBySlug: (slug: string) => [...pageKeys.public(), slug] as const,
    admin: () => [...pageKeys.all, 'admin'] as const,
    adminById: (id: number) => [...pageKeys.admin(), id] as const,
};

// ========== PÚBLICO ==========

/**
 * Hook para obtener todas las páginas públicas
 */
export function usePublicPages() {
    return useQuery({
        queryKey: pageKeys.public(),
        queryFn: pageContentService.getAllPublicPages,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
}

/**
 * Hook para obtener página por slug (público)
 */
export function usePublicPage(slug: string) {
    return useQuery({
        queryKey: pageKeys.publicBySlug(slug),
        queryFn: () => pageContentService.getPublicPageBySlug(slug),
        staleTime: 5 * 60 * 1000,
        retry: false, // No reintentar si no existe (404)
    });
}

// ========== ADMIN ==========

/**
 * Hook para obtener todas las páginas (admin)
 */
export function useAdminPages() {
    return useQuery({
        queryKey: pageKeys.admin(),
        queryFn: pageContentService.getAllPagesAdmin,
    });
}

/**
 * Hook para obtener página por ID (admin)
 */
export function useAdminPage(id: number) {
    return useQuery({
        queryKey: pageKeys.adminById(id),
        queryFn: () => pageContentService.getPageById(id),
        enabled: !!id, // Solo ejecutar si hay ID
    });
}

/**
 * Hook para crear página
 */
export function useCreatePage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pageContentService.createPage,
        onSuccess: () => {
            // Invalidar cache de páginas admin
            queryClient.invalidateQueries({ queryKey: pageKeys.admin() });
            queryClient.invalidateQueries({ queryKey: pageKeys.public() });
        },
    });
}

/**
 * Hook para actualizar página
 */
export function useUpdatePage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: PageContentData }) =>
            pageContentService.updatePage(id, data),
        onSuccess: (_, variables) => {
            // Invalidar cache específico y listados
            queryClient.invalidateQueries({ queryKey: pageKeys.adminById(variables.id) });
            queryClient.invalidateQueries({ queryKey: pageKeys.admin() });
            queryClient.invalidateQueries({ queryKey: pageKeys.public() });
        },
    });
}

/**
 * Hook para eliminar página
 */
export function useDeletePage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pageContentService.deletePage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pageKeys.admin() });
            queryClient.invalidateQueries({ queryKey: pageKeys.public() });
        },
    });
}
