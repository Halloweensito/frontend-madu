import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { ProductResponse, AttributeValueResponse } from "../types/types";

export const useProductVariants = (product: ProductResponse | undefined) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1️⃣ Obtener atributos únicos del producto
  const allAttributes = useMemo(() => {
    if (!product) return [];

    const map = new Map<number, string>();

    product.variants.forEach(variant =>
      (variant.attributeValues || []).forEach(attrValue => {
        map.set(attrValue.attribute.id, attrValue.attribute.name);
      })
    );

    return Array.from(map.entries()).map(([attributeId, name]) => ({
      attributeId,
      name,
    }));
  }, [product]);

  // 2️⃣ Atributos seleccionados (attributeId -> attributeValueId)
  const selectedAttributes = useMemo(() => {
    const result: Record<number, number> = {};

    allAttributes.forEach(attr => {
      const valueId = searchParams.get(String(attr.attributeId));
      if (valueId) result[attr.attributeId] = Number(valueId);
    });

    return result;
  }, [searchParams, allAttributes]);

  // 3️⃣ Sincronizar URL inicial con la primera variante
  useEffect(() => {
    if (!product || !product.variants || product.variants.length === 0) return;

    const firstVariant = product.variants[0];
    if (!firstVariant) return;

    // Verificar si ya hay parámetros en la URL
    const hasUrlParams = allAttributes.some(attr =>
      searchParams.has(String(attr.attributeId))
    );

    // Si ya hay parámetros, no hacer nada
    if (hasUrlParams) return;

    const variantAttributes = firstVariant.attributeValues || [];

    // ✅ CASO 1: Variante por defecto (sin atributos configurados)
    // No necesitamos sincronizar nada en la URL, el hook ya lo maneja correctamente
    if (variantAttributes.length === 0) {
      // La variante se seleccionará automáticamente en selectedVariant
      return;
    }

    // ✅ CASO 2: Variante con atributos - sincronizar URL
    const params = new URLSearchParams();
    variantAttributes.forEach(attrValue => {
      params.set(String(attrValue.attribute.id), String(attrValue.id));
    });

    setSearchParams(params, { replace: true });
  }, [product, allAttributes, searchParams, setSearchParams]);

  // 4️⃣ Variante seleccionada
  const selectedVariant = useMemo(() => {
    if (!product) return null;

    // Buscar variante que coincida con los atributos seleccionados
    const foundVariant = product.variants.find(variant => {
      const values = variant.attributeValues || [];

      // ✅ CASO ESPECIAL: Variante por defecto (sin atributos)
      // Si no hay atributos seleccionados Y la variante no tiene attributeValues
      if (Object.keys(selectedAttributes).length === 0 && values.length === 0) {
        return true;
      }

      // Variante con atributos: todos deben coincidir
      if (values.length === 0) return false;

      return values.every(
        attrValue => selectedAttributes[attrValue.attribute.id] === attrValue.id
      );
    });

    // Si encontramos una variante la retornamos
    if (foundVariant) {
      return foundVariant;
    }

    // Fallback: primera variante disponible
    return product.variants[0] || null;
  }, [product, selectedAttributes]);

  // 5️⃣ Verificar disponibilidad de un valor de atributo
  const isAttributeValueAvailable = (
    attributeId: number,
    attributeValueId: number
  ) => {
    if (!product) return false;

    return product.variants.some(variant =>
      variant.attributeValues?.some(
        attrValue =>
          attrValue.attribute.id === attributeId &&
          attrValue.id === attributeValueId
      )
    );
  };

  // 6️⃣ Obtener valores únicos de un atributo específico
  const getUniqueAttributeValues = (attributeId: number): AttributeValueResponse[] => {
    if (!product) return [];

    const valuesMap = new Map<number, AttributeValueResponse>();

    product.variants.forEach(variant =>
      variant.attributeValues?.forEach(attrValue => {
        if (attrValue.attribute.id === attributeId) {
          valuesMap.set(attrValue.id, attrValue);
        }
      })
    );

    return Array.from(valuesMap.values());
  };

  // 7️⃣ Seleccionar un valor de atributo (actualiza URL)
  const handleAttributeSelect = (attributeId: number, attributeValueId: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(String(attributeId), String(attributeValueId));
    setSearchParams(params, { replace: true });
  };

  // 8️⃣ Verificar si la variante seleccionada está disponible
  const isSelectedVariantAvailable = useMemo(() => {
    if (!selectedVariant) return false;
    return (selectedVariant.stock ?? 0) > 0;
  }, [selectedVariant]);

  // 9️⃣ Obtener combinaciones disponibles
  const getAvailableCombinations = useMemo(() => {
    if (!product) return [];

    return product.variants
      .filter(v => (v.stock ?? 0) > 0)
      .map(v => ({
        variantId: v.id,
        sku: v.sku,
        price: v.price,
        stock: v.stock,
        attributes: (v.attributeValues || []).reduce((acc, attrValue) => {
          acc[attrValue.attribute.id] = attrValue.id;
          return acc;
        }, {} as Record<number, number>)
      }));
  }, [product]);

  return {
    allAttributes,
    selectedAttributes,
    selectedVariant,
    isAttributeValueAvailable,
    getUniqueAttributeValues,
    handleAttributeSelect,
    isSelectedVariantAvailable,
    getAvailableCombinations,
  };
};