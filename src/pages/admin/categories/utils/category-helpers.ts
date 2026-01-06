// pages/admin/categories/utils/category-helpers.ts
import type { CategoryFormData } from '@/schemas/categoryForm';
import type { CategoryResponse, CategoryRequest } from '@/types/types';

/**
 * Valores por defecto para el formulario de categoría
 */
export const defaultCategoryValues: CategoryFormData = {
    name: '',
    slug: '',
    description: '', // Mejor usar string vacío que null para inputs controlados
    parentId: null,
    imageUrl: null,
    status: 'ACTIVE',
};

/**
 * Mapea una categoría del backend al formato del formulario
 */
export const mapCategoryToFormData = (category: CategoryResponse): CategoryFormData => ({
    name: category.name,
    slug: category.slug,
    // 🔍 CORRECCIÓN: Usar la descripción del backend. 
    // Si tu CategoryResponse no la tiene, asegúrate de agregarla al DTO en Java.
    description: category.description || '',
    // Usamos parentId si el backend devuelve el ID plano o el objeto parent
    parentId: category.parentId || category.parentId || null,
    imageUrl: category.imageUrl || null,
    // 🎯 IMPORTANTE: Validación defensiva del estado
    status: (['ACTIVE', 'INACTIVE', 'ARCHIVED'].includes(category.status as string)
        ? category.status
        : 'ACTIVE') as any, // Cast as any to satisfy Zod schema typing if needed
});

/**
 * Mapea los datos del formulario al formato del backend
 */
export const mapFormToPayload = (data: CategoryFormData): CategoryRequest => ({
    name: data.name.trim(),
    slug: data.slug.trim().toLowerCase(),
    description: data.description?.trim() || null,
    parentId: data.parentId || null,
    imageUrl: data.imageUrl || null,
    status: data.status || 'ACTIVE',
});

/**
 * Genera un slug automáticamente desde el nombre
 */
export const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};