// components/AttributeCard.tsx
import { Edit2, Check, Trash2, X, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { AttributeConfig } from "@/types/types";

interface AttributeCardProps {
  attribute: AttributeConfig;
  index: number;
  isEditing: boolean;
  editingValueInput: string;
  onEditingValueInputChange: (value: string) => void;
  onToggleEditMode: (attributeId: number) => void;
  onRemoveAttribute: (index: number) => void;
  onRemoveValue: (attrIndex: number, valueId: number) => void;
  onAddValueToExisting: (attributeId: number) => void;
  isAddingValue: boolean;
}

export function AttributeCard({
  attribute,
  index,
  isEditing,
  editingValueInput,
  onEditingValueInputChange,
  onToggleEditMode,
  onRemoveAttribute,
  onRemoveValue,
  onAddValueToExisting,
  isAddingValue,
}: AttributeCardProps) {
  const isGlobalAttribute = attribute.attributeId > 0;

  return (
    <Card>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">
              {attribute.attributeName || `Opcion ${attribute.attributeId}`}
            </span>
            {isGlobalAttribute ? (
              <Badge variant="secondary" className="text-xs" title="Reutilizable en otros productos">
                Reutilizable
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs" title="Solo disponible en este producto">
                Solo este producto
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            {isGlobalAttribute && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onToggleEditMode(attribute.attributeId)}
                title={isEditing ? "Guardar cambios" : "Editar valores"}
              >
                {isEditing ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Edit2 className="h-4 w-4 text-blue-600" />
                )}
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onRemoveAttribute(index)}
              title="Eliminar opción"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>

        {/* Values */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {attribute.selectedValues.map((v, valueIndex) => {
            const displayValue = v.value || v.slug || `Valor ${v.id}`;

            return (
              <Badge
                key={`${attribute.attributeId}-${v.id}-${valueIndex}`}
                variant="outline"
                className="text-xs group relative"
                style={v.hexColor ? {
                  backgroundColor: v.hexColor + '20',
                  borderColor: v.hexColor
                } : undefined}
              >
                {v.hexColor && (
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-1.5 border"
                    style={{ backgroundColor: v.hexColor }}
                  />
                )}
                {displayValue}
                {isEditing && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemoveValue(index, v.id);
                    }}
                    className="ml-1.5 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Quitar valor"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            );
          })}
        </div>

        {/* Add Value Form */}
        {isEditing && isGlobalAttribute && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-stone-200">
            <Input
              placeholder="Nuevo valor (ej: Rojo, M, 500ml)"
              value={editingValueInput}
              onChange={(e) => onEditingValueInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddValueToExisting(attribute.attributeId);
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              size="sm"
              onClick={() => onAddValueToExisting(attribute.attributeId)}
              disabled={!editingValueInput.trim() || isAddingValue}
            >
              {isAddingValue ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}