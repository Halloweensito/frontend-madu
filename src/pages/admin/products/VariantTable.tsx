import { useMemo, Fragment, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash2, Edit2, Loader2, Image as ImageIcon, Layers, ChevronDown, ChevronRight, Images } from "lucide-react";
import { type ImageRequest, type AttributeConfig } from "@/types/types";
import { type VariantRow } from "@/hooks/useVariantLogic";
import { logger } from "@/utils/logger";

interface VariantTableProps {
  variants: VariantRow[];
  config: AttributeConfig[];
  generalImages: ImageRequest[];
  deletingVariantId: number | null;
  onUpdate: (idx: number, field: "sku" | "price" | "stock", value: string | number) => void;
  onUpdateMultiple: (indices: number[], field: "price" | "stock", value: number) => void; // ✅ Nueva prop
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

  // Estado para grupos expandidos (por defecto colapsados)
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());



  // Toggle collapse/expand
  const toggleGroup = (groupIndex: number) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupIndex)) {
        next.delete(groupIndex);
      } else {
        next.add(groupIndex);
      }
      return next;
    });
  };

  // Expand/collapse all
  const expandAll = () => {
    if (groupedVariants) {
      setExpandedGroups(new Set(groupedVariants.map((_, idx) => idx)));
    }
  };
  const collapseAll = () => setExpandedGroups(new Set());

  // 1. Helper para obtener etiquetas
  const getValueLabel = (valueId: number): string => {
    for (const attr of config) {
      const value = attr.selectedValues.find(v => v.id === valueId);
      if (value) return value.value || value.slug || `Valor ${valueId}`;
    }
    return "";
  };

  // 2. Lógica de Agrupación (Estilo Shopify)
  const groupedVariants = useMemo(() => {
    if (config.length < 2 || variants.length === 0) return null;

    // ✅ Encontrar el atributo con position más baja (primer atributo)
    const sortedConfig = [...config].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    const firstAttribute = sortedConfig[0];

    if (!firstAttribute) return null;

    // Crear un Set con todos los IDs de valores del primer atributo para búsqueda rápida
    const firstAttributeValueIds = new Set(firstAttribute.selectedValues.map(v => v.id));

    const groups = new Map<number, {
      label: string;
      items: Array<VariantRow & { originalIndex: number }>;
      groupImage?: string;
    }>();

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

    // Logging mejorado para debugging
    const groupsDebug = Array.from(groups.entries()).map(([id, group]) => ({
      valueId: id,
      label: group.label,
      variantCount: group.items.length,
      indices: group.items.map(v => v.originalIndex).join(', ')
    }));

    logger.debug('📊 Grupos generados:', groupsDebug);
    logger.debug('Total variantes:', variants.length);

    return Array.from(groups.values());
  }, [variants, config]);

  // 3. Handler para edición masiva con feedback visual
  const handleGroupUpdate = (
    groupIndex: number,
    items: Array<VariantRow & { originalIndex: number }>,
    field: "price" | "stock",
    value: string
  ) => {
    if (value === "" || value === null || value === undefined) return;

    const numValue = field === "price" ? parseFloat(value) : parseInt(value);

    if (isNaN(numValue) || numValue < 0) return;



    logger.debug(`🔄 GRUPO ${groupIndex}: Aplicando ${field} = ${numValue} a ${items.length} variante(s)`);

    // ✅ Usar la nueva función de actualización masiva (batch update en una sola operación)
    const indices = items.map(item => item.originalIndex);
    onUpdateMultiple(indices, field, numValue);
  };

  // 4. Renderizado de imagen con dropdown
  const renderImageCell = (
    variant: VariantRow | undefined,
    onManage: () => void,
    onRemove: () => void,
    isGroupHeader: boolean = false
  ) => {
    const selectedImage = variant?.selectedImageUrl
      ? generalImages.find(img => img.url === variant.selectedImageUrl)
      : undefined;
    const inheritsImages = variant && !variant.selectedImageUrl;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`cursor-pointer ${isGroupHeader ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {selectedImage ? (
              <img
                src={selectedImage.url}
                alt="Variant"
                className={`w-16 h-16 rounded-lg object-cover border-2 ${isGroupHeader ? 'border-blue-400' : 'border-stone-200'}`}
              />
            ) : inheritsImages ? (
              <div className="w-16 h-16 rounded-lg border border-blue-200 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm transition-all">
                <Images className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-[9px] text-blue-600 font-medium tracking-tight">General</span>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg border-2 border-dashed border-stone-300 flex items-center justify-center relative">
                <ImageIcon className="h-6 w-6 text-stone-400" />
                {isGroupHeader && (
                  <span className="absolute bottom-1 text-[9px] text-stone-400">Variadas</span>
                )}
              </div>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onManage}>
            <Edit2 className="mr-2 h-4 w-4" />
            {isGroupHeader ? 'Aplicar a todas' : 'Gestionar'}
          </DropdownMenuItem>
          {selectedImage && (
            <DropdownMenuItem onClick={onRemove} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              {isGroupHeader ? 'Quitar de todas' : 'Quitar imagen específica'}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // 5. Renderizado de una fila normal
  const renderFlatRow = (variant: VariantRow, i: number, isGrouped: boolean = false) => {
    return (
      <TableRow key={`variant-${i}-${variant.sku || 'new'}`}>
        <TableCell>
          {renderImageCell(
            variant,
            () => onManageImage(i),
            () => onRemoveImage(i),
            false
          )}
        </TableCell>

        <TableCell className="font-medium text-sm">
          {isGrouped ? (
            <span className="pl-4 border-l-2 border-stone-200 block">
              {variant.attributeValueIds.slice(1).map(id => getValueLabel(id)).join(" / ")}
            </span>
          ) : (
            variant.displayName
          )}
        </TableCell>

        <TableCell>
          <Input
            className="h-8 text-xs font-mono w-32"
            value={variant.sku || ""}
            onChange={(e) => onUpdate(i, "sku", e.target.value)}
            onFocus={onInputFocus}
            onBlur={onInputBlur}
            placeholder="SKU"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            step="0.01"
            className="h-8 w-24 text-right"
            value={variant.price ?? ""}
            onChange={(e) => onUpdate(i, "price", parseFloat(e.target.value))}
            onFocus={(e) => { e.target.select(); onInputFocus(); }}
            onBlur={onInputBlur}
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            className="h-8 w-20 text-right"
            value={variant.stock ?? ""}
            onChange={(e) => onUpdate(i, "stock", parseInt(e.target.value))}
            onFocus={(e) => { e.target.select(); onInputFocus(); }}
            onBlur={onInputBlur}
          />
        </TableCell>
        <TableCell>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(i)}
            disabled={deletingVariantId === variant.id}
          >
            {deletingVariantId === variant.id ?
              <Loader2 className="animate-spin h-4 w-4" /> :
              <Trash2 className="h-4 w-4" />
            }
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="border rounded-md overflow-hidden">
      {/* Botones de Expand/Collapse All (solo si hay grupos) */}
      {/* Toolbar: Expand/Collapse & Global Edits */}
      <div className="px-4 py-3 bg-stone-50 border-b flex flex-wrap items-center justify-between gap-4">
        {/* Left: Expand/Collapse (only if grouped) */}
        <div className="flex items-center gap-2">
          {groupedVariants && groupedVariants.length > 1 && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={expandAll}
                className="h-8 text-xs text-stone-600"
              >
                Expandir todo
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={collapseAll}
                className="h-8 text-xs text-stone-600"
              >
                Colapsar todo
              </Button>
            </>
          )}
        </div>

        {/* Right: Global Bulk Edit */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-stone-500 whitespace-nowrap">Precio Global:</span>
            <div className="relative w-24">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-stone-400">$</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="h-8 pl-5 text-right text-xs"
                onBlur={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 0) {
                    const allIndices = variants.map((_, i) => i);
                    onUpdateMultiple(allIndices, "price", val);
                    e.target.value = ""; // Reset after apply
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-stone-500 whitespace-nowrap">Stock Global:</span>
            <Input
              type="number"
              placeholder="0"
              className="h-8 w-20 text-right text-xs"
              onBlur={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 0) {
                  const allIndices = variants.map((_, i) => i);
                  onUpdateMultiple(allIndices, "stock", val);
                  e.target.value = ""; // Reset
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
            />
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-45">Imágenes</TableHead>
            <TableHead>Combinación</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Precio ($)</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="w-12.5"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!groupedVariants ? (
            variants.map((variant, i) => renderFlatRow(variant, i))
          ) : (
            groupedVariants.map((group, groupIdx) => {
              const isExpanded = expandedGroups.has(groupIdx);

              return (
                <Fragment key={`group-fragment-${groupIdx}`}>
                  {/* HEADER DEL GRUPO - Solo el botón expande/colapsa */}
                  <TableRow
                    className="bg-stone-50 border-b border-stone-200"
                  >
                    {/* Imagen del grupo */}
                    <TableCell>
                      {renderImageCell(
                        group.groupImage ? {
                          selectedImageUrl: group.groupImage,
                          attributeValueIds: [],
                          displayName: "",
                          sku: undefined,
                          price: 0,
                          stock: 0
                        } : undefined,
                        () => onManageGroupImage(group.items.map(item => item.originalIndex)),
                        () => onRemoveGroupImage(group.items.map(item => item.originalIndex)),
                        true
                      )}
                    </TableCell>

                    <TableCell className="py-3 pl-2">
                      <div className="flex items-center gap-2">
                        {/* Botón de Expand/Collapse */}
                        <button
                          type="button"
                          onClick={() => toggleGroup(groupIdx)}
                          className="p-1 hover:bg-stone-200 rounded transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-stone-600" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-stone-600" />
                          )}
                        </button>

                        <Layers className="h-4 w-4 text-stone-500" />
                        <span className="font-semibold text-stone-700 text-sm">
                          {config[0].attributeName}: <span className="text-black text-base">{group.label}</span>
                        </span>
                        <span className="text-xs text-stone-400 ml-2 bg-white px-2 py-0.5 rounded border border-stone-200">
                          {group.items.length} variante{group.items.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-stone-400 italic flex items-center gap-1">
                        Edición en lote <span className="text-stone-300">→</span>
                      </span>
                    </TableCell>

                    {/* Precio masivo con feedback */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Aplicar a todas"
                          className="h-8 w-24 text-right placeholder:text-[10px]"
                          onBlur={(e) => {
                            handleGroupUpdate(groupIdx, group.items, "price", e.target.value);
                            onInputBlur();
                          }}
                          onFocus={(e) => {
                            e.target.select();
                            onInputFocus();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur();
                            }
                          }}
                        />
                      </div>
                    </TableCell>

                    {/* Stock masivo con feedback */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="Aplicar a todas"
                          className="h-8 w-20 text-right placeholder:text-[10px]"
                          onBlur={(e) => {
                            handleGroupUpdate(groupIdx, group.items, "stock", e.target.value);
                            onInputBlur();
                          }}
                          onFocus={(e) => {
                            e.target.select();
                            onInputFocus();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur();
                            }
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell />
                  </TableRow>

                  {/* FILAS HIJAS - Solo se muestran si está EXPANDIDO */}
                  {isExpanded && group.items.map((variant) =>
                    renderFlatRow(variant, variant.originalIndex, true)
                  )}
                </Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
      <div className="px-4 py-3 bg-stone-50 border-t text-xs text-stone-500">
        Total: {variants.length} variante{variants.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}