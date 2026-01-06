import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ProductCard } from "../../components/commerce/ProductCard";
import { useCategoryBySlug, useProductsByCategorySlug } from "../../hooks/useCatalog";
import { Breadcrumb } from "../../components/commerce/Breadcrumb";
import type { Category } from "../../types/types";

export const CategoryPage: React.FC = () => {
  // Aseguramos que slug sea string (o undefined)
  const { slug } = useParams<{ slug?: string }>();

  // 1️⃣ Obtener categoría por slug
  const {
    data: category,
    isLoading: loadingCategory,
    error: errorCategory,
  } = useCategoryBySlug(slug || ""); // Evitamos pasar undefined

  // 2️⃣ Obtener productos por slug de categoría (Endpoint recursivo)
  const {
    data: products,
    isLoading: loadingProducts,
    error: errorProducts,
  } = useProductsByCategorySlug(slug || "");

  // ✅ SEO: Cambiar título (Este es el lugar correcto, antes de los returns)
  useEffect(() => {
    if (category && category.name) {
      const prev = document.title;
      document.title = `${category.name} - Pussycat`;

      // Cleanup: restaurar título al salir
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

    // Recorrer hacia atrás hasta la raíz
    while (cur) {
      // ⚠️ CORRECCIÓN AQUÍ: Usamos solo el slug para coincidir con tus rutas
      ancestors.unshift({
        label: cur.name,
        href: `/categoria/${cur.slug}`
      });
      cur = cur.parent;
    }

    return items.concat(ancestors);
  };

  const breadcrumbItems = buildBreadcrumbItems();

  // (Aquí borramos el segundo useEffect duplicado)

  return (
    <div className="w-full bg-stone-50 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        <Breadcrumb items={breadcrumbItems} />

        <h2 className="text-3xl font-light mb-8 text-stone-900 border-b border-stone-200 pb-4 mt-4">
          {category.name}
        </h2>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-stone-500">
            <p className="text-lg font-light">Esta categoría está vacía por ahora.</p>
          </div>
        )}
      </div>
    </div>
  );
};