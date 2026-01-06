// hooks/useHome.ts
// React Query hooks for Home Section management

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { homeService } from '@/services/homeService';
import type { HomeSectionRequest, ReorderRequest } from '@/types/homeSection';

// ==================== QUERY KEYS ====================

export const homeKeys = {
    all: ['homeSections'] as const,
    store: () => [...homeKeys.all, 'store'] as const,
    admin: () => [...homeKeys.all, 'admin'] as const,
    detail: (id: number) => [...homeKeys.all, 'detail', id] as const,
};

// ==================== QUERIES ====================

/**
 * Hook para obtener secciones activas (público - tienda)
 */
export const useStoreFrontSections = () => {
    return useQuery({
        queryKey: homeKeys.store(),
        queryFn: homeService.getStoreFrontSections,
        staleTime: 1000 * 60 * 5, // 5 minutos - el home no cambia tan seguido
    });
};

/**
 * Hook para obtener todas las secciones (admin)
 */
export const useAdminHomeSections = () => {
    return useQuery({
        queryKey: homeKeys.admin(),
        queryFn: homeService.getAllSections,
    });
};

/**
 * Hook para obtener una sección por ID
 */
export const useHomeSectionById = (id: number | undefined) => {
    return useQuery({
        queryKey: homeKeys.detail(id!),
        queryFn: () => homeService.getSectionById(id!),
        enabled: !!id && id > 0,
    });
};

// ==================== MUTATIONS ====================

/**
 * Hook para crear una nueva sección
 */
export const useCreateHomeSection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: HomeSectionRequest) => homeService.createSection(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: homeKeys.all });
        },
    });
};

/**
 * Hook para actualizar una sección existente
 */
export const useUpdateHomeSection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: HomeSectionRequest }) =>
            homeService.updateSection(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: homeKeys.all });
            queryClient.invalidateQueries({ queryKey: homeKeys.detail(variables.id) });
        },
    });
};

/**
 * Hook para reordenar secciones
 */
export const useReorderHomeSections = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reorderList: ReorderRequest[]) =>
            homeService.reorderSections(reorderList),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: homeKeys.all });
        },
    });
};

/**
 * Hook para archivar (eliminar) una sección
 */
export const useArchiveHomeSection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => homeService.archiveSection(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: homeKeys.all });
        },
    });
};
