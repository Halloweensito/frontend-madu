// hooks/useSiteSettings.ts
// React Query hooks para Site Settings

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { siteSettingsService } from "@/services/siteSettingsService";
import type { UpdateSiteSettingsRequest } from "@/types/siteSettings";

// ==================== QUERY KEYS ====================

export const siteSettingsKeys = {
    all: ['siteSettings'] as const,
    public: () => [...siteSettingsKeys.all, 'public'] as const,
    admin: () => [...siteSettingsKeys.all, 'admin'] as const,
};

// ==================== HOOKS PÚBLICOS ====================

/**
 * Hook para obtener settings públicos (storefront)
 * Usado en Navbar, Footer, SEO, etc.
 */
export const usePublicSiteSettings = () => {
    return useQuery({
        queryKey: siteSettingsKeys.public(),
        queryFn: siteSettingsService.getPublicSettings,
        staleTime: 1000 * 60 * 10, // 10 minutos - cambia muy poco
        gcTime: 1000 * 60 * 30, // 30 minutos en cache
    });
};

// ==================== HOOKS ADMIN ====================

/**
 * Hook para obtener settings completos (admin panel)
 */
export const useAdminSiteSettings = () => {
    return useQuery({
        queryKey: siteSettingsKeys.admin(),
        queryFn: siteSettingsService.getAdminSettings,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

/**
 * Hook para actualizar settings
 */
export const useUpdateSiteSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateSiteSettingsRequest) =>
            siteSettingsService.updateSettings(data),
        onSuccess: () => {
            // Invalidar ambas queries para reflejar cambios
            queryClient.invalidateQueries({ queryKey: siteSettingsKeys.all });
        },
    });
};
