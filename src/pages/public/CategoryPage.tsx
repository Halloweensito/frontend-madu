import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ProductCard } from "../../components/commerce/ProductCard";
import { StorePagination } from "../../components/commerce/StorePagination";
import { useCategoryBySlug, useProductsByCategorySlug } from "../../hooks/useCatalog";
import { Breadcrumb } from "../../components/commerce/Breadcrumb";
import type { Category } from "../../types/types";

const PAGE_SIZE = 12;

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [currentPage, setCurrentPage] = useState(0);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(0);
  }, [slug]);

  // 1️⃣ Obtener categoría por slug
  const {
    data: category,
    isLoading: loadingCategory,
    error: errorCategory,
  } = useCategoryBySlug(slug || "");

  // 2️⃣ Obtener productos por slug de categoría (paginado)
  const {
    data: productsData,
    isLoading: loadingProducts,
    error: errorProducts,
  } = useProductsByCategorySlug(slug || "", { page: currentPage, size: PAGE_SIZE });

  // ✅ SEO: Cambiar título
  useEffect(() => {
    if (category && category.name) {
      const prev = document.title;
      document.title = `${category.name} - Pussycat`;

      return () => {
        document.title = prev;
      };
    }
  }, [category]);

  // --- CONDICIONALES DE CARGA/ERROR ---

  if (loadingCategory || loadingProducts) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="animate-spin text-stone-400" size={40} />
      </div>
    );
  }

  if (errorCategory || errorProducts || !category) {
    return (
      <div className="w-full min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <p className="text-center text-red-500">
          Categoría no encontrada
        </p>
      </div>
    );
  }

  // --- LÓGICA DE RENDERIZADO ---

  // Construir items del breadcrumb
  const buildBreadcrumbItems = () => {
    const items: Array<{ label: string; href?: string }> = [];
    items.push({ label: 'Productos', href: '/productos' });

    if (!category) return items;

    const ancestors: Array<{ label: string; href?: string }> = [];
    let cur: Category | undefined = category;

    while (cur) {
      ancestors.unshift({
        label: cur.name,
        href: `/categoria/${cur.slug}`
      });
      cur = cur.parent;
    }

    return items.concat(ancestors);
  };

  const breadcrumbItems = buildBreadcrumbItems();
  const products = productsData?.content || [];
  const totalPages = productsData?.totalPages || 0;
  const totalElements = productsData?.totalElements || 0;

  return (
    <div className="w-full bg-stone-50 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-4 mt-4 mb-8">
          <h2 className="text-3xl font-light text-stone-900">
            {category.name}
          </h2>
          {totalElements > 0 && (
            <p className="text-sm text-stone-500 mt-2 sm:mt-0">
              {totalElements} producto{totalElements !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Paginación */}
            <StorePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isLoading={loadingProducts}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-stone-500">
            <p className="text-lg font-light">Esta categoría está vacía por ahora.</p>
          </div>
        )}
      </div>
    </div>
  );
};