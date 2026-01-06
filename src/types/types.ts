// types/types.ts - VERSIÓN ACTUALIZADA CON POSITION

// ==================== ENUMS ====================

export const Status = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ARCHIVED: 'ARCHIVED'
} as const;

export type Status = typeof Status[keyof typeof Status];

// ==================== BACKEND RESPONSES ====================

export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category: CategoryResponse;
  variants: ProductVariantResponse[];
  images?: ImageResponse[];
  status?: Status;
  price?: number;
  stock?: number;
}

export interface ProductVariantResponse {
  id: number;
  sku: string;
  price: number;
  stock: number;
  images: ImageResponse[];
  attributeValues: AttributeValueResponse[];
}

export interface AttributeValueResponse {
  id: number;
  value: string;
  slug: string;
  hexColor?: string;
  position?: number; // 👈 NUEVO: Posición del valor dentro del atributo
  attribute: {
    id: number;
    name: string;
    slug: string;
    type: 'SELECT' | 'TEXT' | 'COLOR';
    position?: number; // 👈 NUEVO: Posición del atributo
  };
}

export interface ImageResponse {
  id: number;
  url: string;
  position?: number;
}

export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId: number;
  subCategories?: CategoryResponse[];
  status?: Status;
  sortOrder?: number;
}

export interface CategoryTree {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  children?: CategoryTree[];
}

// ==================== BACKEND ENTITIES (Para fetch) ====================

export interface Attribute {
  id: number;
  name: string;
  slug: string;
  type: 'SELECT' | 'TEXT' | 'COLOR';
  position?: number; // 👈 NUEVO: Posición del atributo
  values: AttributeValue[];
}

export interface AttributeValue {
  id: number;
  value: string;
  slug: string;
  hexColor?: string;
  position?: number; // 👈 NUEVO: Posición del valor
  attribute?: {
    id: number;
    name: string;
    slug: string;
    type: 'SELECT' | 'TEXT' | 'COLOR';
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  parent?: Category;
  subCategories?: Category[];
  status?: Status;
  sortOrder?: number;
}

// ==================== REQUEST DTOs (Para Backend) ====================

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description?: string | null;
  sortOrder?: number;
  parentId?: number | null;
  imageUrl?: string | null;
  status?: Status;
}

// Alias para consistencia con el servicio
export type CategoryRequest = CreateCategoryRequest;

export interface CreateAttributeRequest {
  name: string;
  slug?: string;
  type: 'SELECT' | 'TEXT' | 'COLOR';
}

export interface CreateAttributeValueRequest {
  value: string;
  slug?: string;
  hexColor?: string;
}

export interface ImageRequest {
  id?: number;
  url: string;
  position?: number;
  tempId?: string;
}

export interface AttributePositionInfo {
  attributeId: number;
  position: number;
  values: Array<{
    valueId: number;
    position?: number;
  }>;
}

export interface CreateProductRequest {
  name: string;
  slug?: string;
  description?: string;
  categoryId: number;
  generalImages?: ImageRequest[];
  price?: number;
  stock?: number;
  variants?: ProductVariantRequest[];
  status?: Status;
}

export interface ProductVariantRequest {
  id?: number;
  sku?: string;
  price: number;
  stock: number;
  attributeValueIds?: number[];
  image?: ImageRequest;
  selectedImageIds?: number[];
  selectedImageTempIds?: string[];
}

// ==================== UI ONLY (No va al backend) ====================

export interface AttributeConfig {
  attributeId: number;
  attributeName: string;
  position: number; // 👈 NUEVO: Orden del atributo (0, 1, 2, ...)
  selectedValues: Array<{
    id: number;
    value: string;
    slug: string;
    hexColor?: string;
    position?: number; // 👈 NUEVO: Orden del valor dentro del atributo
  }>;
}

import type { ProductFormSchema } from "@/schemas/productForm";

export type ProductFormData = ProductFormSchema;

// ==================== UTILITY TYPES ====================

export interface ProductCardProps {
  product: ProductResponse;
}

export interface VariantSelectorProps {
  variants: ProductVariantResponse[];
  onVariantSelect: (variant: ProductVariantResponse) => void;
}

// ==================== CARRITO (FRONTEND ONLY) ====================

export interface CartItem {
  productId: number;
  productName: string;
  productSlug: string;
  variantId: number;
  variantSku?: string;
  price: number;
  quantity: number;
  attributes: Array<{
    attributeName: string;
    value: string;
  }>;
  imageUrl?: string;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  setItems: (items: CartItem[]) => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}