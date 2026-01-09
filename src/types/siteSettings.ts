// types/siteSettings.ts
// Types para Site Settings - sincronizado con backend

/**
 * Settings públicos para storefront (header, footer, branding)
 * Endpoint: GET /api/site-settings/store
 */
export interface PublicSiteSettings {
    siteName: string | null;
    logoUrl: string | null;
    logoMobileUrl: string | null;
    faviconUrl: string | null;

    primaryColor: string | null;
    secondaryColor: string | null;
    accentColor: string | null;

    // Contact
    email: string | null;
    phone: string | null;
    whatsappUrl: string | null;

    // Social
    instagramUrl: string | null;
    facebookUrl: string | null;

    footerText: string | null;
    maintenanceMode: boolean | null;
}

/**
 * Settings completos para panel admin
 * Endpoint: GET /api/site-settings/admin
 */
export interface AdminSiteSettings {
    id: number;

    // Branding
    siteName: string | null;
    siteDescription: string | null;
    logoUrl: string | null;
    logoMobileUrl: string | null;
    faviconUrl: string | null;

    // Theme
    primaryColor: string | null;
    secondaryColor: string | null;
    accentColor: string | null;

    // SEO
    metaTitle: string | null;
    metaDescription: string | null;

    // Contact & Social
    email: string | null;
    phone: string | null;
    instagramUrl: string | null;
    facebookUrl: string | null;
    whatsappUrl: string | null;
    tiktokUrl: string | null;

    // Footer
    footerText: string | null;
    developerName: string | null;
    developerUrl: string | null;

    // Behavior
    maintenanceMode: boolean | null;
}

/**
 * Request para actualizar settings
 * Endpoint: PATCH /api/site-settings/admin
 */
export interface UpdateSiteSettingsRequest {
    // Branding
    siteName?: string;
    siteDescription?: string;
    logoUrl?: string;
    logoMobileUrl?: string;
    faviconUrl?: string;

    // Theme
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;

    // SEO
    metaTitle?: string;
    metaDescription?: string;

    // Contact & Social
    email?: string;
    phone?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    whatsappUrl?: string;
    tiktokUrl?: string;

    // Footer
    footerText?: string;
    developerName?: string;
    developerUrl?: string;

    // Behavior
    maintenanceMode?: boolean;
}
