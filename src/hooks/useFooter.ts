// hooks/useFooter.ts
// React Query hooks para Footer Sections y Links

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { footerService } from '@/services/footerService';
import type { FooterSectionRequest, FooterLinkRequest, FooterSectionAdmin, FooterLinkAdmin } from '@/types/footerSection';

// ==================== QUERY KEYS ====================

export const footerKeys = {
    all: ['footer'] as const,
    public: () => [...footerKeys.all, 'public'] as const,
    adminSections: () => [...footerKeys.all, 'admin', 'sections'] as const,
    adminLinks: () => [...footerKeys.all, 'admin', 'links'] as const,
};

// ==================== HOOKS PÚBLICOS ====================

/**
 * Hook para obtener footer público (secciones con links)
 */
export const usePublicFooter = () => {
    return useQuery({
        queryKey: footerKeys.public(),
        queryFn: footerService.getPublicFooter,
        staleTime: 1000 * 30, // 30 segundos - más rápido para ver cambios
        gcTime: 1000 * 60 * 5, // 5 minutos
    });
};

// ==================== HOOKS ADMIN - SECCIONES ====================

export const useAdminSections = () => {
    return useQuery({
        queryKey: footerKeys.adminSections(),
        queryFn: footerService.getAdminSections,
    });
};

export const useCreateSection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FooterSectionRequest) => footerService.createSection(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: footerKeys.all });
        },
    });
};

export const useUpdateSection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: FooterSectionRequest }) =>
            footerService.updateSection(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: footerKeys.all });
        },
    });
};

export const useDeleteSection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => footerService.deleteSection(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: footerKeys.all });
        },
    });
};

export const useReorderSections = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderedIds: number[]) => footerService.reorderSections(orderedIds),
        // Optimistic update - actualiza UI inmediatamente
        onMutate: async (orderedIds) => {
            // Cancelar queries en vuelo
            await queryClient.cancelQueries({ queryKey: footerKeys.adminSections() });

            // Guardar estado anterior
            const previousSections = queryClient.getQueryData<FooterSectionAdmin[]>(footerKeys.adminSections());

            // Actualizar cache optimísticamente
            if (previousSections) {
                const reordered = orderedIds.map((id, index) => {
                    const section = previousSections.find((s) => s.id === id);
                    return section ? { ...section, position: index } : null;
                }).filter(Boolean) as FooterSectionAdmin[];

                queryClient.setQueryData(footerKeys.adminSections(), reordered);
            }

            return { previousSections };
        },
        // Si falla, revertir al estado anterior
        onError: (_err, _orderedIds, context) => {
            if (context?.previousSections) {
                queryClient.setQueryData(footerKeys.adminSections(), context.previousSections);
            }
        },
        // Siempre refetch para sincronizar con servidor
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: footerKeys.adminSections() });
        },
    });
};

// ==================== HOOKS ADMIN - LINKS ====================

export const useAdminLinks = () => {
    return useQuery({
        queryKey: footerKeys.adminLinks(),
        queryFn: footerService.getAdminLinks,
    });
};

export const useCreateLink = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FooterLinkRequest) => footerService.createLink(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: footerKeys.all });
        },
    });
};

export const useUpdateLink = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: FooterLinkRequest }) =>
            footerService.updateLink(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: footerKeys.all });
        },
    });
};

export const useDeleteLink = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => footerService.deleteLink(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: footerKeys.all });
        },
    });
};

export const useReorderLinks = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ sectionId, orderedIds }: { sectionId: number; orderedIds: number[] }) =>
            footerService.reorderLinks(sectionId, orderedIds),
        // Optimistic update - actualiza UI inmediatamente
        onMutate: async ({ orderedIds }) => {
            // Cancelar queries en vuelo
            await queryClient.cancelQueries({ queryKey: footerKeys.adminLinks() });

            // Guardar estado anterior
            const previousLinks = queryClient.getQueryData<FooterLinkAdmin[]>(footerKeys.adminLinks());

            // Actualizar cache optimísticamente
            if (previousLinks) {
                const reordered = previousLinks.map((link) => {
                    const newPosition = orderedIds.indexOf(link.id);
                    if (newPosition !== -1) {
                        return { ...link, position: newPosition };
                    }
                    return link;
                });

                queryClient.setQueryData(footerKeys.adminLinks(), reordered);
            }

            return { previousLinks };
        },
        // Si falla, revertir al estado anterior
        onError: (_err, _variables, context) => {
            if (context?.previousLinks) {
                queryClient.setQueryData(footerKeys.adminLinks(), context.previousLinks);
            }
        },
        // Siempre refetch para sincronizar con servidor
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: footerKeys.adminLinks() });
        },
    });
};
