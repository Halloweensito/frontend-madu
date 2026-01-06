// components/home/ItemPicker.tsx
// Reusable multi-selector for categories and products

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { CategoryResponse, ProductResponse } from '@/types/types';

// ==========================================
// TYPES
// ==========================================

export interface SelectedItem {
    id: number;
    position: number;
    name: string;
    imageUrl?: string;
    slug?: string;
}
// ==========================================
// CATEGORY PICKER
// ==========================================

interface CategoryPickerProps {
    categories: CategoryResponse[];
    selectedItems: SelectedItem[];
    onSelectionChange: (items: SelectedItem[]) => void;
    isLoading: boolean;
    error?: Error | null;
    disabled?: boolean;
    maxItems?: number;
}

export function CategoryPicker({
    categories,
    selectedItems,
    onSelectionChange,
    isLoading,
    error,
    disabled,
    maxItems = 10,
}: CategoryPickerProps) {
    // Flatten category tree for simpler selection
    const flattenCategories = (cats: CategoryResponse[], depth = 0): Array<CategoryResponse & { depth: number }> => {
        const result: Array<CategoryResponse & { depth: number }> = [];
        for (const cat of cats) {
            result.push({ ...cat, depth });
            if (cat.subCategories && cat.subCategories.length > 0) {
                result.push(...flattenCategories(cat.subCategories, depth + 1));
            }
        }
        return result;
    };

    const flatCategories = flattenCategories(categories);

    // Filter out already selected
    const availableCategories = flatCategories.filter(
        cat => !selectedItems.some(item => item.id === cat.id)
    );

    const handleAddItem = (categoryId: string) => {
        const category = flatCategories.find(c => c.id === Number(categoryId));
        if (!category) return;

        const newItem: SelectedItem = {
            id: category.id,
            position: selectedItems.length,
            name: category.name,
            imageUrl: category.imageUrl || undefined,
            slug: category.slug,
        };

        onSelectionChange([...selectedItems, newItem]);
    };

    const handleRemoveItem = (id: number) => {
        const filtered = selectedItems.filter(item => item.id !== id);
        // Recalculate positions
        const reordered = filtered.map((item, idx) => ({ ...item, position: idx }));
        onSelectionChange(reordered);
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newItems = [...selectedItems];
        [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
        onSelectionChange(newItems.map((item, idx) => ({ ...item, position: idx })));
    };

    const handleMoveDown = (index: number) => {
        if (index === selectedItems.length - 1) return;
        const newItems = [...selectedItems];
        [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        onSelectionChange(newItems.map((item, idx) => ({ ...item, position: idx })));
    };

    const canAddMore = selectedItems.length < maxItems;

    return (
        <div className="space-y-3">
            {/* Selected items */}
            {selectedItems.length > 0 && (
                <div className="space-y-2">
                    {selectedItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-2 p-2 bg-stone-50 rounded-lg border border-stone-200"
                        >
                            <div className="flex flex-col gap-0.5">
                                <button
                                    type="button"
                                    onClick={() => handleMoveUp(index)}
                                    disabled={index === 0 || disabled}
                                    className="text-stone-400 hover:text-stone-600 disabled:opacity-30"
                                >
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMoveDown(index)}
                                    disabled={index === selectedItems.length - 1 || disabled}
                                    className="text-stone-400 hover:text-stone-600 disabled:opacity-30"
                                >
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>

                            <Avatar className="h-8 w-8">
                                {item.imageUrl ? (
                                    <AvatarImage src={item.imageUrl} alt={item.name} />
                                ) : (
                                    <AvatarFallback className="bg-stone-200 text-xs">
                                        {item.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            <span className="flex-1 text-sm font-medium truncate">{item.name}</span>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-stone-400 hover:text-red-500"
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={disabled}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add selector */}
            {canAddMore && (
                <Select
                    onValueChange={handleAddItem}
                    disabled={disabled || isLoading || !!error || availableCategories.length === 0}
                >
                    <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder={
                            isLoading ? "Cargando..." :
                                error ? "Error al cargar" :
                                    availableCategories.length === 0 ? "No hay más categorías" :
                                        "Agregar categoría..."
                        } />
                    </SelectTrigger>
                    <SelectContent>
                        {availableCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                <div className="flex items-center" style={{ paddingLeft: cat.depth * 12 }}>
                                    {cat.imageUrl ? (
                                        <Avatar className="mr-2 h-5 w-5">
                                            <AvatarImage src={cat.imageUrl} alt={cat.name} />
                                        </Avatar>
                                    ) : (
                                        <div className="mr-2 h-5 w-5 rounded-full bg-stone-200 flex-shrink-0" />
                                    )}
                                    <span className="truncate">{cat.name}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {selectedItems.length === 0 && !canAddMore && (
                <p className="text-sm text-stone-500 text-center py-2">
                    Máximo de {maxItems} categorías alcanzado
                </p>
            )}
        </div>
    );
}

// ==========================================
// PRODUCT PICKER
// ==========================================

interface ProductPickerProps {
    products: ProductResponse[];
    selectedItems: SelectedItem[];
    onSelectionChange: (items: SelectedItem[]) => void;
    isLoading: boolean;
    error?: Error | null;
    disabled?: boolean;
    maxItems?: number;
}

export function ProductPicker({
    products,
    selectedItems,
    onSelectionChange,
    isLoading,
    error,
    disabled,
    maxItems = 12,
}: ProductPickerProps) {
    // Filter out already selected
    const availableProducts = products.filter(
        p => !selectedItems.some(item => item.id === p.id)
    );

    const handleAddItem = (productId: string) => {
        const product = products.find(p => p.id === Number(productId));
        if (!product) return;

        // Get the first image URL
        const imageUrl = product.images?.[0]?.url || undefined;

        const newItem: SelectedItem = {
            id: product.id,
            position: selectedItems.length,
            name: product.name,
            imageUrl,
            slug: product.slug,
        };

        onSelectionChange([...selectedItems, newItem]);
    };

    const handleRemoveItem = (id: number) => {
        const filtered = selectedItems.filter(item => item.id !== id);
        const reordered = filtered.map((item, idx) => ({ ...item, position: idx }));
        onSelectionChange(reordered);
    };

    const canAddMore = selectedItems.length < maxItems;

    return (
        <div className="space-y-3">
            {/* Selected items grid */}
            {selectedItems.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {selectedItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="relative group aspect-square bg-stone-100 rounded-lg overflow-hidden border border-stone-200"
                        >
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-400">
                                    <span className="text-2xl">{item.name.charAt(0)}</span>
                                </div>
                            )}

                            {/* Overlay with name */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                <p className="text-white text-xs truncate">{item.name}</p>
                            </div>

                            {/* Remove button */}
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={disabled}
                            >
                                <X className="h-3 w-3" />
                            </Button>

                            {/* Position badge */}
                            <span className="absolute top-1 left-1 bg-white/90 text-xs px-1.5 py-0.5 rounded font-medium">
                                {index + 1}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Add selector */}
            {canAddMore && (
                <Select
                    onValueChange={handleAddItem}
                    disabled={disabled || isLoading || !!error || availableProducts.length === 0}
                >
                    <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder={
                            isLoading ? "Cargando productos..." :
                                error ? "Error al cargar" :
                                    availableProducts.length === 0 ? "No hay más productos disponibles" :
                                        "Agregar producto..."
                        } />
                    </SelectTrigger>
                    <SelectContent>
                        {availableProducts.slice(0, 50).map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                                <div className="flex items-center">
                                    {product.images?.[0]?.url ? (
                                        <Avatar className="mr-2 h-6 w-6">
                                            <AvatarImage src={product.images[0].url} alt={product.name} />
                                        </Avatar>
                                    ) : (
                                        <div className="mr-2 h-6 w-6 rounded bg-stone-200 flex-shrink-0" />
                                    )}
                                    <span className="truncate">{product.name}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {selectedItems.length === 0 && (
                <p className="text-sm text-stone-500 text-center py-4 border-2 border-dashed border-stone-200 rounded-lg">
                    Selecciona productos para mostrar
                </p>
            )}
        </div>
    );
}
