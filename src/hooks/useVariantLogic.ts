import { useState, useRef, useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import { logger } from "@/utils/logger";
import { useDeleteVariant } from "@/hooks/useCatalog";
import {
  type ProductFormData,
  type AttributeConfig,
  type ProductVariantRequest,
  type ImageRequest,
  type AttributeValue
} from "@/types/types";

// ✅ Exportamos la interfaz para usarla en la Tabla
export interface VariantRow {
  id?: number;
  sku?: string;
  price: number;
  stock: number;
  attributeValueIds: number[];
  displayName: string;
  selectedImageUrl?: string;
  selectedImageTempId?: string;
}

interface UseVariantLogicProps {
  config: AttributeConfig[];
  form: UseFormReturn<ProductFormData>;
  defaultPrice: number;
  defaultStock: number;
  existingVariants?: ProductVariantRequest[];
  productId?: number;
  generalImages?: ImageRequest[];
}

export function useVariantLogic({
  config,
  form,
  defaultPrice,
  defaultStock,
  existingVariants,
  productId,
  generalImages = []
}: UseVariantLogicProps) {
  // --- Estados ---
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [deletingVariantId, setDeletingVariantId] = useState<number | null>(null);

  // --- Refs para control de ciclos ---
  const lastConfigRef = useRef<string | null>(null);
  const hasUsedExistingVariantsRef = useRef(false);
  const lastDefaultPriceRef = useRef<number | null>(null);
  const lastDefaultStockRef = useRef<number | null>(null);
  const isUserEditingRef = useRef(false);
  const shouldSyncAfterDeleteRef = useRef(false);
  const lastVariantsSnapshotRef = useRef<string>("");

  // --- API Mutation ---
  const deleteVariantMutation = useDeleteVariant(productId);

  // --- Helpers Internos ---
  const getValueLabel = (valueId: number): string => {
    for (const attr of config) {
      const value = attr.selectedValues.find(v => v.id === valueId);
      if (value) return value.value || value.slug || `Valor ${value.id}`;
    }
    return "";
  };

  const generateDisplayName = (attributeValueIds: number[]): string => {
    return attributeValueIds.map(id => getValueLabel(id)).filter(Boolean).join(" / ") || "Sin nombre";
  };

  // ✅ Helper de Sincronización
  const syncForm = (currentVariants: VariantRow[]) => {
    const currentConfig = form.getValues("attributesConfig") || [];
    const hasAttributes = currentConfig.length > 0;

    const validVariants = currentVariants.filter(v => {
      const hasValidAttributeIds = v.attributeValueIds && v.attributeValueIds.length > 0;
      if (hasAttributes && !hasValidAttributeIds) return false;
      return true;
    });

    const backendVariants: ProductVariantRequest[] = validVariants.map(v => {
      const isDefaultVariant = !v.attributeValueIds || v.attributeValueIds.length === 0;
      let image: ImageRequest | undefined = undefined;

      if (!isDefaultVariant && v.selectedImageUrl) {
        const generalImage = generalImages.find(img => img.url === v.selectedImageUrl);
        if (generalImage) {
          image = {
            id: generalImage.id,
            url: v.selectedImageUrl,
            position: generalImage.position,
            tempId: generalImage.tempId
          };
        } else {
          image = {
            url: v.selectedImageUrl,
            position: 0,
            tempId: v.selectedImageTempId
          };
        }
      }

      return {
        ...(v.id && { id: v.id }),
        ...(v.sku && v.sku.trim() !== "" && { sku: v.sku }),
        price: v.price || 0,
        stock: v.stock || 0,
        attributeValueIds: v.attributeValueIds || [],
        image,
      };
    });

    form.setValue("variants", backendVariants, { shouldValidate: false, shouldDirty: false, shouldTouch: false });
  };

  // --- EFECTO PRINCIPAL: Generación de Variantes ---
  useEffect(() => {
    const configString = JSON.stringify(config);
    const configChanged = configString !== lastConfigRef.current;

    if (config.length === 0) {
      setVariants([]);
      form.setValue("variants", [], { shouldValidate: false, shouldDirty: false, shouldTouch: false });
      lastConfigRef.current = configString;
      hasUsedExistingVariantsRef.current = false;
      return;
    }

    const hadOnlyDefaultVariant = productId && existingVariants && existingVariants.length > 0 &&
      existingVariants.every(v => !v.attributeValueIds || v.attributeValueIds.length === 0);

    const hasOnlyDefault = productId && existingVariants && existingVariants.length > 0 &&
      existingVariants.every(v => !v.attributeValueIds || v.attributeValueIds.length === 0);

    const nowHasAttributes = config.length > 0;

    if (hadOnlyDefaultVariant && nowHasAttributes) {
      hasUsedExistingVariantsRef.current = true;
      lastConfigRef.current = configString;
    }

    if (productId && existingVariants && existingVariants.length > 0 && !configChanged && !hasUsedExistingVariantsRef.current && !hasOnlyDefault) {
      const currentAttributeValueIds = new Set<number>();
      config.forEach(attr => attr.selectedValues.forEach(val => currentAttributeValueIds.add(val.id)));

      const variantsMatchAttributes = existingVariants.every(v => {
        if (!v.attributeValueIds || v.attributeValueIds.length === 0) return false;
        return v.attributeValueIds.every(id => currentAttributeValueIds.has(id));
      });

      if (variantsMatchAttributes) {
        // ✅ Helper para ordenar valores según la posición del atributo padre
        const getAttributePosition = (valueId: number): number => {
          for (const attr of config) {
            if (attr.selectedValues.some(v => v.id === valueId)) {
              return attr.position ?? 0;
            }
          }
          return 999;
        };

        const existingVariantRows: VariantRow[] = existingVariants.map(v => {
          // Ordenar los IDs de valores según la posición de su atributo
          const sortedAttributeValueIds = [...(v.attributeValueIds || [])].sort((a, b) =>
            getAttributePosition(a) - getAttributePosition(b)
          );

          return {
            id: v.id,
            sku: v.sku,
            price: v.price || 0,
            stock: v.stock || 0,
            attributeValueIds: sortedAttributeValueIds,
            displayName: generateDisplayName(sortedAttributeValueIds),
            selectedImageUrl: v.image ? v.image.url : undefined,
            selectedImageTempId: v.image?.tempId,
          };
        });

        setVariants(existingVariantRows);
        syncForm(existingVariantRows);
        hasUsedExistingVariantsRef.current = true;
        lastConfigRef.current = configString;
        return;
      }
    }

    const isFirstTimeWithAttributes = (!lastConfigRef.current || lastConfigRef.current === "[]" || lastConfigRef.current === "") && config.length > 0;
    const hasAttributesButNoVariants = config.length > 0 && variants.length === 0;

    if (!configChanged && !isFirstTimeWithAttributes && !hasAttributesButNoVariants) {
      lastDefaultPriceRef.current = defaultPrice;
      lastDefaultStockRef.current = defaultStock;
      return;
    }


    hasUsedExistingVariantsRef.current = false;
    lastDefaultPriceRef.current = defaultPrice;
    lastDefaultStockRef.current = defaultStock;
    lastConfigRef.current = configString;

    const sortedConfig = [...config].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)); //

    const generateCombinations = (
      attributes: AttributeConfig[], // Esta función recursiva debe recibir la lista ya ordenada
      index = 0,
      current: any[] = []
    ): any[] => {
      if (index === attributes.length) return [current];
      const attr = attributes[index];

      // Ordenar valores por posición
      const sortedValues = [...attr.selectedValues].sort((a, b) =>
        (a.position ?? 0) - (b.position ?? 0)
      );

      const results: any[] = [];
      for (const val of sortedValues) {
        // IMPORTANTE: Asegúrate de pasar 'attributes' (que será sortedConfig) en la llamada recursiva
        results.push(...generateCombinations(attributes, index + 1, [
          ...current,
          { valueId: val.id, valueLabel: val.value }
        ]));
      }
      return results;
    };

    // Invocar usando la configuración ordenada
    const combinations = generateCombinations(sortedConfig);

    const existingVariantsMap = new Map<string, VariantRow>();
    variants.forEach(variant => {
      if (variant.attributeValueIds && variant.attributeValueIds.length > 0) {
        const key = [...variant.attributeValueIds].sort((a, b) => a - b).join("-");
        existingVariantsMap.set(key, variant);
      }
    });

    if (existingVariants && existingVariants.length > 0) {
      existingVariants.forEach(v => {
        if (v.attributeValueIds && v.attributeValueIds.length > 0) {
          const key = [...v.attributeValueIds].sort((a, b) => a - b).join("-");
          if (!existingVariantsMap.has(key)) {
            existingVariantsMap.set(key, {
              id: v.id,
              sku: v.sku,
              price: v.price || 0,
              stock: v.stock || 0,
              attributeValueIds: v.attributeValueIds,
              displayName: generateDisplayName(v.attributeValueIds),
              selectedImageUrl: v.image ? v.image.url : undefined,
              selectedImageTempId: v.image?.tempId,
            });
          }
        }
      });
    }

    const generatedVariants: VariantRow[] = combinations
      .filter(combo => combo.length === config.length)
      .map((combo) => {
        const attributeValueIds = combo.map((c: { valueId: number }): number => c.valueId);
        const displayName = combo.map((c: { valueLabel: string }): string => c.valueLabel || "").filter(Boolean).join(" / ") || "Sin nombre";
        const key = [...attributeValueIds].sort((a, b) => a - b).join("-");
        const existingVariant = existingVariantsMap.get(key);

        if (existingVariant) {
          return {
            ...existingVariant,
            attributeValueIds,
            displayName,
          };
        }

        // Usar la primera imagen general como default para nuevas variantes
        const defaultImageUrl = generalImages.length > 0 ? generalImages[0].url : undefined;
        const defaultImageTempId = generalImages.length > 0 ? generalImages[0].tempId : undefined;

        return {
          sku: "",
          price: defaultPrice || 0,
          stock: defaultStock || 0,
          attributeValueIds,
          displayName,
          selectedImageUrl: defaultImageUrl,
          selectedImageTempId: defaultImageTempId,
        };
      });

    setVariants(generatedVariants);

    const backendVariants: ProductVariantRequest[] = generatedVariants.map(v => {
      const isDefaultVariant = !v.attributeValueIds || v.attributeValueIds.length === 0;
      let image: ImageRequest | undefined = undefined;

      if (!isDefaultVariant && v.selectedImageUrl) {
        const generalImage = generalImages.find(img => img.url === v.selectedImageUrl);
        if (generalImage) {
          image = {
            id: generalImage.id,
            url: v.selectedImageUrl,
            position: generalImage.position,
            tempId: generalImage.tempId
          };
        } else {
          image = { url: v.selectedImageUrl, position: 0 };
        }
      }

      return {
        ...(v.id && { id: v.id }),
        ...(v.sku && v.sku.trim() !== "" && { sku: v.sku }),
        price: v.price || 0,
        stock: v.stock || 0,
        attributeValueIds: v.attributeValueIds || [],
        image,
      };
    });

    form.setValue("variants", backendVariants, { shouldValidate: false, shouldDirty: false, shouldTouch: false });
    lastConfigRef.current = configString;

  }, [config, defaultPrice, defaultStock, existingVariants, form, productId]);

  // --- Handlers de Usuario ---
  const handleInputFocus = () => {
    isUserEditingRef.current = true;
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      isUserEditingRef.current = false;
    }, 100);
  };

  const updateVariant = (idx: number, field: "sku" | "price" | "stock", value: string | number) => {
    const updated = [...variants];
    const numericValue = field === "sku"
      ? value
      : (typeof value === "number" && !isNaN(value) ? value : (Number(value) || 0));

    updated[idx] = { ...updated[idx], [field]: numericValue };
    setVariants(updated);
    syncForm(updated);
  };


  const updateMultipleVariants = (indices: number[], field: "price" | "stock", value: number) => {
    const updated = [...variants];

    indices.forEach(idx => {
      if (updated[idx]) {
        updated[idx] = { ...updated[idx], [field]: value };
      }
    });

    setVariants(updated);  // ✅ Una sola actualización de estado
    syncForm(updated);
  };


  // 👇 Actualizar imagen de UNA variante
  const updateVariantImage = (idx: number, imageUrl: string | undefined) => {
    const updated = [...variants];

    let selectedImageTempId: string | undefined = undefined;
    if (imageUrl) {
      const image = generalImages.find(img => img.url === imageUrl);
      selectedImageTempId = image?.tempId;
    }

    updated[idx] = {
      ...updated[idx],
      selectedImageUrl: imageUrl,
      selectedImageTempId: selectedImageTempId
    };
    setVariants(updated);
    syncForm(updated);
  };

  // 👇 NUEVO: Actualizar imagen de MÚLTIPLES variantes
  const updateMultipleVariantImages = (indices: number[], imageUrl: string | undefined) => {
    const updated = [...variants];

    let selectedImageTempId: string | undefined = undefined;
    if (imageUrl) {
      const image = generalImages.find(img => img.url === imageUrl);
      selectedImageTempId = image?.tempId;
    }

    indices.forEach(idx => {
      if (updated[idx]) {
        updated[idx] = {
          ...updated[idx],
          selectedImageUrl: imageUrl,
          selectedImageTempId: selectedImageTempId
        };
      }
    });

    setVariants(updated);
    syncForm(updated);
  };

  const removeVariant = async (idx: number) => {
    const variantToRemove = variants[idx];

    if (variantToRemove.id && productId) {
      if (deletingVariantId === variantToRemove.id) return;
      setDeletingVariantId(variantToRemove.id);

      try {
        await deleteVariantMutation.mutateAsync(variantToRemove.id);
        const updated = variants.filter((_, i) => i !== idx);
        setVariants(updated);
        syncForm(updated);
        shouldSyncAfterDeleteRef.current = true;
      } catch (error) {
        logger.error("Error eliminando variante", error);
      } finally {
        setDeletingVariantId(null);
      }
    } else {
      const updated = variants.filter((_, i) => i !== idx);
      setVariants(updated);
      syncForm(updated);
      shouldSyncAfterDeleteRef.current = true;
    }
  };



  // --- EFECTO SECUNDARIO: Sincronización Estilo Shopify ---
  useEffect(() => {
    if (isUserEditingRef.current) return;

    const attributesConfig = form.getValues("attributesConfig") || [];
    if (variants.length === 0) {
      if (shouldSyncAfterDeleteRef.current && attributesConfig.length > 0) {
        form.setValue("attributesConfig", [], { shouldValidate: false, shouldDirty: false, shouldTouch: false });
        lastVariantsSnapshotRef.current = "";
        shouldSyncAfterDeleteRef.current = false;
        hasUsedExistingVariantsRef.current = false;
        return;
      }
      lastVariantsSnapshotRef.current = "";
      return;
    }

    const currentSnapshot = JSON.stringify(variants.map(v => ({
      attributeValueIds: v.attributeValueIds || []
    })));

    if (currentSnapshot === lastVariantsSnapshotRef.current && !shouldSyncAfterDeleteRef.current) {
      shouldSyncAfterDeleteRef.current = false;
      return;
    }

    const usedValueIds = new Set<number>();
    variants.forEach(variant => variant.attributeValueIds?.forEach(id => usedValueIds.add(id)));

    const currentConfig = attributesConfig;
    const syncedConfig: AttributeConfig[] = currentConfig
      .map(attrConfig => {
        const usedValues = attrConfig.selectedValues.filter((val: AttributeValue) => usedValueIds.has(val.id));
        return usedValues.length > 0 ? { ...attrConfig, selectedValues: usedValues } : null;
      })
      .filter((attr): attr is AttributeConfig => attr !== null);

    const configChanged = JSON.stringify(syncedConfig) !== JSON.stringify(currentConfig);

    if (configChanged) {
      form.setValue("attributesConfig", syncedConfig, { shouldValidate: false, shouldDirty: false, shouldTouch: false });
    }

    lastVariantsSnapshotRef.current = currentSnapshot;
    shouldSyncAfterDeleteRef.current = false;
  }, [variants, form]);

  return {
    variants,
    deletingVariantId,
    updateVariant,
    updateMultipleVariants, // Nueva función para edición masiva
    updateVariantImage,
    updateMultipleVariantImages,
    removeVariant,
    handleInputFocus,
    handleInputBlur
  };
}