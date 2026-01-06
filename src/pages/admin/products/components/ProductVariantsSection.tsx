// components/ProductVariantsSection.tsx
// Section for product attributes and variants

import { Loader2, AlertCircle } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { AttributeBuilder } from "../AttributeBuilder";
import { VariantGenerator } from "../VariantGenerator";
import type { ProductFormData, Attribute, ImageRequest, ProductVariantRequest } from "@/types/types";

interface ProductVariantsSectionProps {
    form: UseFormReturn<ProductFormData>;
    globalAttributes: Attribute[];
    isLoadingAttributes: boolean;
    attributesError: Error | null;
    attributesConfig: ProductFormData["attributesConfig"];
    defaultPrice: number;
    defaultStock: number;
    initialVariants: ProductVariantRequest[] | undefined;
    productId: number | undefined;
    generalImages: ImageRequest[];
}

export function ProductVariantsSection({
    form,
    globalAttributes,
    isLoadingAttributes,
    attributesError,
    attributesConfig,
    defaultPrice,
    defaultStock,
    initialVariants,
    productId,
    generalImages,
}: ProductVariantsSectionProps) {
    const isEditMode = !!productId;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Opciones del Producto</CardTitle>
                <CardDescription>
                    Agrega opciones como Talla o Color. Solo se pueden usar atributos de tipo SELECT.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Constructor de Atributos */}
                {isLoadingAttributes ? (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
                        <span className="ml-2 text-sm text-stone-500">Cargando atributos...</span>
                    </div>
                ) : attributesError ? (
                    <div className="flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 rounded-md">
                        <AlertCircle className="h-4 w-4" />
                        <span>Error al cargar atributos. Por favor, recarga la página.</span>
                    </div>
                ) : (
                    <AttributeBuilder
                        globalAttributes={globalAttributes}
                        currentAttributes={attributesConfig || []}
                        onAttributesChange={(newConfig) => {
                            form.setValue("attributesConfig", newConfig, {
                                shouldValidate: false,
                                shouldDirty: true,
                                shouldTouch: false
                            });
                            // Clear variants when attributes change
                            form.setValue("variants", [], {
                                shouldValidate: false,
                                shouldDirty: true,
                                shouldTouch: false
                            });
                        }}
                    />
                )}

                {/* Generador de Variantes */}
                {attributesConfig && attributesConfig.length > 0 && (
                    <div className="pt-4 border-t">
                        <h3 className="text-sm font-semibold mb-4 text-stone-900">
                            Inventario de Variantes
                        </h3>
                        <VariantGenerator
                            config={attributesConfig}
                            form={form}
                            defaultPrice={defaultPrice}
                            defaultStock={defaultStock}
                            existingVariants={isEditMode ? initialVariants : undefined}
                            productId={productId}
                            generalImages={generalImages}
                        />
                    </div>
                )}

                {/* Errores de validación */}
                {form.formState.errors.variants && (
                    <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.variants.message ||
                            "Se requieren variantes válidas para guardar el producto."}
                    </p>
                )}

                {form.formState.errors.root && (
                    <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.root.message}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
