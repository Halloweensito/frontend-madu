import { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import {
  type ProductFormData,
  type AttributeConfig,
  type ProductVariantRequest,
  type ImageRequest
} from "@/types/types";

import { VariantTable } from "./VariantTable";
import { VariantImageDialog } from "./VariantImageDialog";
import { useVariantLogic } from "@/hooks/useVariantLogic";

interface VariantGeneratorProps {
  config: AttributeConfig[];
  form: UseFormReturn<ProductFormData>;
  defaultPrice: number;
  defaultStock: number;
  existingVariants?: ProductVariantRequest[];
  productId?: number;
  generalImages?: ImageRequest[];
}

export function VariantGenerator(props: VariantGeneratorProps) {
  const {
    variants,
    deletingVariantId,
    updateVariant,
    updateMultipleVariants, // Nueva función para edición masiva
    removeVariant,
    updateVariantImage,
    updateMultipleVariantImages,
    handleInputFocus,
    handleInputBlur
  } = useVariantLogic(props);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingGroupIndices, setEditingGroupIndices] = useState<number[] | null>(null);

  // UX: Loading o vacío
  if (variants.length === 0) {
    if (props.config.length > 0) return (
      <div className="border rounded-md p-4 text-center text-stone-500">
        Generando variantes...
      </div>
    );
    return null;
  }

  return (
    <>
      {/* 1. Tabla de Variantes */}
      <VariantTable
        variants={variants}
        config={props.config}
        generalImages={props.generalImages || []}
        deletingVariantId={deletingVariantId}
        onUpdate={updateVariant}
        onUpdateMultiple={updateMultipleVariants}
        onRemove={removeVariant}
        onManageImage={setEditingIndex}
        onRemoveImage={(idx) => updateVariantImage(idx, undefined)}
        onManageGroupImage={(indices) => setEditingGroupIndices(indices)}
        onRemoveGroupImage={(indices) => updateMultipleVariantImages(indices, undefined)}
        onInputFocus={handleInputFocus}
        onInputBlur={handleInputBlur}
      />

      {/* 2. Modal para variante INDIVIDUAL */}
      {editingIndex !== null && variants[editingIndex] && (
        <VariantImageDialog
          open={editingIndex !== null}
          onOpenChange={(open) => !open && setEditingIndex(null)}
          variantDisplayName={variants[editingIndex].displayName}
          selectedImageUrl={variants[editingIndex].selectedImageUrl}
          generalImages={props.generalImages || []}
          onSelectImage={(url) => {
            updateVariantImage(editingIndex, url);
            setEditingIndex(null);
          }}
        />
      )}

      {/* 3. Modal para GRUPO de variantes */}
      {editingGroupIndices !== null && editingGroupIndices.length > 0 && (
        <VariantImageDialog
          open={true}
          onOpenChange={(open) => !open && setEditingGroupIndices(null)}
          variantDisplayName={`${props.config[0]?.attributeName || 'Grupo'} (${editingGroupIndices.length} variantes)`}
          selectedImageUrl={variants[editingGroupIndices[0]]?.selectedImageUrl}
          generalImages={props.generalImages || []}
          onSelectImage={(url) => {
            updateMultipleVariantImages(editingGroupIndices, url);
            setEditingGroupIndices(null);
          }}
        />
      )}
    </>
  );
}