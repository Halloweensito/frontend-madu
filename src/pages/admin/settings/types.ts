// pages/admin/settings/types.ts
// Tipos y valores por defecto para el formulario de configuración

import type { UpdateSiteSettingsRequest } from '@/types/siteSettings';

/**
 * Tipo del formulario (mismo que UpdateSiteSettingsRequest pero con valores requeridos)
 */
export type StoreSettingsFormData = UpdateSiteSettingsRequest;

/**
 * Valores por defecto del formulario
 */
export const defaultFormValues: StoreSettingsFormData = {
    // Branding
    siteName: '',
    siteDescription: '',
    logoUrl: '',
    logoMobileUrl: '',
    faviconUrl: '',

    // Theme
    primaryColor: '#000000',
    secondaryColor: '#f5f5f4',
    accentColor: '#78716c',

    // SEO
    metaTitle: '',
    metaDescription: '',

    // Contact & Social
    email: '',
    phone: '',
    instagramUrl: '',
    facebookUrl: '',
    whatsappUrl: '',
    tiktokUrl: '',

    // Footer
    footerText: '',
    developerName: '',
    developerUrl: '',

    // Behavior
    maintenanceMode: false,
};
