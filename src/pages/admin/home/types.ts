// pages/admin/home/types.ts
// Shared types for Home Settings

export interface HomeSettingsFormData {
    // Banner Principal (tipo HERO)
    bannerTitle: string;
    bannerSubtitle: string;
    bannerImageUrl: string;
    bannerLink: string;
    bannerActive: boolean;
    // Barra de Aviso (tipo BANNER - usamos como announcement)
    announcementEnabled: boolean;
    announcementMessage: string;
    // Productos Destacados (tipo FEATURED_PRODUCTS)
    featuredCategoryId: string;
    featuredActive: boolean;
    selectedProductIds: number[];
    // Categorías en Home (tipo CATEGORIES)
    selectedCategoryIds: number[];
    categoriesActive: boolean;
}

export const defaultFormValues: HomeSettingsFormData = {
    bannerTitle: '',
    bannerSubtitle: '',
    bannerImageUrl: '',
    bannerLink: '/productos',
    bannerActive: true,
    announcementEnabled: false,
    announcementMessage: '',
    featuredCategoryId: '',
    featuredActive: true,
    selectedProductIds: [],
    selectedCategoryIds: [],
    categoriesActive: true,
};
