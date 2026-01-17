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
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle>Opciones del producto</CardTitle>
                <CardDescription>
                    Agregá opciones como color o talle para crear variantes del producto.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Constructor de Atributos */}
                {isLoadingAttributes ? (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
                        <span className="ml-2 text-sm text-stone-500">Cargando opciones disponibles...</span>
                    </div>
                ) : attributesError ? (
                    <div className="flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 rounded-md">
                        <AlertCircle className="h-4 w-4" />
                        <span>Error al cargar opciones. Por favor, recargá la página.</span>
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
                    <div className="pt-4 border-t -mx-6">
                        <div className="px-6">
                            <h3 className="text-sm font-semibold mb-2 text-stone-900">
                                Variantes del producto
                            </h3>
                            <p className="text-sm text-stone-500 mb-3">
                                Cada combinación de opciones crea una variante.
                            </p>
                        </div>
                        <div className="min-w-0">
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
