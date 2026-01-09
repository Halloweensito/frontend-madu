// components/AttributeForm.tsx
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { Attribute } from "@/types/types";

interface TempValue {
  id: number;
  value: string;
  slug: string;
  hexColor?: string;
}

interface AttributeFormProps {
  selectAttributes: Attribute[];
  selectedGlobalId: string;
  onSelectedGlobalIdChange: (value: string) => void;
  customName: string;
  onCustomNameChange: (value: string) => void;
  currentValueInput: string;
  onCurrentValueInputChange: (value: string) => void;
  currentValues: TempValue[];
  onAddValue: (e?: React.KeyboardEvent) => void;
  onRemoveValue: (valueId: number) => void;
  onSave: () => void;
  onCancel: () => void;
  isAttributeAlreadyUsed: (attributeId: number) => boolean;
  isSaving: boolean;
  isCustomMode: boolean;
  selectedGlobalAttribute: Attribute | undefined;
}

export function AttributeForm({
  selectAttributes,
  selectedGlobalId,
  onSelectedGlobalIdChange,
  customName,
  onCustomNameChange,
  currentValueInput,
  onCurrentValueInputChange,
  currentValues,
  onAddValue,
  onRemoveValue,
  onSave,
  onCancel,
  isAttributeAlreadyUsed,
  isSaving,
  isCustomMode,
  selectedGlobalAttribute,
}: AttributeFormProps) {
  return (
    <Card className="bg-stone-50 border-2 border-dashed">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-sm">Configurar Atributo</h4>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Attribute Selector */}
          <div className="space-y-2">
            <Label>Tipo de Atributo</Label>
            <Select value={selectedGlobalId} onValueChange={onSelectedGlobalIdChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_custom" className="font-medium">
                  ✨ Crear Atributo Personalizado
                </SelectItem>
                {selectAttributes.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-medium text-stone-500">
                      Atributos Globales
                    </div>
                    {selectAttributes.map(attr => (
                      <SelectItem
                        key={attr.id}
                        value={attr.id.toString()}
                        disabled={isAttributeAlreadyUsed(attr.id)}
                      >
                        {attr.name}
                        {isAttributeAlreadyUsed(attr.id) && " (ya usado)"}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>

            {/* Custom Name Input */}
            {isCustomMode && (
              <Input
                placeholder="Ej: Material, Estilo..."
                value={customName}
                onChange={e => onCustomNameChange(e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          {/* Values Input */}
          {(selectedGlobalId || isCustomMode) && (
            <div className="space-y-2">
              <Label>Valores</Label>
              <div className="flex gap-2">
                <Input
                  placeholder={
                    selectedGlobalAttribute
                      ? "Escribe un valor..."
                      : "Escribe valores..."
                  }
                  value={currentValueInput}
                  onChange={e => onCurrentValueInputChange(e.target.value)}
                  onKeyDown={onAddValue}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onAddValue()}
                  disabled={!currentValueInput.trim()}
                  className="shrink-0"
                >
                  Agregar
                </Button>
              </div>

              {/* Current Values */}
              {currentValues.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-white rounded-md border">
                  {currentValues.map((v, index) => (
                    <Badge
                      key={`temp-${v.id}-${index}`}
                      variant="secondary"
                      className="gap-1.5"
                      style={v.hexColor ? {
                        backgroundColor: v.hexColor + '20',
                        borderColor: v.hexColor
                      } : undefined}
                    >
                      {v.hexColor && (
                        <span
                          className="inline-block w-3 h-3 rounded-full border"
                          style={{ backgroundColor: v.hexColor }}
                        />
                      )}
                      {v.value}
                      <button
                        type="button"
                        onClick={() => onRemoveValue(v.id)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        <Button
          type="button"
          className="w-full"
          onClick={onSave}
          disabled={currentValues.length === 0 || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando...
            </>
          ) : (
            "Guardar Atributo"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}