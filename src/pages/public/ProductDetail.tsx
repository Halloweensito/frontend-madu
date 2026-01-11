import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useProductBySlug } from '@/hooks/useCatalog';
import { useProductVariants } from '@/hooks/useProductVariants';
import { Breadcrumb } from '@/components/commerce/Breadcrumb';
import { ProductImageGallery } from '@/components/commerce/ProductImageGallery';
import { ProductInfo } from '@/components/commerce/ProductInfo';
import { ProductAttributeSelector } from '@/components/commerce/ProductAttributeSelector.tsx';
import { ProductPurchaseButton } from '@/components/commerce/ProductPurchaseButton';
import { ProductSpecifications } from '@/components/commerce/ProductSpecifications';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProductBySlug(slug);
  
  const {
    allAttributes,
    selectedAttributes,
    selectedVariant,
    isAttributeValueAvailable,
    getUniqueAttributeValues,
    handleAttributeSelect,
  } = useProductVariants(product);

  // --- LOADING & ERROR STATES ---
  
  if (!slug) {
    return <Navigate to="/404" replace />;
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-stone-400" size={40} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-light text-stone-300 mb-4">404</h1>
          <p className="text-stone-600 mb-6">Producto no encontrado</p>
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 border border-stone-900 px-6 py-3 text-sm uppercase tracking-wider hover:bg-stone-900 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  // --- DATOS PARA RENDERIZAR ---

  const breadcrumbItems = [
    { label: 'Productos', href: '/productos' },
    ...(product.category?.name 
      ? [{ 
          label: product.category.name, 
          href: `/categoria/${product.category.slug}` 
        }] 
      : []
    ),
    { label: product.name },
  ];

  // --- RENDER ---

  return (
    <div className="w-full bg-stone-50 min-h-screen py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 mt-6">
          
          {/* COLUMNA IZQUIERDA: Galería */}
          <ProductImageGallery 
            variant={selectedVariant} 
            productName={product.name}
          />

          {/* COLUMNA DERECHA: Información */}
          <div className="flex flex-col space-y-8">
            
            <ProductInfo product={product} variant={selectedVariant} />

            {/* Selectores de Atributos */}
            {allAttributes.length > 0 && (
              <div className="space-y-6">
                {allAttributes.map((attr) => {
                  const values = getUniqueAttributeValues(attr.attributeId);
                  const currentValueId = selectedAttributes[attr.attributeId];
                  const currentValue = values.find(v => v.id === currentValueId);

                  return (
                    <ProductAttributeSelector
                      key={attr.attributeId}
                      attributeKey={attr.name}
                      values={values.map(v => v.value)}
                      currentValue={currentValue?.value}
                      isAvailable={(value: string) => {
                        const attrValue = values.find(v => v.value === value);
                        return attrValue ? isAttributeValueAvailable(attr.attributeId, attrValue.id) : false;
                      }}
                      onSelect={(value: string) => {
                        const attrValue = values.find(v => v.value === value);
                        if (attrValue) handleAttributeSelect(attr.attributeId, attrValue.id);
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Botón de Compra */}
            <ProductPurchaseButton product={product} variant={selectedVariant} />

            {/* Especificaciones */}
            <ProductSpecifications variant={selectedVariant} />
          </div>
        </div>
      </div>
    </div>
  );
};
