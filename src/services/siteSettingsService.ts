// services/siteSettingsService.ts
// Service para Site Settings

import { http } from "./http";
import type {
    PublicSiteSettings,
    AdminSiteSettings,
    UpdateSiteSettingsRequest
} from "@/types/siteSettings";

/**
 * Servicio para gestión de configuración del sitio
 * Endpoints públicos (/store) y administrativos (/admin)
 */
export const siteSettingsService = {
    // ==================== ENDPOINTS PÚBLICOS (STORE) ====================

    /**
     * GET /api/site-settings/store
     * Settings públicos para storefront (header, footer, branding)
     */
    getPublicSettings: () =>
        http<PublicSiteSettings>('/site-settings/store'),

    // ==================== ENDPOINTS ADMINISTRATIVOS ====================

    /**
     * GET /api/site-settings/admin
     * Settings completos para el panel de administración
     */
    getAdminSettings: () =>
        http<AdminSiteSettings>('/site-settings/admin'),

    /**
     * PATCH /api/site-settings/admin
     * Actualización parcial de settings
     */
    updateSettings: (data: UpdateSiteSettingsRequest) =>
        http<AdminSiteSettings>('/site-settings/admin', {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
};
