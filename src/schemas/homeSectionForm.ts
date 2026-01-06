// schemas/homeSectionForm.ts
// Zod validation schema for home section form

import { z } from "zod";
import { SectionType } from "@/types/homeSection";

// Schema para items de secciones
const homeSectionItemSchema = z.object({
    id: z.number().optional(),
    position: z.number().default(0),
    imageUrl: z.string().optional(),
    redirectUrl: z.string().optional(),
    title: z.string().optional(),
    productId: z.number().optional(),
    categoryId: z.number().optional(),
});

// Schema principal del formulario
export const homeSectionFormSchema = z.object({
    type: z.enum([
        SectionType.HERO,
        SectionType.CATEGORIES,
        SectionType.FEATURED_PRODUCTS,
        SectionType.BANNER,
        SectionType.TEXT_BLOCK,
    ]),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    ctaText: z.string().optional(),
    ctaLink: z.string().optional(),
    position: z.coerce.number().int().min(0).default(0),
    active: z.boolean().default(true),
    items: z.array(homeSectionItemSchema).default([]),
});

export type HomeSectionFormData = z.infer<typeof homeSectionFormSchema>;

// Valores por defecto
export const defaultHomeSectionValues: HomeSectionFormData = {
    type: SectionType.BANNER,
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    ctaText: "",
    ctaLink: "",
    position: 0,
    active: true,
    items: [],
};
