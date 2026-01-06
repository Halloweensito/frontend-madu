// services/homeService.ts
// Service for Home Section management

import { http } from "./http";
import type {
    HomeSectionResponse,
    HomeSectionRequest,
    ReorderRequest,
} from "@/types/homeSection";

/**
 * Servicio para gestión de secciones del Home
 * Endpoints públicos (/store) y administrativos (/admin)
 */
export const homeService = {
    // ==================== ENDPOINTS PÚBLICOS (STORE) ====================

    /**
     * GET /api/home/store
     * Secciones activas ordenadas para la tienda pública
     */
    getStoreFrontSections: () =>
        http<HomeSectionResponse[]>('/home/store'),

    // ==================== ENDPOINTS ADMINISTRATIVOS ====================

    /**
     * GET /api/home/admin
     * Todas las secciones para el panel de administración
     */
    getAllSections: () =>
        http<HomeSectionResponse[]>('/home/admin'),

    /**
     * GET /api/home/{id}
     * Obtener una sección por ID
     */
    getSectionById: (id: number) =>
        http<HomeSectionResponse>(`/home/${id}`),

    /**
     * POST /api/home
     * Crear nueva sección
     */
    createSection: (data: HomeSectionRequest) =>
        http<HomeSectionResponse>('/home', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /**
     * PUT /api/home/{id}
     * Actualizar sección existente
     */
    updateSection: (id: number, data: HomeSectionRequest) =>
        http<HomeSectionResponse>(`/home/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    /**
     * PUT /api/home/reorder
     * Reordenar secciones
     */
    reorderSections: (reorderList: ReorderRequest[]) =>
        http<void>('/home/reorder', {
            method: 'PUT',
            body: JSON.stringify(reorderList),
        }),

    /**
     * DELETE /api/home/{id}
     * Archivar sección (soft delete)
     */
    archiveSection: (id: number) =>
        http<void>(`/home/${id}`, {
            method: 'DELETE',
        }),
};
