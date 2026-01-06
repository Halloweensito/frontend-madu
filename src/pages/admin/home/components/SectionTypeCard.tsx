// pages/admin/home/components/SectionTypeCard.tsx
// Dumb component for section type selection

import type { UseFormReturn } from 'react-hook-form';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { SectionType } from '@/types/homeSection';
import type { HomeSectionFormData } from '@/schemas/homeSectionForm';

const sectionTypeOptions = [
    { value: SectionType.HERO, label: 'Hero (Carrusel principal)', description: 'Slides con imágenes de fondo y CTAs' },
    { value: SectionType.CATEGORIES, label: 'Categorías', description: 'Grid de categorías destacadas' },
    { value: SectionType.FEATURED_PRODUCTS, label: 'Productos Destacados', description: 'Carrusel o grid de productos' },
    { value: SectionType.BANNER, label: 'Banner Promocional', description: 'Imagen con título y CTA' },
    { value: SectionType.TEXT_BLOCK, label: 'Bloque de Texto', description: 'Título, descripción y CTA opcional' },
];

interface SectionTypeCardProps {
    form: UseFormReturn<HomeSectionFormData>;
    disabled?: boolean;
}

export function SectionTypeCard({ form, disabled }: SectionTypeCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tipo de Sección</CardTitle>
                <CardDescription>
                    Elige qué tipo de contenido mostrará esta sección
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={disabled}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sectionTypeOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{option.label}</span>
                                                    <span className="text-xs text-stone-500">{option.description}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
}
