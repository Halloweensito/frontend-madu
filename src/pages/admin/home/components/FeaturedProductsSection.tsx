// pages/admin/home/components/FeaturedProductsSection.tsx
// Component for Featured Products with Combobox multi-select + chips

import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Check, ChevronsUpDown, X, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { useProducts } from '@/hooks/useCatalog';
import type { HomeSettingsFormData } from '@/pages/admin/home/types';

interface FeaturedProductsSectionProps {
    form: UseFormReturn<HomeSettingsFormData>;
}

export function FeaturedProductsSection({ form }: FeaturedProductsSectionProps) {
    const [open, setOpen] = useState(false);
    const { data: productsData, isLoading } = useProducts({ page: 0, size: 100 });
    const products = productsData?.content || [];

    return (
        <div className="space-y-4 pb-4">
            <FormField
                control={form.control}
                name="featuredActive"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Activo</FormLabel>
                            <FormDescription>
                                Mostrar productos destacados en la home
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="selectedProductIds"
                render={({ field }) => {
                    const selectedProducts = products.filter(p => field.value.includes(p.id));

                    const handleSelect = (productId: number) => {
                        if (field.value.includes(productId)) {
                            field.onChange(field.value.filter((id: number) => id !== productId));
                        } else {
                            field.onChange([...field.value, productId]);
                        }
                    };

                    const handleRemove = (productId: number) => {
                        field.onChange(field.value.filter((id: number) => id !== productId));
                    };

                    return (
                        <FormItem>
                            <FormLabel>Productos Destacados</FormLabel>

                            {/* Selected products as chips */}
                            {selectedProducts.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center gap-1.5 bg-stone-100 rounded-full pl-1 pr-2 py-1"
                                        >
                                            {product.images?.[0]?.url ? (
                                                <img
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    className="h-6 w-6 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-6 w-6 rounded-full bg-stone-300 flex items-center justify-center text-[10px] font-medium">
                                                    {product.name.charAt(0)}
                                                </div>
                                            )}
                                            <span className="text-sm font-medium max-w-32 truncate">
                                                {product.name}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(product.id)}
                                                className="text-stone-400 hover:text-stone-600 ml-0.5"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Combobox trigger */}
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className="w-full justify-between font-normal"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    Cargando productos...
                                                </>
                                            ) : (
                                                <>
                                                    {selectedProducts.length === 0
                                                        ? "Buscar y agregar productos..."
                                                        : `${selectedProducts.length} producto${selectedProducts.length !== 1 ? 's' : ''} seleccionado${selectedProducts.length !== 1 ? 's' : ''}`
                                                    }
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </>
                                            )}
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Buscar producto..." />
                                        <CommandList>
                                            <CommandEmpty>No se encontraron productos.</CommandEmpty>
                                            <CommandGroup>
                                                {products.map((product) => {
                                                    const isSelected = field.value.includes(product.id);
                                                    return (
                                                        <CommandItem
                                                            key={product.id}
                                                            value={product.name}
                                                            onSelect={() => handleSelect(product.id)}
                                                            className="cursor-pointer"
                                                        >
                                                            <div className="flex items-center gap-2 flex-1">
                                                                {product.images?.[0]?.url ? (
                                                                    <img
                                                                        src={product.images[0].url}
                                                                        alt={product.name}
                                                                        className="h-8 w-8 rounded object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="h-8 w-8 rounded bg-stone-200 flex items-center justify-center text-xs font-medium">
                                                                        {product.name.charAt(0)}
                                                                    </div>
                                                                )}
                                                                <span className="truncate">{product.name}</span>
                                                            </div>
                                                            <Check
                                                                className={cn(
                                                                    "h-4 w-4",
                                                                    isSelected ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    );
                                                })}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            <FormDescription>
                                Busca y selecciona los productos que aparecerán destacados
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
        </div>
    );
}
