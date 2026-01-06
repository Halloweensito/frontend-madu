// pages/admin/home/components/BannerSection.tsx
// Dumb component for Hero Banner settings (simplified for Accordion use)

import type { UseFormReturn } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { ImageUpload } from '@/pages/admin/products/ImageUpload';
import type { ImageUploadHandle } from '@/pages/admin/products/ImageUpload';
import type { HomeSettingsFormData } from '@/pages/admin/home/types';

interface BannerSectionProps {
    form: UseFormReturn<HomeSettingsFormData>;
    imageUploadRef: React.RefObject<ImageUploadHandle | null>;
    isSaving: boolean;
}

export function BannerSection({ form, imageUploadRef, isSaving }: BannerSectionProps) {
    return (
        <div className="space-y-4 pb-4">
            {/* Active toggle */}
            <FormField
                control={form.control}
                name="bannerActive"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Activo</FormLabel>
                            <FormDescription>
                                Mostrar banner en la home
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
                name="bannerTitle"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Ej: Nueva Colección 2025"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="bannerSubtitle"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Subtítulo</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Ej: Estilo Urbano"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="bannerImageUrl"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Imagen de Fondo</FormLabel>
                        <FormControl>
                            <ImageUpload
                                ref={imageUploadRef}
                                value={field.value ? [{ url: field.value }] : []}
                                onChange={(images) => field.onChange(images[0]?.url || '')}
                                disabled={isSaving}
                                maxImages={1}
                            />
                        </FormControl>
                        <FormDescription>
                            Recomendado: 1920x1080px o mayor
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="bannerLink"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Enlace del Botón</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="/productos"
                                {...field}
                            />
                        </FormControl>
                        <FormDescription>
                            A dónde lleva el botón "Explorar"
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
