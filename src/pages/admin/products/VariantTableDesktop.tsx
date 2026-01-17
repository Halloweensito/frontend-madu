import { useState, Fragment } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Layers, ChevronDown, ChevronRight } from "lucide-react";
import { type ImageRequest, type AttributeConfig } from "@/types/types";
import { type VariantRow } from "@/hooks/useVariantLogic";
import { VariantImageCell } from "./VariantImageCell";
import { type GroupedVariant } from "./VariantTableMobile";

interface VariantTableDesktopProps {
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

export function VariantTableDesktop({
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
}: VariantTableDesktopProps) {

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
        // Verificar si es 0, si es 0 también lo devolvemos
        return allSame && firstVal !== undefined ? firstVal : '';
    };

    const renderFlatRow = (variant: VariantRow, i: number, isGrouped: boolean = false) => {
        return (
            <TableRow key={`variant-${i}-${variant.sku || 'new'}`}>
                <TableCell>
                    <VariantImageCell
                        selectedUrl={variant.selectedImageUrl}
                        generalImages={generalImages}
                        inheritsImages={!variant.selectedImageUrl}
                        onManage={() => onManageImage(i)}
                        onRemove={() => onRemoveImage(i)}
                        isGroupHeader={false}
                    />
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
        <div className="hidden sm:block">
            <div className="sm:border sm:rounded-md overflow-hidden overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-45">Imágenes</TableHead>
                            <TableHead>Combinación</TableHead>
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
                                const commonPrice = getCommonValue(group.items, 'price');
                                const commonStock = getCommonValue(group.items, 'stock');

                                return (
                                    <Fragment key={`group-fragment-${groupIdx}`}>
                                        {/* HEADER DEL GRUPO */}
                                        <TableRow
                                            className="bg-stone-50 border-b border-stone-200"
                                        >
                                            {/* Imagen del grupo */}
                                            <TableCell>
                                                <VariantImageCell
                                                    selectedUrl={group.groupImage}
                                                    generalImages={generalImages}
                                                    inheritsImages={false}
                                                    onManage={() => onManageGroupImage(group.items.map(item => item.originalIndex))}
                                                    onRemove={() => onRemoveGroupImage(group.items.map(item => item.originalIndex))}
                                                    isGroupHeader={true}
                                                />
                                            </TableCell>

                                            <TableCell className="py-3 pl-2">
                                                <div className="flex items-center gap-2">
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

                                            {/* Precio masivo */}
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <div className="relative">
                                                    {/* Label o indicador sutil */}
                                                    <span className="absolute -top-3 left-0 text-[9px] text-stone-400">Total</span>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder={commonPrice !== '' ? commonPrice.toString() : "Aplicar"}
                                                        defaultValue={commonPrice}
                                                        key={`desktop-price-${groupIdx}-${commonPrice}`}
                                                        className="h-8 w-24 text-right placeholder:text-stone-300"
                                                        onBlur={(e) => {
                                                            if (e.target.value !== '') {
                                                                handleGroupUpdate(groupIdx, group.items, "price", e.target.value);
                                                                onInputBlur();
                                                            }
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

                                            {/* Stock masivo */}
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <div className="relative">
                                                    <span className="absolute -top-3 left-0 text-[9px] text-stone-400">Total</span>
                                                    <Input
                                                        type="number"
                                                        placeholder={commonStock !== '' ? commonStock.toString() : "Aplicar"}
                                                        defaultValue={commonStock}
                                                        key={`desktop-stock-${groupIdx}-${commonStock}`}
                                                        className="h-8 w-20 text-right placeholder:text-stone-300"
                                                        onBlur={(e) => {
                                                            if (e.target.value !== '') {
                                                                handleGroupUpdate(groupIdx, group.items, "stock", e.target.value);
                                                                onInputBlur();
                                                            }
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

                                        {/* FILAS HIJAS */}
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
        </div>
    );
}