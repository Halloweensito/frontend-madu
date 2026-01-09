// types/footerSection.ts
// Tipos para Footer Sections y Links - sincronizado con backend

/**
 * Link público para renderizar en footer
 */
export interface FooterLinkPublic {
    label: string;
    url: string;
}

/**
 * Sección pública del footer (columna con links)
 * Endpoint: GET /api/public/footer
 */
export interface FooterSectionPublic {
    title: string;
    links: FooterLinkPublic[];
}

/**
 * Link para admin (con todos los campos)
 * Endpoint: GET /api/admin/footer-links
 */
export interface FooterLinkAdmin {
    id: number;
    label: string;
    url: string;
    pageId: number | null;
    pageTitle: string | null;
    sectionId: number;
    position: number;
    active: boolean;
}

/**
 * Request para crear/actualizar link
 */
export interface FooterLinkRequest {
    label: string;
    url: string;
    pageId?: number | null;
    sectionId: number;
    position?: number;
    active: boolean;
}

/**
 * Sección para admin
 * Endpoint: GET /api/admin/footer-sections
 */
export interface FooterSectionAdmin {
    id: number;
    title: string;
    position: number;
    active: boolean;
}

/**
 * Request para crear/actualizar sección
 */
export interface FooterSectionRequest {
    title: string;
    position?: number;
    active: boolean;
}
