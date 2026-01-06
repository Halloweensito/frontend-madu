// pages/admin/home/components/CategoriesGridSection.tsx
// Dumb component for Categories Grid selection (simplified for Accordion use)

import type { UseFormReturn } from 'react-hook-form';
import { Check, Loader2 } from 'lucide-react';

import { Switch } from '@/components/ui/switch';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import type { CategoryResponse } from '@/types/types';
import type { HomeSettingsFormData } from '@/pages/admin/home/types';

interface CategoriesGridSectionProps {
    form: UseFormReturn<HomeSettingsFormData>;
    categories: CategoryResponse[] | undefined;
    isLoading: boolean;
}

export function CategoriesGridSection({
    form,
    categories,
    isLoading
}: CategoriesGridSectionProps) {
    return (
        <div className="space-y-4 pb-4">
            <FormField
                control={form.control}
                name="categoriesActive"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Activo</FormLabel>
                            <FormDescription>
                                Mostrar categorías en la home
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
                name="selectedCategoryIds"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Selecciona las categorías</FormLabel>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                            {isLoading ? (
                                <div className="col-span-full flex justify-center py-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
                                </div>
                            ) : categories?.map((cat) => {
                                const isSelected = field.value.includes(cat.id);
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => {
                                            if (isSelected) {
                                                field.onChange(field.value.filter((id: number) => id !== cat.id));
                                            } else {
                                                field.onChange([...field.value, cat.id]);
                                            }
                                        }}
                                        className={`
                                            relative p-3 rounded-lg border-2 text-left transition-all
                                            ${isSelected
                                                ? 'border-stone-900 bg-stone-50'
                                                : 'border-stone-200 hover:border-stone-300'
                                            }
                                        `}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 bg-stone-900 text-white rounded-full p-0.5">
                                                <Check className="h-3 w-3" />
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            {cat.imageUrl ? (
                                                <img
                                                    src={cat.imageUrl}
                                                    alt={cat.name}
                                                    className="h-8 w-8 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded bg-stone-200 flex items-center justify-center text-xs font-medium">
                                                    {cat.name.charAt(0)}
                                                </div>
                                            )}
                                            <span className="text-sm font-medium truncate">
                                                {cat.name}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        {field.value.length > 0 && (
                            <p className="text-xs text-stone-500 mt-2">
                                {field.value.length} categoría{field.value.length !== 1 ? 's' : ''} seleccionada{field.value.length !== 1 ? 's' : ''}
                            </p>
                        )}
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
