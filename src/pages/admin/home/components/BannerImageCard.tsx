// pages/admin/home/components/BannerImageCard.tsx
// Dumb component for banner image upload

import type { UseFormReturn } from 'react-hook-form';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { ImageUpload } from '@/pages/admin/products/ImageUpload';
import type { ImageUploadHandle } from '@/pages/admin/products/ImageUpload';
import type { HomeSectionFormData } from '@/schemas/homeSectionForm';

interface BannerImageCardProps {
    form: UseFormReturn<HomeSectionFormData>;
    imageUploadRef: React.RefObject<ImageUploadHandle | null>;
    disabled?: boolean;
}

export function BannerImageCard({ form, imageUploadRef, disabled }: BannerImageCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Imagen del Banner</CardTitle>
            </CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <ImageUpload
                                    ref={imageUploadRef}
                                    value={field.value ? [{ url: field.value }] : []}
                                    onChange={(images) => field.onChange(images[0]?.url || '')}
                                    disabled={disabled}
                                    maxImages={1}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
}
