// schemas/categoryForm.ts
import { z } from 'zod';

/**
 * Schema de validación para formulario de categorías
 * Valida todos los campos necesarios para crear/editar una categoría
 */
export const categoryFormSchema = z.object({
    name: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .trim(),

    slug: z.string()
        .min(2, 'El slug debe tener al menos 2 caracteres')
        .max(100, 'El slug no puede exceder 100 caracteres')
        .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones')
        .trim(),

    description: z.string()
        .max(500, 'La descripción no puede exceder 500 caracteres')
        .optional()
        .nullable(),

    parentId: z.number()
        .int('El ID de la categoría padre debe ser un número entero')
        .positive('El ID de la categoría padre debe ser positivo')
        .optional()
        .nullable(),

    imageUrl: z.string()
        .url('Debe ser una URL válida')
        .optional()
        .or(z.literal(''))
        .nullable(),

    status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED'])
        .optional()
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
