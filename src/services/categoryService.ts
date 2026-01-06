// services/categoryService.ts
import { http } from "./http";
import type { CategoryResponse, CategoryRequest, CategoryTree } from "@/types/types";

/**
 * Servicio para gestión de categorías
 * Separado en endpoints públicos (/store) y administrativos (/admin)
 */
export const categoryService = {
    // ==================== ENDPOINTS PÚBLICOS (STORE) ====================

    // GET /api/categories/store - Categorías activas para la tienda
    getActiveCategories: () =>
        http<CategoryResponse[]>('/categories/store'),

    // GET /api/categories/store/tree - Árbol de categorías activas
    getActiveCategoryTree: () =>
        http<CategoryTree[]>('/categories/store/tree'),

    // GET /api/categories/slug/{slug} - Categoría por slug (público)
    getCategoryBySlug: (slug: string) =>
        http<CategoryResponse>(`/categories/slug/${slug}`),

    // ==================== ENDPOINTS ADMINISTRATIVOS ====================

    // GET /api/categories/admin - Todas las categorías (incluyendo inactivas y archivadas)
    getAllCategories: () =>
        http<CategoryResponse[]>('/categories/admin'),

    // GET /api/categories/admin/tree - Árbol completo de categorías
    getAdminCategoryTree: () =>
        http<CategoryTree[]>('/categories/admin/tree'),

    // GET /api/categories/{id} - Obtener categoría por ID
    getCategoryById: (id: number) =>
        http<CategoryResponse>(`/categories/${id}`),

    // POST /api/categories - Crear nueva categoría
    createCategory: (data: CategoryRequest) =>
        http<CategoryResponse>('/categories', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        }),

    // PUT /api/categories/{id} - Actualizar categoría
    updateCategory: (id: number, data: CategoryRequest) =>
        http<CategoryResponse>(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        }),

    // DELETE /api/categories/{id} - Archivar categoría (cambia status a ARCHIVED)
    deleteCategory: (id: number) =>
        http<void>(`/categories/${id}`, {
            method: 'DELETE',
        }),
};
