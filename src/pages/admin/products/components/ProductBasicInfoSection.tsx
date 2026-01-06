
import { type RefObject } from "react";
import { type Control } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { CategorySelector } from "../CategorySelector";
import { ImageUpload, type ImageUploadHandle } from "../ImageUpload";
import type { ProductFormData, CategoryResponse } from "@/types/types";

interface ProductBasicInfoSectionProps {
    control: Control<ProductFormData>;
    categories: CategoryResponse[] | undefined;
    isLoadingCategories: boolean;
    categoriesError: Error | null;
    imageUploadRef: RefObject<ImageUploadHandle | null>;
    isSubmitting: boolean;
}

export function ProductBasicInfoSection({
    control,
    categories,
    isLoadingCategories,
    categoriesError,
    imageUploadRef,
    isSubmitting,
}: ProductBasicInfoSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>
                    Datos generales del producto
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Nombre */}
                <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre del Producto *</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Sujetador Push-Up Encaje" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Categoría */}
                <FormField
                    control={control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Categoría *</FormLabel>
                            <FormControl>
                                <CategorySelector
                                    key={field.value} // 🔑 Force update when value is loaded
                                    categories={categories}
                                    isLoading={isLoadingCategories}
                                    error={categoriesError}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Descripción */}
                <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe el producto..."
                                    className="resize-none"
                                    rows={4}
                                    {...field}
                                    value={field.value ?? ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Imágenes */}
                <FormField
                    control={control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Imágenes del Producto</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    ref={imageUploadRef}
                                    value={field.value || []}
                                    onChange={field.onChange}
                                    disabled={isSubmitting}
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
