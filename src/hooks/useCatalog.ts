import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService.ts';
import { categoryService } from '../services/categoryService.ts';
import type {
  CreateProductRequest,
  CreateCategoryRequest,
  CreateAttributeRequest,
  CreateAttributeValueRequest
} from '../types/types.ts';

// ==========================================
// 1. CATEGORÍAS
// ==========================================

// Hook para obtener todas las categorías (admin - incluye inactivas y archivadas)
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAllCategories,
  });
};

// Hook para obtener solo categorías activas (store)
export const useActiveCategories = () => {
  return useQuery({
    queryKey: ['categories', 'active'],
    queryFn: categoryService.getActiveCategories,
  });
};

// Hook para árbol de categorías (admin - completo)
export const useCategoryTree = () => {
  return useQuery({
    queryKey: ['categoryTree'],
    queryFn: categoryService.getAdminCategoryTree,
    staleTime: 1000 * 60 * 10,
  });
};

// Hook para árbol de categorías activas (store)
export const useActiveCategoryTree = () => {
  return useQuery({
    queryKey: ['categoryTree', 'active'],
    queryFn: categoryService.getActiveCategoryTree,
    staleTime: 1000 * 60 * 10,
  });
};

// Hook para obtener categoría por slug
export const useCategoryBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoryService.getCategoryBySlug(String(slug)),
    enabled: slug != null && slug !== '',
  });
};

// Hook para obtener categoría por ID
export const useCategoryById = (id: number | undefined) => {
  return useQuery({
    queryKey: ['category', 'id', id],
    queryFn: () => categoryService.getCategoryById(id!),
    enabled: !!id && id > 0,
  });
};

// Hook para crear categoría
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryTree'] });
    }
  });
};

// Hook para actualizar categoría
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateCategoryRequest }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryTree'] });
      queryClient.invalidateQueries({ queryKey: ['category', 'id', variables.id] });
    }
  });
};

// Hook para eliminar/archivar categoría
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryTree'] });
    }
  });
};

// ==========================================
// 2. ATRIBUTOS (CON ORDENAMIENTO POR POSITION)
// ==========================================

export const useAttributes = () => {
  return useQuery({
    queryKey: ['attributes'],
    queryFn: async () => {
      const data = await productService.getAttributes();
      if (!data) return [];

      // 1. Ordenar Atributos (Padres)
      const sortedAttributes = [...data].sort((a, b) =>
        (a.position ?? 0) - (b.position ?? 0)
      );

      // 2. Ordenar Valores dentro de cada atributo
      sortedAttributes.forEach(attr => {
        if (attr.values) {
          attr.values.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        }
      });

      return sortedAttributes;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para obtener UN atributo específico (con valores ordenados)
export const useAttributeById = (id: number | undefined) => {
  return useQuery({
    queryKey: ['attribute', id],
    queryFn: async () => {
      if (!id) return null;

      const data = await productService.getAttributeById(id);

      // Ordenar valores
      if (data?.values) {
        data.values.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      }

      return data;
    },
    enabled: !!id && id > 0,
  });
};

export const useCreateAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAttributeRequest) => productService.createAttribute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
    }
  });
};

export const useCreateAttributeValue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ attributeId, data }: { attributeId: number; data: CreateAttributeValueRequest }) =>
      productService.createAttributeValue(attributeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
    }
  });
};

// Hook para reordenar atributos
export const useReorderAttributes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: number[]) =>
      productService.reorderAttributes({ ids: orderedIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
    }
  });
};

// Hook para reordenar valores de un atributo
export const useReorderAttributeValues = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ attributeId, orderedIds }: { attributeId: number; orderedIds: number[] }) =>
      productService.reorderAttributeValues(attributeId, { ids: orderedIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
    }
  });
};

// ==========================================
// 3. PRODUCTOS (Lectura)
// ==========================================

// Hook para obtener todos los productos (admin - paginado)
export const useProducts = (params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: ['products', 'admin', params],
    queryFn: () => productService.getAllProducts(params),
  });
};

// Hook para obtener productos activos (store - paginado)
export const useActiveProducts = (params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: ['products', 'active', params],
    queryFn: () => productService.getActiveProducts(params),
  });
};

export const useProductBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductBySlug(String(slug)),
    enabled: slug != null && slug !== '',
  });
};

export const useProductById = (id: number | undefined) => {
  return useQuery({
    queryKey: ['product', 'id', id],
    queryFn: () => productService.getProductById(id!),
    enabled: !!id && id > 0,
  });
};

export const useProductsByCategorySlug = (
  slug: string | undefined,
  params?: { page?: number; size?: number }
) => {
  return useQuery({
    queryKey: ['products', 'category', 'slug', slug, params],
    queryFn: () => productService.getProductsByCategorySlug(String(slug), params),
    enabled: slug != null && slug !== '',
  });
};

// Hook para búsqueda de productos
export const useSearchProducts = (params: {
  query?: string;
  page?: number;
  size?: number;
}) => {
  return useQuery({
    queryKey: ['products', 'search', params],
    queryFn: () => productService.searchProducts(params),
    enabled: !!params.query,
  });
};

// ==========================================
// 4. PRODUCTOS (Escritura / Admin)
// ==========================================

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateProductRequest }) =>
      productService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', 'id', variables.id] });
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useDeleteVariant = (productId?: number) => {
  return useMutation({
    mutationFn: (variantId: number) => {
      if (!productId) {
        throw new Error("Product ID is required to delete a variant");
      }
      return productService.deleteVariant(productId, variantId);
    },
    onSuccess: () => {
      // Mantenemos esto vacío para evitar recargas en el VariantGenerator
    }
  });
};