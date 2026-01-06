// ProductCreate.tsx
// Main component for creating and editing products
// Refactored to use custom hook and section components

import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { useProductForm } from "./hooks/useProductForm";
import {
  ProductBasicInfoSection,
  ProductPricingSection,
  ProductVariantsSection,
} from "./components";

export default function CreateProduct() {
  const {
    form,
    isEditMode,
    productId,
    categories,
    isLoadingCategories,
    categoriesError,
    globalAttributes,
    isLoadingAttributes,
    attributesError,
    isLoadingProduct,
    productError,
    attributesConfig,
    defaultPrice,
    defaultStock,
    initialVariants,
    isSubmitting,
    imageUploadRef,
    onSubmit,
    getGeneralImages,
    handleFormKeyDown,
    navigateBack,
  } = useProductForm();

  // --- Loading State ---
  if (isEditMode && isLoadingProduct) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // --- Error State ---
  if (isEditMode && productError) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-destructive">
        <AlertCircle className="h-10 w-10" />
        <p>Error al cargar el producto</p>
        <Button
          type="button"
          variant="outline"
          onClick={navigateBack}
        >
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={navigateBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            {isEditMode ? "Editar Producto" : "Crear Producto"}
          </h1>
          <p className="text-stone-500">
            {isEditMode
              ? "Modifica la información del producto y sus variantes"
              : "Completa la información del producto y sus variantes"
            }
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={handleFormKeyDown} className="space-y-6">

          {/* Section 1: Basic Info */}
          <ProductBasicInfoSection
            control={form.control}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            categoriesError={categoriesError}
            imageUploadRef={imageUploadRef}
            isSubmitting={isSubmitting}
          />

          {/* Section 2: Pricing & Status */}
          <ProductPricingSection
            control={form.control}
            hidePricing={attributesConfig && attributesConfig.length > 0}
          />

          {/* Section 3: Variants */}
          <ProductVariantsSection
            form={form}
            globalAttributes={globalAttributes}
            isLoadingAttributes={isLoadingAttributes}
            attributesError={attributesError}
            attributesConfig={attributesConfig}
            defaultPrice={defaultPrice}
            defaultStock={defaultStock}
            initialVariants={initialVariants}
            productId={productId}
            generalImages={getGeneralImages()}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={navigateBack}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Guardar Cambios" : "Crear Producto"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}