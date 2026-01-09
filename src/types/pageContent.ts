// types/pageContent.ts
// Types para Page Content - sincronizado con backend

/**
 * Contenido público de página (para storefront)
 * Endpoint: GET /api/public/pages/{slug}
 */
export interface PublicPageContent {
    title: string;
    content: string;
    metaTitle: string | null;
    metaDescription: string | null;
}

/**
 * Registro completo de página (para admin)
 * Endpoint: GET /api/admin/pages/{id}
 */
export interface PageContentRecord {
    id: number;
    slug: string;
    title: string;
    content: string;
    published: boolean;
    metaTitle: string | null;
    metaDescription: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Datos para crear/actualizar página
 * Endpoint: POST/PUT /api/admin/pages
 */
export interface PageContentData {
    slug?: string; // Opcional: se genera automáticamente en backend
    title: string;
    content: string;
    published: boolean;
    metaTitle?: string;
    metaDescription?: string;
}
