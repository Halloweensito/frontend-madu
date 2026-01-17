// pages/admin/products/AttributeBuilder.tsx - REFACTORIZADO
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Attribute, type AttributeConfig } from "@/types/types";
import { useAttributeBuilder } from "@/hooks/useAttributeBuilder";
import { AttributeCard } from "@/pages/admin/products/components/AttributeCard";
import { AttributeForm } from "@/pages/admin/products/components/AttributeForm";

interface AttributeBuilderProps {
  globalAttributes: Attribute[];
  currentAttributes: AttributeConfig[];
  onAttributesChange: (attrs: AttributeConfig[]) => void;
}

export function AttributeBuilder({
  globalAttributes,
  currentAttributes,
  onAttributesChange
}: AttributeBuilderProps) {

  const {
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
  } = useAttributeBuilder({
    globalAttributes,
    currentAttributes,
    onAttributesChange,
  });

  const isSaving = createAttributeMutation.isPending || createAttributeValueMutation.isPending;

  return (
    <div className="space-y-4">
      {/* Lista de Atributos Configurados */}
      {currentAttributes.map((attr, idx) => (
        <AttributeCard
          key={`${attr.attributeId}-${idx}`}
          attribute={attr}
          index={idx}
          isEditing={editingAttributeId === attr.attributeId}
          editingValueInput={editingValueInput}
          onEditingValueInputChange={setEditingValueInput}
          onToggleEditMode={toggleEditMode}
          onRemoveAttribute={removeAttribute}
          onRemoveValue={handleRemoveValue}
          onAddValueToExisting={handleAddValueToExisting}
          isAddingValue={createAttributeValueMutation.isPending}
        />
      ))}

      {/* Botón o Formulario de Adición */}
      {!isAdding ? (
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Opción (Color, Talla, etc.)
        </Button>
      ) : (
        <AttributeForm
          selectAttributes={selectAttributes}
          selectedGlobalId={selectedGlobalId}
          onSelectedGlobalIdChange={setSelectedGlobalId}
          customName={customName}
          onCustomNameChange={setCustomName}
          currentValueInput={currentValueInput}
          onCurrentValueInputChange={setCurrentValueInput}
          currentValues={currentValues}
          onAddValue={handleAddValue}
          onRemoveValue={removeValue}
          onSave={handleSave}
          onCancel={resetForm}
          isAttributeAlreadyUsed={isAttributeAlreadyUsed}
          isSaving={isSaving}
          isCustomMode={isCustomMode}
          selectedGlobalAttribute={selectedGlobalAttribute}
        />
      )}
    </div>
  );
}