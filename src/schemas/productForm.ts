import { z } from "zod";

const imageRequestSchema = z.object({
  id: z.number().optional(),
  url: z.string(),
  position: z.number().optional(),
  tempId: z.string().optional(), // 👈 AGREGAR ESTE CAMPO
});

export const productFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  slug: z.string().nullish(),
  description: z.string().nullish(),
  categoryId: z.number().int().min(1, "Selecciona o crea una categoría válida"),
  // Precio y stock deben ser >= 0
  defaultPrice: z.coerce.number().min(0, "El precio no puede ser negativo"),
  defaultStock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  images: z.array(imageRequestSchema).default([]),
  attributesConfig: z.array(z.any()).default([]),
  // Validar estructura mínima de variantes y que su precio sea mayor a 0
  variants: z.array(z.object({
    id: z.number().optional(),
    sku: z.string().optional(),
    price: z.coerce.number().min(0, "El precio no puede ser negativo"),
    stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
    attributeValueIds: z.array(z.number()).optional(),
    image: imageRequestSchema.optional(),
  })).default([]),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED'])
    .optional(),
});

export type ProductFormSchema = z.infer<typeof productFormSchema>;
