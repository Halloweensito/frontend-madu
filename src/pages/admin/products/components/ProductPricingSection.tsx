
import { type ChangeEvent } from "react";
import { type Control } from "react-hook-form";

import { Input } from "@/components/ui/input";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type { ProductFormData } from "@/types/types";

interface ProductPricingSectionProps {
    control: Control<ProductFormData>;
    hidePricing?: boolean;
}

export function ProductPricingSection({ control, hidePricing = false }: ProductPricingSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Precio y Stock</CardTitle>
                <CardDescription>
                    {hidePricing
                        ? "Gestiona el estado del producto (El precio y stock se gestionan en las variantes)"
                        : "Valores por defecto para las variantes"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Precio y Stock (Visible solo si NO hay variantes) */}
                {!hidePricing && (
                    <>
                        <FormField
                            control={control}
                            name="defaultPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Precio por Defecto ($) *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            placeholder="0.00"
                                            {...field}
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                field.onChange(Number(e.target.value));
                                            }}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="defaultStock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock por Defecto *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            {...field}
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                field.onChange(Number(e.target.value));
                                            }}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}

                {/* Estado del producto */}
                <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estado del Producto</FormLabel>
                            <FormControl>
                                <Select
                                    key={field.value} // 🔑 Force update
                                    value={field.value || 'ACTIVE'}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                                <span>Activo</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="INACTIVE">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                                <span>Inactivo</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="ARCHIVED">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-stone-400" />
                                                <span>Archivado</span>
                                            </div>
                                        </SelectItem>
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
