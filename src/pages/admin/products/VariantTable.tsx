import { useMemo } from "react";
import { type ImageRequest, type AttributeConfig } from "@/types/types";
import { type VariantRow } from "@/hooks/useVariantLogic";
import { logger } from "@/utils/logger";
import { VariantTableMobile, type GroupedVariant } from "./VariantTableMobile";
import { VariantTableDesktop } from "./VariantTableDesktop";

interface VariantTableProps {
  variants: VariantRow[];
  config: AttributeConfig[];
  generalImages: ImageRequest[];
  deletingVariantId: number | null;
  onUpdate: (idx: number, field: "sku" | "price" | "stock", value: string | number) => void;
  onUpdateMultiple: (indices: number[], field: "price" | "stock", value: number) => void;
  onRemove: (idx: number) => void;
  onManageImage: (idx: number) => void;
  onRemoveImage: (idx: number) => void;
  onManageGroupImage: (indices: number[]) => void;
  onRemoveGroupImage: (indices: number[]) => void;
  onInputFocus: () => void;
  onInputBlur: () => void;
}

export function VariantTable({
  variants,
  config,
  generalImages,
  deletingVariantId,
  onUpdate,
  onUpdateMultiple,
  onRemove,
  onManageImage,
  onRemoveImage,
  onManageGroupImage,
  onRemoveGroupImage,
  onInputFocus,
  onInputBlur
}: VariantTableProps) {

  // 1. Lógica de Agrupación (Estilo Shopify)
  const groupedVariants = useMemo<GroupedVariant[] | null>(() => {
    if (config.length < 2 || variants.length === 0) return null;

    // ✅ Encontrar el atributo con position más baja (primer atributo)
    const sortedConfig = [...config].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    const firstAttribute = sortedConfig[0];

    if (!firstAttribute) return null;

    // Crear un Set con todos los IDs de valores del primer atributo para búsqueda rápida
    const firstAttributeValueIds = new Set(firstAttribute.selectedValues.map(v => v.id));

    const groups = new Map<number, GroupedVariant>();

    variants.forEach((variant, index) => {
      // ✅ Encontrar el valor que corresponde al primer atributo (por position)
      const firstAttrValueId = variant.attributeValueIds.find(valueId =>
        firstAttributeValueIds.has(valueId)
      );

      if (!firstAttrValueId) {
        logger.warn(`Variante ${index} no tiene valor para el primer atributo ${firstAttribute.attributeName}`, {
          variantAttributeValueIds: variant.attributeValueIds,
          firstAttributeValueIds: Array.from(firstAttributeValueIds)
        });
        return; // Skip si no tiene valor del primer atributo
      }

      // Helper para obtener etiquetas (duplicado temporalmente aquí o mover a hook)
      const getValueLabel = (valueId: number): string => {
        for (const attr of config) {
          const value = attr.selectedValues.find(v => v.id === valueId);
          if (value) return value.value || value.slug || `Valor ${valueId}`;
        }
        return "";
      };

      if (!groups.has(firstAttrValueId)) {
        groups.set(firstAttrValueId, {
          label: getValueLabel(firstAttrValueId),
          items: [],
          groupImage: undefined
        });
      }

      const group = groups.get(firstAttrValueId)!;
      group.items.push({ ...variant, originalIndex: index });

      // Determinar imagen del grupo
      if (group.items.length === 1) {
        group.groupImage = variant.selectedImageUrl;
      } else if (group.groupImage !== variant.selectedImageUrl) {
        group.groupImage = undefined; // Imágenes mixtas
      }
    });

    const groupsDebug = Array.from(groups.entries()).map(([id, group]) => ({
      valueId: id,
      label: group.label,
      variantCount: group.items.length,
      indices: group.items.map(v => v.originalIndex).join(', ')
    }));

    logger.debug('📊 Grupos generados:', groupsDebug);

    return Array.from(groups.values());
  }, [variants, config]);

  const props = {
    variants,
    groupedVariants,
    config,
    generalImages,
    deletingVariantId,
    onUpdate,
    onUpdateMultiple,
    onRemove,
    onManageImage,
    onRemoveImage,
    onManageGroupImage,
    onRemoveGroupImage,
    onInputFocus,
    onInputBlur
  };

  return (
    <>
      <VariantTableMobile {...props} />
      <VariantTableDesktop {...props} />
    </>
  );
}