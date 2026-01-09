// services/pageContentService.ts
// Servicio para interactuar con API de páginas dinámicas

import { http } from './http';
import type { PublicPageContent, PageContentRecord, PageContentData } from '@/types/pageContent';

export const pageContentService = {
    // ========== PÚBLICO ==========

    /**
     * Obtener todas las páginas publicadas
     */
    getAllPublicPages: () =>
        http<PublicPageContent[]>('/public/pages'),

    /**
     * Obtener página por slug (público)
     */
    getPublicPageBySlug: (slug: string) =>
        http<PublicPageContent>(`/public/pages/${slug}`),

    // ========== ADMIN ==========

    /**
     * Obtener todas las páginas (admin)
     */
    getAllPagesAdmin: () =>
        http<PageContentRecord[]>('/admin/pages'),

    /**
     * Obtener página por ID (admin)
     */
    getPageById: (id: number) =>
        http<PageContentRecord>(`/admin/pages/${id}`),

    /**
     * Crear nueva página
     */
    createPage: (data: PageContentData) =>
        http<PageContentRecord>('/admin/pages', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /**
     * Actualizar página existente
     */
    updatePage: (id: number, data: PageContentData) =>
        http<PageContentRecord>(`/admin/pages/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    /**
     * Eliminar página
     */
    deletePage: (id: number) =>
        http<void>(`/admin/pages/${id}`, {
            method: 'DELETE',
        }),
};
