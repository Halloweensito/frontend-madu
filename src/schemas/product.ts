// schemas/product-schema.ts
import { z } from 'zod';

// Atributo de variante
const variantAttributeValueSchema = z.object({
  attributeId: z.number(),
  valueId: z.number(),
  attributeName: z.string().nullish(), // ✅ Permitir null, undefined o string
  value: z.string().nullish(), // ✅ Permitir null, undefined o string
});

// IMPORTANTE: imageUrls debe ser requerido pero puede ser array vacío
const productVariantSchema = z.object({
  sku: z.string().min(1, 'El SKU es requerido'),
  price: z.number().positive('El precio debe ser mayor a 0'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  imageUrls: z.array(z.string()).min(0), // Siempre array requerido, puede estar vacío
  attributes: z.array(variantAttributeValueSchema).min(1, 'Debe tener al menos un atributo'),
});

// Producto
export const createProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().nullish(), // ✅ Permitir null, undefined o string
  description: z.string().nullish(), // ✅ Permitir null, undefined o string
  categoryId: z.number().positive('Debes seleccionar una categoría'),
  variantAttributes: z.array(z.number()).min(1, 'Selecciona al menos un atributo'),
  variants: z.array(productVariantSchema).min(1, 'Debes agregar al menos una variante'),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type ProductVariantFormData = z.infer<typeof productVariantSchema>;
export type VariantAttributeValueFormData = z.infer<typeof variantAttributeValueSchema>;