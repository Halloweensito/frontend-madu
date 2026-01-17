import { http } from "./http";
import type {
  ProductResponse,
  CreateProductRequest,
  CreateCategoryRequest,
  CreateAttributeRequest,
  CreateAttributeValueRequest,
  Category,
  CategoryTree,
  Attribute,
  AttributeValue
} from "../types/types";

/**
 * Interfaz para respuestas paginadas del backend (Spring Boot 3.x format)
 */
interface PageResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export const productService = {
  // ==================== PRODUCTOS - ENDPOINTS PÚBLICOS (STORE) ====================

  // GET /api/products/store - Productos activos (paginado)
  getActiveProducts: (params?: { page?: number; size?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());

    const query = searchParams.toString();
    return http<PageResponse<ProductResponse>>(`/products/store${query ? `?${query}` : ''}`);
  },

  // GET /api/products/category/{slug} - Productos por categoría (paginado)
  getProductsByCategorySlug: (slug: string, params?: { page?: number; size?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());

    const query = searchParams.toString();
    return http<PageResponse<ProductResponse>>(`/products/category/${slug}${query ? `?${query}` : ''}`);
  },

  // GET /api/products/{slug} - Detalle de producto por slug
  getProductBySlug: (slug: string) =>
    http<ProductResponse>(`/products/${slug}`),

  // GET /api/products/search - Búsqueda de productos
  searchProducts: (params: {
    query?: string;
    page?: number;
    size?: number;
  }) => {
    const searchParams = new URLSearchParams();

    if (params.query) searchParams.append('q', params.query);
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());

    return http<PageResponse<ProductResponse>>(`/products/search?${searchParams.toString()}`);
  },

  // ==================== PRODUCTOS - ENDPOINTS ADMINISTRATIVOS ====================

  // GET /api/products/admin - Todos los productos (paginado)
  getAllProducts: (params?: { page?: number; size?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());

    const query = searchParams.toString();
    return http<PageResponse<ProductResponse>>(`/products/admin${query ? `?${query}` : ''}`);
  },

  // GET /api/products/id/{id} - Obtener por ID (para edición en admin)
  getProductById: (id: number) =>
    http<ProductResponse>(`/products/id/${id}`),

  // POST /api/products - Crear nuevo producto
  createProduct: (data: CreateProductRequest) =>
    http<ProductResponse>("/products", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    }),

  // PUT /api/products/{id} - Actualizar producto
  updateProduct: (id: number, data: CreateProductRequest) =>
    http<ProductResponse>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    }),

  // DELETE /api/products/{id} - Eliminar/archivar producto
  deleteProduct: (id: number) =>
    http<void>(`/products/${id}`, { method: "DELETE" }),

  // ==================== IMÁGENES GENERALES DEL PRODUCTO ====================

  // POST /api/products/{productId}/images - Agregar imagen general
  addGeneralImage: (productId: number, url: string, position?: number) =>
    http<ProductResponse>(`/products/${productId}/images`, {
      method: "POST",
      body: JSON.stringify({ url, position }),
      headers: { "Content-Type": "application/json" }
    }),

  // DELETE /api/products/{productId}/images/{imageId} - Eliminar imagen general
  removeGeneralImage: (productId: number, imageId: number) =>
    http<ProductResponse>(`/products/${productId}/images/${imageId}`, {
      method: "DELETE"
    }),

  // PUT /api/products/{productId}/images/reorder - Reordenar imágenes generales
  reorderProductImages: (productId: number, images: Array<{ id?: number; url: string; position?: number }>) =>
    http<ProductResponse>(`/products/${productId}/images/reorder`, {
      method: "PUT",
      body: JSON.stringify(images),
      headers: { "Content-Type": "application/json" }
    }),

  // ==================== CATEGORÍAS ====================

  // GET /api/categories
  getCategories: () =>
    http<Category[]>("/categories"),

  // GET /api/categories/tree
  getCategoryTree: () =>
    http<CategoryTree[]>('/categories/tree'),

  // GET /api/categories/slug/{slug}
  getCategoryBySlug: (slug: string) =>
    http<Category>(`/categories/slug/${slug}`),

  // POST /api/categories - Crear nueva categoría
  createCategory: (data: CreateCategoryRequest) =>
    http<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    }),

  // ==================== ATRIBUTOS ====================

  // GET /api/attributes - Obtener atributos globales
  getAttributes: () =>
    http<Attribute[]>("/attributes"),

  // GET /api/attributes/{id}
  getAttributeById: (id: number) =>
    http<Attribute>(`/attributes/${id}`),

  // POST /api/attributes - Crear nuevo atributo
  createAttribute: (data: CreateAttributeRequest) =>
    http<Attribute>("/attributes", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    }),

  // POST /api/attributes/{attributeId}/values - Crear valor de atributo
  createAttributeValue: (attributeId: number, data: CreateAttributeValueRequest) =>
    http<AttributeValue>(`/attributes/${attributeId}/values`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    }),

  // PATCH /api/attributes/reorder - Reordenar atributos globalmente
  reorderAttributes: (data: { ids: number[] }) =>
    http<void>("/attributes/reorder", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    }),

  // PATCH /api/attributes/{attributeId}/values/reorder - Reordenar valores de un atributo
  reorderAttributeValues: (attributeId: number, data: { ids: number[] }) =>
    http<void>(`/attributes/${attributeId}/values/reorder`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    }),

  // ==================== VARIANTES ====================

  // PATCH /api/products/{productId}/variants/{variantId}/stock
  updateVariantStock: (
    productId: number,
    variantId: number,
    newStock: number
  ) =>
    http<ProductResponse>(
      `/products/${productId}/variants/${variantId}/stock`,
      {
        method: "PATCH",
        body: JSON.stringify({ newStock }),
        headers: { "Content-Type": "application/json" }
      }
    ),

  // PATCH /api/products/{productId}/variants/{variantId}/price
  updateVariantPrice: (
    productId: number,
    variantId: number,
    newPrice: number
  ) =>
    http<ProductResponse>(
      `/products/${productId}/variants/${variantId}/price`,
      {
        method: "PATCH",
        body: JSON.stringify({ newPrice }),
        headers: { "Content-Type": "application/json" }
      }
    ),

  // POST /api/products/{productId}/variants/{variantId}/images/{imageId}
  linkImageToVariant: (
    productId: number,
    variantId: number,
    imageId: number
  ) =>
    http<ProductResponse>(
      `/products/${productId}/variants/${variantId}/images/${imageId}`,
      { method: "POST" }
    ),

  // DELETE /api/products/{productId}/variants/{variantId}/images/{imageId}
  removeVariantImage: (
    productId: number,
    variantId: number,
    imageId: number
  ) =>
    http<ProductResponse>(
      `/products/${productId}/variants/${variantId}/images/${imageId}`,
      { method: "DELETE" }
    ),

  // DELETE /api/products/{productId}/variants/{variantId}
  deleteVariant: (
    productId: number,
    variantId: number
  ) =>
    http<void>(
      `/products/${productId}/variants/${variantId}`,
      { method: "DELETE" }
    ),
};