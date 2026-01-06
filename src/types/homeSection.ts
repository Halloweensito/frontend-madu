// types/homeSection.ts
// Types for Home Section management - matches backend DTOs

// ==================== ENUMS ====================

// ==================== ENUMS ====================

export const SectionType = {
    HERO: 'HERO',
    CATEGORIES: 'CATEGORIES',
    FEATURED_PRODUCTS: 'FEATURED_PRODUCTS',
    BANNER: 'BANNER',
    TEXT_BLOCK: 'TEXT_BLOCK',
} as const;

export type SectionType = typeof SectionType[keyof typeof SectionType];

// ==================== RESPONSE DTOs ====================

/**
 * Item dentro de una sección (producto, categoría o hero slide)
 * Corresponde a HomeSectionItemResponse del backend
 */
export interface HomeSectionItemResponse {
    id: number;
    position: number;
    imageUrl?: string;
    redirectUrl?: string;
    title?: string;
    product?: ProductSummary;
    category?: CategorySummary;
}

/**
 * Resumen de producto para items (coincide con ProductSummaryDTO del backend)
 */
export interface ProductSummary {
    id: number;
    name: string;
    slug: string;
    mainImageUrl?: string;
    price?: number;
    promotionalPrice?: number;
    stock?: number;
}

/**
 * Resumen de categoría para items
 */
export interface CategorySummary {
    id: number;
    name: string;
    slug: string;
    imageUrl?: string;
}

/**
 * Sección completa del Home
 * Corresponde a HomeSectionResponse del backend
 */
export interface HomeSectionResponse {
    id: number;
    type: SectionType;
    title?: string;
    subtitle?: string;
    position: number;
    active: boolean;
    imageUrl?: string;
    linkUrl?: string;
    items: HomeSectionItemResponse[];
}

// ==================== REQUEST DTOs ====================

/**
 * Item para crear/actualizar una sección
 * Corresponde a HomeSectionItemRequest del backend
 */
export interface HomeSectionItemRequest {
    id?: number;
    position: number;
    imageUrl?: string;
    redirectUrl?: string;
    title?: string;
    productId?: number;
    categoryId?: number;
}

/**
 * Request para crear/actualizar una sección
 * Corresponde a HomeSectionRequest del backend
 */
export interface HomeSectionRequest {
    type: SectionType;
    title?: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    ctaText?: string;
    ctaLink?: string;
    position?: number;
    active: boolean;
    items?: HomeSectionItemRequest[];
}

/**
 * Request para reordenar secciones
 * Corresponde a ReorderRequest del backend
 */
export interface ReorderRequest {
    id: number;
    position: number;
}
