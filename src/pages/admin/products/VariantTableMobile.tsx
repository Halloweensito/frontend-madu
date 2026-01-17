import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { type ImageRequest, type AttributeConfig } from "@/types/types";
import { type VariantRow } from "@/hooks/useVariantLogic";
import { VariantImageCell } from "./VariantImageCell";

export interface GroupedVariant {
    label: string;
    items: Array<VariantRow & { originalIndex: number }>;
    groupImage?: string;
}

interface VariantTableMobileProps {
    variants: VariantRow[];
    groupedVariants: GroupedVariant[] | null;
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

export function VariantTableMobile({
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
}: VariantTableMobileProps) {

    // Estado local para manejar la expansión de grupos
    const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

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

    const getValueLabel = (valueId: number): string => {
        for (const attr of config) {
            const value = attr.selectedValues.find(v => v.id === valueId);
            if (value) return value.value || value.slug || `Valor ${valueId}`;
        }
        return "";
    };

    const handleGroupUpdate = (
        _groupIndex: number,
        items: Array<VariantRow & { originalIndex: number }>,
        field: "price" | "stock",
        value: string
    ) => {
        if (value === "" || value === null || value === undefined) return;
        const numValue = field === "price" ? parseFloat(value) : parseInt(value);
        if (isNaN(numValue) || numValue < 0) return;

        const indices = items.map(item => item.originalIndex);
        onUpdateMultiple(indices, field, numValue);
    };

    // Helper para calcular valores comunes
    const getCommonValue = (items: VariantRow[], field: 'price' | 'stock') => {
        if (items.length === 0) return '';
        const firstVal = items[0][field];
        const allSame = items.every(item => item[field] === firstVal);
        // Verificar si es 0, si es 0 también lo devolvemos, pero cuidado con vacíos
        return allSame && firstVal !== undefined ? firstVal : '';
    };

    return (
        <div className="block sm:hidden space-y-2">
            {!groupedVariants ? (
                // Sin agrupación: lista plana
                variants.map((variant, i) => (
                    <div key={`mobile-variant-${i}`} className="border rounded-md bg-white p-3 shadow-sm">
                        <div className="flex items-center gap-3">
                            {/* Imagen */}
                            <div className="shrink-0">
                                <VariantImageCell
                                    selectedUrl={variant.selectedImageUrl}
                                    generalImages={generalImages}
                                    inheritsImages={false}
                                    onManage={() => onManageImage(i)}
                                    onRemove={() => onRemoveImage(i)}
                                    isGroupHeader={false}
                                />
                            </div>

                            {/* Nombre y campos */}
                            <div className="flex-1 min-w-0 space-y-2">
                                <p className="font-semibold text-sm truncate">{variant.displayName || 'Variante'}</p>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        className="h-9 text-sm w-24"
                                        value={variant.price ?? ""}
                                        onChange={(e) => onUpdate(i, "price", parseFloat(e.target.value))}
                                        onFocus={(e) => { e.target.select(); onInputFocus(); }}
                                        onBlur={onInputBlur}
                                        placeholder="Precio"
                                    />
                                    <Input
                                        type="number"
                                        className="h-9 text-sm w-20"
                                        value={variant.stock ?? ""}
                                        onChange={(e) => onUpdate(i, "stock", parseInt(e.target.value))}
                                        onFocus={(e) => { e.target.select(); onInputFocus(); }}
                                        onBlur={onInputBlur}
                                        placeholder="Stock"
                                    />
                                </div>
                            </div>

                            {/* Botón eliminar */}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="shrink-0 h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => onRemove(i)}
                                disabled={deletingVariantId === variant.id}
                            >
                                {deletingVariantId === variant.id ?
                                    <Loader2 className="animate-spin h-4 w-4" /> :
                                    <Trash2 className="h-4 w-4" />
                                }
                            </Button>
                        </div>
                    </div>
                ))
            ) : (
                // Con agrupación: grupos manuales
                groupedVariants.map((group, groupIdx) => {
                    const isExpanded = expandedGroups.has(groupIdx);
                    const commonPrice = getCommonValue(group.items, 'price');
                    const commonStock = getCommonValue(group.items, 'stock');

                    return (
                        <div key={`mobile-group-${groupIdx}`} className="border rounded-md bg-white shadow-sm overflow-hidden">
                            {/* Header del Grupo */}
                            <div
                                className="px-3 py-3 bg-stone-50 flex items-center gap-3 cursor-pointer"
                                onClick={() => toggleGroup(groupIdx)}
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                                    {/* Imagen del Grupo */}
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <VariantImageCell
                                            selectedUrl={group.groupImage}
                                            generalImages={generalImages}
                                            inheritsImages={false}
                                            onManage={() => onManageGroupImage(group.items.map(item => item.originalIndex))}
                                            onRemove={() => onRemoveGroupImage(group.items.map(item => item.originalIndex))}
                                            isGroupHeader={true}
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0 text-left space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-stone-900 text-sm truncate">
                                                {group.label}
                                            </span>
                                            <span className="text-xs text-stone-500 bg-white px-1.5 py-0.5 rounded border border-stone-200 shrink-0">
                                                {group.items.length}
                                            </span>
                                            {/* Chevron Indicador */}
                                            {isExpanded ? <ChevronDown className="h-4 w-4 text-stone-400 ml-auto" /> : <ChevronRight className="h-4 w-4 text-stone-400 ml-auto" />}
                                        </div>

                                        {/* Inputs Masivos - Controlados visualmente o con placeholder inteligente */}
                                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                className="h-9 text-sm w-24 bg-white"
                                                // Si hay un precio común, usarlo como placeholder para indicar que "ya está configurado"
                                                // o incluso pre-llenarlo.
                                                placeholder={commonPrice !== '' ? commonPrice.toString() : "Precio"}
                                                // Usamos defaultValue si queremos que arranque con ese valor.
                                                // Pero para reactividad, key trick es útil o simplemente un placeholder.
                                                // El usuario pidió "valor default sea el precio actual". Placeholder hace eso visualmente.
                                                // Si ponemos defaultValue, el input tendrá el valor real.
                                                defaultValue={commonPrice}
                                                key={`default-price-${groupIdx}-${commonPrice}`} // Reset si cambia
                                                onBlur={(e) => {
                                                    if (e.target.value !== '') {
                                                        handleGroupUpdate(groupIdx, group.items, "price", e.target.value);
                                                        onInputBlur();
                                                    }
                                                }}
                                                onFocus={(e) => { e.target.select(); onInputFocus(); }}
                                                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                            />
                                            <Input
                                                type="number"
                                                className="h-9 text-sm w-20 bg-white"
                                                placeholder={commonStock !== '' ? commonStock.toString() : "Stock"}
                                                defaultValue={commonStock}
                                                key={`default-stock-${groupIdx}-${commonStock}`}
                                                onBlur={(e) => {
                                                    if (e.target.value !== '') {
                                                        handleGroupUpdate(groupIdx, group.items, "stock", e.target.value);
                                                        onInputBlur();
                                                    }
                                                }}
                                                onFocus={(e) => { e.target.select(); onInputFocus(); }}
                                                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contenido Expandible */}
                            {isExpanded && (
                                <div className="border-t border-stone-200 bg-white">
                                    <div className="border-l-4 border-stone-100 ml-0 pl-0">
                                        {group.items.map((variant) => {
                                            const idx = variant.originalIndex;
                                            const secondaryLabel = variant.attributeValueIds.slice(1).map(id => getValueLabel(id)).join(" / ");

                                            return (
                                                <div key={`mobile-grouped-${idx}`} className="flex items-center gap-3 px-3 py-3 border-b border-stone-100 last:border-b-0 pl-4">
                                                    {/* Imagen */}
                                                    <div className="shrink-0">
                                                        <VariantImageCell
                                                            selectedUrl={variant.selectedImageUrl}
                                                            generalImages={generalImages}
                                                            inheritsImages={!variant.selectedImageUrl}
                                                            onManage={() => onManageImage(idx)}
                                                            onRemove={() => onRemoveImage(idx)}
                                                            isGroupHeader={false}
                                                        />
                                                    </div>

                                                    {/* Nombre y campos */}
                                                    <div className="flex-1 min-w-0 space-y-1.5">
                                                        <p className="font-medium text-sm truncate">{secondaryLabel || 'Variante'}</p>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                className="h-9 text-sm w-24"
                                                                value={variant.price ?? ""}
                                                                onChange={(e) => onUpdate(idx, "price", parseFloat(e.target.value))}
                                                                onFocus={(e) => { e.target.select(); onInputFocus(); }}
                                                                onBlur={onInputBlur}
                                                                placeholder="Precio"
                                                            />
                                                            <Input
                                                                type="number"
                                                                className="h-9 text-sm w-20"
                                                                value={variant.stock ?? ""}
                                                                onChange={(e) => onUpdate(idx, "stock", parseInt(e.target.value))}
                                                                onFocus={(e) => { e.target.select(); onInputFocus(); }}
                                                                onBlur={onInputBlur}
                                                                placeholder="Stock"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Botón eliminar */}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="shrink-0 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => onRemove(idx)}
                                                        disabled={deletingVariantId === variant.id}
                                                    >
                                                        {deletingVariantId === variant.id ?
                                                            <Loader2 className="animate-spin h-4 w-4" /> :
                                                            <Trash2 className="h-4 w-4" />
                                                        }
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}