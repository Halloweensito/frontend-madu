
import { useState } from 'react';
import type { CartItem, ProductResponse } from '@/types/types';
import { productService } from '@/services/productService';

interface ValidationResult {
    isValid: boolean;
    hasPriceChanges: boolean;
    hasStockIssues: boolean;
    updatedItems: CartItem[];
    messages: string[];
}

export function useCartValidation() {
    const [isValidating, setIsValidating] = useState(false);

    const validateCart = async (cartItems: CartItem[]): Promise<ValidationResult> => {
        setIsValidating(true);
        const messages: string[] = [];
        const uniqueSlugs = Array.from(new Set(cartItems.map(item => item.productSlug)));

        // Mapa para acceso rápido a la info actualizada
        const productMap = new Map<string, ProductResponse>();
        const updatedItems = [...cartItems];
        let hasPriceChanges = false;
        let hasStockIssues = false;

        try {
            // 1. Fetch de datos frescos (Parallel)
            const requests = uniqueSlugs.map(slug =>
                productService.getProductBySlug(slug)
                    .then(product => ({ slug, product, error: null }))
                    .catch(error => ({ slug, product: null, error }))
            );

            const results = await Promise.all(requests);

            results.forEach(({ slug, product }) => {
                if (product) {
                    productMap.set(slug, product);
                }
            });

            // 2. Validación item por item
            for (let i = 0; i < updatedItems.length; i++) {
                const item = updatedItems[i];
                const product = productMap.get(item.productSlug);

                // A. Producto ya no existe o está inactivo
                if (!product || product.status === 'ARCHIVED' || product.status === 'INACTIVE') {
                    hasStockIssues = true;
                    messages.push(`❌ "${item.productName}" ya no está disponible y fue removido.`);
                    updatedItems[i] = { ...item, quantity: 0 }; // Marcar para eliminar
                    continue;
                }

                // B. Buscar variante
                const variant = product.variants.find(v => v.id === item.variantId);

                if (!variant) {
                    hasStockIssues = true;
                    messages.push(`❌ La variante seleccionada de "${item.productName}" ya no existe.`);
                    updatedItems[i] = { ...item, quantity: 0 };
                    continue;
                }

                // C. Validar Precio
                if (variant.price !== item.price) {
                    hasPriceChanges = true;
                    messages.push(`⚠️ Precio de "${item.productName}" cambió de $${item.price} a $${variant.price}.`);
                    updatedItems[i] = { ...item, price: variant.price };
                }

                // D. Validar Stock
                if (variant.stock < item.quantity) {
                    hasStockIssues = true;
                    if (variant.stock === 0) {
                        messages.push(`❌ "${item.productName}" se agotó (Stock: 0).`);
                        updatedItems[i] = { ...item, quantity: 0 };
                    } else {
                        messages.push(`⚠️ Stock insuficiente para "${item.productName}". Ajustado a ${variant.stock} unidades.`);
                        updatedItems[i] = { ...item, quantity: variant.stock };
                    }
                }
            }

            // Filtrar items eliminados (cantidad 0)
            const finalItems = updatedItems.filter(item => item.quantity > 0);

            return {
                isValid: !hasPriceChanges && !hasStockIssues && finalItems.length === cartItems.length,
                hasPriceChanges,
                hasStockIssues,
                updatedItems: finalItems,
                messages
            };

        } catch (error) {
            console.error("Error validando carrito:", error);
            // En caso de error de red grave, asumimos válido para no bloquear, o devolvemos error
            // Para este caso, lanzamos error
            throw error;
        } finally {
            setIsValidating(false);
        }
    };

    return { validateCart, isValidating };
}
