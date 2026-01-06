import { z } from 'zod';

export const ImageResponseSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  position: z.number().optional(), // ✅ Posición de la imagen en la galería
});

export const AttributeValueResponseSchema = z.object({
  id: z.number(),
  value: z.string(),
  slug: z.string(),
  hexColor: z.string().nullable().optional(),
  attribute: z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    type: z.enum(['SELECT', 'TEXT', 'COLOR']),
  }),
});

export const ProductVariantResponseSchema = z.object({
  id: z.number(),
  sku: z.string(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  images: z.array(ImageResponseSchema),
  attributeValues: z.array(AttributeValueResponseSchema),
});

export const CategoryResponseSchema: z.ZodTypeAny = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.union([z.string().url(), z.null(), z.undefined()]).optional(), // ✅ Permitir null, undefined o string con URL válida
  parent: z.lazy(() => CategoryResponseSchema.optional()),
  subCategories: z.lazy(() => z.array(CategoryResponseSchema).optional()),
  active: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const ProductResponseSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string(),
  description: z.string().nullish(), // ✅ Permitir null, undefined o string (nullish = null | undefined | string)
  category: CategoryResponseSchema,
  variants: z.array(ProductVariantResponseSchema),
  images: z.array(ImageResponseSchema).optional(), // ✅ Imágenes generales del producto
});

export const AttributeSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  type: z.enum(['SELECT', 'TEXT', 'COLOR']),
  values: z.array(z.object({
    id: z.number(),
    value: z.string(),
    slug: z.string(),
    hexColor: z.string().nullable().optional(),
    attribute: z.object({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
      type: z.enum(['SELECT', 'TEXT', 'COLOR']),
    }).optional(),
  })),
});

export const validateProductResponse = (data: unknown) => {
  return ProductResponseSchema.safeParse(data);
};

export const validateCategoryResponse = (data: unknown) => {
  return CategoryResponseSchema.safeParse(data);
};

export const validateAttribute = (data: unknown) => {
  return AttributeSchema.safeParse(data);
};

export const CreateCategoryRequestSchema = z.object({
  name: z.string().min(1, 'El nombre de la categoría es obligatorio').max(255, 'El nombre debe tener entre 1 y 255 caracteres'),
  slug: z.string().max(255, 'El slug no puede exceder 255 caracteres').nullish(), // ✅ Permitir null, undefined o string
  description: z.string().nullish(), // ✅ Permitir null, undefined o string
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  parentId: z.union([z.number().int().positive(), z.null()]).optional(), // ✅ Permitir null explícitamente (el backend usa Long que puede ser null)
  imageUrl: z.union([z.string().max(500, 'La URL de la imagen no puede exceder 500 caracteres'), z.null(), z.undefined()]).optional(), // ✅ Permitir null, undefined o string
});

export const validateCreateCategoryRequest = (data: unknown) => {
  return CreateCategoryRequestSchema.safeParse(data);
};

