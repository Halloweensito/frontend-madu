// pages/admin/home/components/ContentFieldsCard.tsx
// Dumb component for content fields (title, subtitle, description, CTA)

import type { UseFormReturn } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { SectionType } from '@/types/homeSection';
import type { HomeSectionFormData } from '@/schemas/homeSectionForm';

interface ContentFieldsCardProps {
    form: UseFormReturn<HomeSectionFormData>;
    sectionType: string;
}

export function ContentFieldsCard({ form, sectionType }: ContentFieldsCardProps) {
    const showDescription = sectionType === SectionType.TEXT_BLOCK || sectionType === SectionType.BANNER;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contenido</CardTitle>
                <CardDescription>
                    Textos y enlaces de la sección
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej. Nueva Colección 2025" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subtítulo</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej. Descubre los nuevos estilos" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {showDescription && (
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Texto descriptivo de la sección..."
                                        className="min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="ctaText"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Texto del Botón (CTA)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej. Ver más" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="ctaLink"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Enlace del Botón</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej. /productos" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
