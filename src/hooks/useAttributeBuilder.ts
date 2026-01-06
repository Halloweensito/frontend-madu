// hooks/useAttributeBuilder.ts
import { useState, useRef, useEffect } from "react";
import { type Attribute, type AttributeConfig } from "@/types/types";
import { useCreateAttribute, useCreateAttributeValue, useAttributes } from "@/hooks/useCatalog";
import { logger } from "@/utils/logger";

interface TempValue {
  id: number;
  value: string;
  slug: string;
  hexColor?: string;
  position?: number;
}

interface UseAttributeBuilderProps {
  globalAttributes: Attribute[];
  currentAttributes: AttributeConfig[];
  onAttributesChange: (attrs: AttributeConfig[]) => void;
}

export function useAttributeBuilder({
  globalAttributes,
  currentAttributes,
  onAttributesChange,
}: UseAttributeBuilderProps) {
  
  // ==================== Estado ====================
  const [isAdding, setIsAdding] = useState(false);
  const [editingAttributeId, setEditingAttributeId] = useState<number | null>(null);
  const [editingValueInput, setEditingValueInput] = useState("");
  const [selectedGlobalId, setSelectedGlobalId] = useState<string>("");
  const [customName, setCustomName] = useState("");
  const [currentValueInput, setCurrentValueInput] = useState("");
  const [currentValues, setCurrentValues] = useState<TempValue[]>([]);
  
  const pendingEditAttributeIdRef = useRef<number | null>(null);

  // ==================== Mutations ====================
  const createAttributeMutation = useCreateAttribute();
  const createAttributeValueMutation = useCreateAttributeValue();
  const { data: updatedAttributes, refetch: refetchAttributes } = useAttributes();

  // ==================== Computed ====================
  const effectiveAttributes = updatedAttributes && updatedAttributes.length > 0 ? updatedAttributes : globalAttributes;
  const isCustomMode = selectedGlobalId === "new_custom";
  const selectedGlobalAttribute = effectiveAttributes.find(a => a.id.toString() === selectedGlobalId);
  const selectAttributes = effectiveAttributes?.filter(attr => attr.type === "SELECT");

  // ==================== Helpers ====================
  const generateSlug = (value: string): string => {
    return value
      .toLowerCase()
      .normalize("NFD")     
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, '-');
  };

  const isAttributeAlreadyUsed = (attributeId: number) => {
    return currentAttributes.some(attr => attr.attributeId === attributeId);
  };

  const createAttributeValuesInParallel = async (
    attributeId: number,
    values: TempValue[]
  ): Promise<Array<{ id: number; value: string; slug: string; hexColor?: string; position?: number }>> => {
    const promises = values.map(async (tempValue) => {
      if (!tempValue.value || tempValue.value.trim() === "") {
        logger.warn(`Valor inválido omitido:`, tempValue);
        return null;
      }

      try {
        const createdValue = await createAttributeValueMutation.mutateAsync({
          attributeId,
          data: {
            value: tempValue.value.trim(),
            slug: tempValue.slug || generateSlug(tempValue.value),
            hexColor: tempValue.hexColor,
          },
        });
        
        return {
          id: createdValue.id,
          value: createdValue.value || createdValue.slug || tempValue.value.trim(),
          slug: createdValue.slug,
          hexColor: createdValue.hexColor,
          position: createdValue.position,
        };
      } catch (error) {
        logger.error(`Error al crear valor "${tempValue.value}":`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter((result): result is NonNullable<typeof result> => result !== null);
  };

  const resetForm = () => {
    setIsAdding(false);
    setSelectedGlobalId("");
    setCustomName("");
    setCurrentValues([]);
    setCurrentValueInput("");
  };

  // ==================== Handlers - Agregar Valores ====================
  const handleAddValue = (e?: React.KeyboardEvent) => {
    if (e && e.key !== "Enter") return;
    e?.preventDefault();

    const valTrimmed = currentValueInput.trim();
    if (!valTrimmed) return;

    if (currentValues.some(v => v.value.toLowerCase() === valTrimmed.toLowerCase())) {
      return;
    }

    if (selectedGlobalAttribute) {
      const foundValue = selectedGlobalAttribute.values.find(
        v => v.value.toLowerCase() === valTrimmed.toLowerCase()
      );

      if (foundValue) {
        const value = foundValue.value || foundValue.slug || `Valor ${foundValue.id}`;
        setCurrentValues([...currentValues, {
          id: foundValue.id,
          value,
          slug: foundValue.slug || generateSlug(value),
          hexColor: foundValue.hexColor
        }]);
      } else {
        setCurrentValues([...currentValues, {
          id: -Date.now(),
          value: valTrimmed,
          slug: generateSlug(valTrimmed)
        }]);
      }
    } else if (isCustomMode) {
      setCurrentValues([...currentValues, {
        id: -Date.now(),
        value: valTrimmed,
        slug: generateSlug(valTrimmed)
      }]);
    }

    setCurrentValueInput("");
  };

  const removeValue = (valueId: number) => {
    setCurrentValues(currentValues.filter(v => v.id !== valueId));
  };

  // ==================== Handlers - Guardar ====================
  const handleSave = async () => {
    let finalName = "";
    let finalId: number | undefined = undefined;

    if (isCustomMode) {
      finalName = customName.trim();
      if (!finalName) {
        alert("Por favor ingresa un nombre para el atributo personalizado");
        return;
      }
    } else if (selectedGlobalAttribute) {
      if (isAttributeAlreadyUsed(selectedGlobalAttribute.id)) {
        alert(`El atributo "${selectedGlobalAttribute.name}" ya está siendo usado`);
        return;
      }
      finalName = selectedGlobalAttribute.name || `Atributo ${selectedGlobalAttribute.id}`;
      finalId = selectedGlobalAttribute.id;
    } else {
      alert("Selecciona un tipo de atributo");
      return;
    }

    if (currentValues.length === 0) {
      alert("Agrega al menos un valor");
      return;
    }

    try {
      if (isCustomMode) {
        // Crear atributo personalizado
        const attributeSlug = generateSlug(finalName);
        const newAttribute = await createAttributeMutation.mutateAsync({
          name: finalName,
          slug: attributeSlug,
          type: "SELECT",
        });

        finalId = newAttribute.id;
        finalName = newAttribute.name || finalName;

        const createdValues = await createAttributeValuesInParallel(finalId, currentValues);

        if (createdValues.length === 0) {
          alert("Error: No se pudieron crear los valores del atributo.");
          return;
        }

        const newConfig: AttributeConfig = {
          attributeId: finalId,
          attributeName: finalName,
          position: currentAttributes.length, // 👈 Posición al final
          selectedValues: createdValues,
        };

        onAttributesChange([...currentAttributes, newConfig]);
        resetForm();
        await refetchAttributes();
      } else {
        // Atributo global
        const existingValues: TempValue[] = [];
        const newValues: TempValue[] = [];

        currentValues.forEach(v => {
          if (v.id > 0) {
            existingValues.push(v);
          } else {
            newValues.push(v);
          }
        });

        let allValues = existingValues
          .filter(v => (v.value && v.value.trim() !== "") || (v.slug && v.slug.trim() !== ""))
          .map(v => ({
            id: v.id,
            value: v.value || v.slug || `Valor ${v.id}`,
            slug: v.slug || v.value?.toLowerCase().replace(/\s+/g, '-') || `valor-${v.id}`,
            hexColor: v.hexColor,
            position: v.position ?? 0,
          }));

        if (newValues.length > 0) {
          const createdValues = await createAttributeValuesInParallel(finalId!, newValues);
          if (createdValues.length === 0 && newValues.length > 0) {
            alert("Error: No se pudieron crear los valores nuevos.");
            return;
          }
          allValues = [...allValues, ...createdValues.map(v => ({ ...v, position: v.position ?? 0, hexColor: v.hexColor ?? undefined }))];
          await refetchAttributes();
        }

        const newConfig: AttributeConfig = {
          attributeId: finalId!,
          attributeName: finalName,
          position: selectedGlobalAttribute?.position ?? currentAttributes.length,
          selectedValues: allValues,
        };

        onAttributesChange([...currentAttributes, newConfig]);
        resetForm();
      }
    } catch (error) {
      console.error("Error al guardar atributo:", error);
      alert("Error al guardar el atributo. Por favor, intenta de nuevo.");
    }
  };

  // ==================== Handlers - Edición ====================
  const handleAddValueToExisting = async (attributeId: number) => {
    const valTrimmed = editingValueInput.trim();
    if (!valTrimmed) return;

    const attrIndex = currentAttributes.findIndex(attr => attr.attributeId === attributeId);
    if (attrIndex === -1) return;

    const attr = currentAttributes[attrIndex];
    const globalAttr = effectiveAttributes?.find(a => a.id === attr.attributeId);

    if (attr.selectedValues.some(v => v.value.toLowerCase() === valTrimmed.toLowerCase())) {
      alert("Este valor ya está agregado");
      return;
    }

    const wasEditing = editingAttributeId === attributeId;
    if (wasEditing) {
      pendingEditAttributeIdRef.current = attributeId;
    }

    try {
      if (globalAttr) {
        const existingValue = globalAttr.values.find(
          v => v.value.toLowerCase() === valTrimmed.toLowerCase()
        );

        if (existingValue) {
          const updatedAttributes = [...currentAttributes];
          updatedAttributes[attrIndex] = {
            ...attr,
            selectedValues: [
              ...attr.selectedValues,
              {
                id: existingValue.id,
                value: existingValue.value || existingValue.slug || valTrimmed,
                slug: existingValue.slug,
                hexColor: existingValue.hexColor,
                position: existingValue.position,
              }
            ]
          };
          onAttributesChange(updatedAttributes);
          setEditingValueInput("");
        } else {
          const createdValue = await createAttributeValueMutation.mutateAsync({
            attributeId: attr.attributeId,
            data: {
              value: valTrimmed,
              slug: generateSlug(valTrimmed),
            },
          });

          const updatedAttributes = [...currentAttributes];
          updatedAttributes[attrIndex] = {
            ...attr,
            selectedValues: [
              ...attr.selectedValues,
              {
                id: createdValue.id,
                value: createdValue.value || createdValue.slug || valTrimmed,
                slug: createdValue.slug,
                hexColor: createdValue.hexColor,
                position: createdValue.position,
              }
            ]
          };
          onAttributesChange(updatedAttributes);
          setEditingValueInput("");
          await refetchAttributes();
        }
      }
    } catch (error) {
      console.error("Error al agregar valor:", error);
      alert("Error al agregar el valor.");
    }
  };

  const handleRemoveValue = (attrIndex: number, valueId: number) => {
    const attr = currentAttributes[attrIndex];
    
    if (attr.selectedValues.length <= 1) {
      if (editingAttributeId === attr.attributeId) {
        setEditingAttributeId(null);
        setEditingValueInput("");
      }
      removeAttribute(attrIndex);
      return;
    }

    const wasEditing = editingAttributeId === attr.attributeId;
    if (wasEditing) {
      pendingEditAttributeIdRef.current = attr.attributeId;
    }

    const updatedAttributes = [...currentAttributes];
    updatedAttributes[attrIndex] = {
      ...attr,
      selectedValues: attr.selectedValues.filter(v => v.id !== valueId)
    };
    
    onAttributesChange(updatedAttributes);
  };

  const removeAttribute = (index: number) => {
    const attrToRemove = currentAttributes[index];
    
    if (attrToRemove && editingAttributeId === attrToRemove.attributeId) {
      setEditingAttributeId(null);
      setEditingValueInput("");
    }
    
    if (attrToRemove && pendingEditAttributeIdRef.current === attrToRemove.attributeId) {
      pendingEditAttributeIdRef.current = null;
    }
    
    const next = [...currentAttributes];
    next.splice(index, 1);
    onAttributesChange(next);
  };

  const toggleEditMode = (attributeId: number) => {
    if (editingAttributeId === attributeId) {
      setEditingAttributeId(null);
      setEditingValueInput("");
      pendingEditAttributeIdRef.current = null;
    } else {
      setEditingAttributeId(attributeId);
      setEditingValueInput("");
      pendingEditAttributeIdRef.current = null;
    }
  };

  // ==================== Effects ====================
  useEffect(() => {
    if (pendingEditAttributeIdRef.current !== null) {
      const targetAttributeId = pendingEditAttributeIdRef.current;
      const attributeExists = currentAttributes.some(attr => attr.attributeId === targetAttributeId);
      
      if (attributeExists) {
        setEditingAttributeId(targetAttributeId);
        setEditingValueInput("");
      } else {
        setEditingAttributeId(null);
      }
      pendingEditAttributeIdRef.current = null;
    }
  }, [currentAttributes]);

  return {
    // Estado
    isAdding,
    setIsAdding,
    editingAttributeId,
    editingValueInput,
    setEditingValueInput,
    selectedGlobalId,
    setSelectedGlobalId,
    customName,
    setCustomName,
    currentValueInput,
    setCurrentValueInput,
    currentValues,
    
    // Computed
    effectiveAttributes,
    isCustomMode,
    selectedGlobalAttribute,
    selectAttributes,
    
    // Mutations
    createAttributeMutation,
    createAttributeValueMutation,
    
    // Handlers
    handleAddValue,
    removeValue,
    handleSave,
    resetForm,
    handleAddValueToExisting,
    handleRemoveValue,
    removeAttribute,
    toggleEditMode,
    isAttributeAlreadyUsed,
  };
}