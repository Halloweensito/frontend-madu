// hooks/useCartCheckout.ts
// Hook que encapsula toda la lógica de checkout del carrito

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useCartStore } from '@/stores/cartStore';
import { useCartValidation } from '@/hooks/useCartValidation';
import { orderService } from '@/services/orderService';
import { openWhatsApp } from '@/utils/whatsapp';
import { WHATSAPP_CONFIG } from '@/config/whatsapp';
import type { OrderRequest } from '@/types/order';

export type CheckoutStep = 'cart' | 'form';

export interface CustomerData {
    customerName: string;
    customerPhone: string;
    customerNote: string;
}

export interface UseCartCheckoutReturn {
    // Estado
    checkoutStep: CheckoutStep;
    validationErrors: string[];
    isValidating: boolean;
    isCreatingOrder: boolean;

    // Handlers
    handleCheckout: () => Promise<void>;
    handleCreateOrder: (customerData: CustomerData) => Promise<void>;
    handleGoToShop: () => void;
    handleBackToCart: () => void;
}

export function useCartCheckout(): UseCartCheckoutReturn {
    const navigate = useNavigate();
    const { items, setItems, clearCart, closeCart } = useCartStore();
    const { validateCart, isValidating } = useCartValidation();

    const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);

    /**
     * Valida el carrito y avanza al formulario si todo está bien
     */
    const handleCheckout = async () => {
        if (items.length === 0) return;
        setValidationErrors([]);

        try {
            const result = await validateCart(items);

            if (!result.isValid) {
                setItems(result.updatedItems);

                if (result.hasStockIssues) {
                    toast.error("Atención: Algunos productos no tienen stock suficiente.", {
                        description: "Tu carrito ha sido actualizado con el stock disponible.",
                        duration: 5000,
                    });
                }

                if (result.hasPriceChanges) {
                    toast.warning("Atención: Algunos precios han cambiado.", {
                        description: "Revisa los nuevos totales antes de continuar.",
                        duration: 5000,
                    });
                }

                if (result.messages.length > 0) {
                    setValidationErrors(result.messages);
                }

                return;
            }

            // Stock válido → mostrar formulario de checkout
            setCheckoutStep('form');

        } catch (error) {
            toast.error("Error al validar el carrito. Inténtalo de nuevo.");
            setValidationErrors(["Error de conexión o validación. Intenta nuevamente."]);
        }
    };

    /**
     * Crea el pedido en el backend y abre WhatsApp
     */
    const handleCreateOrder = async (customerData: CustomerData) => {
        setIsCreatingOrder(true);

        try {
            const orderRequest: OrderRequest = {
                items: items.map(item => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity
                })),
                customerName: customerData.customerName,
                customerPhone: customerData.customerPhone,
                customerNote: customerData.customerNote || undefined
            };

            const order = await orderService.createOrder(orderRequest);

            // Pedido creado → abrir WhatsApp con número de pedido
            const orderMessage = `🛒 *Pedido #${order.orderNumber}*\n\n${WHATSAPP_CONFIG.customMessage || ''}`;
            openWhatsApp(
                WHATSAPP_CONFIG.phoneNumber,
                items,
                orderMessage
            );

            toast.success(`Pedido #${order.orderNumber} creado`, {
                description: 'Te contactaremos pronto por WhatsApp'
            });

            clearCart();
            setCheckoutStep('cart');
            closeCart();

        } catch (error) {
            toast.error("Error al crear el pedido", {
                description: "Por favor intenta nuevamente"
            });
        } finally {
            setIsCreatingOrder(false);
        }
    };

    /**
     * Navega a la tienda y cierra el carrito
     */
    const handleGoToShop = () => {
        closeCart();
        navigate('/productos');
    };

    /**
     * Vuelve del formulario a la vista del carrito
     */
    const handleBackToCart = () => {
        setCheckoutStep('cart');
    };

    return {
        checkoutStep,
        validationErrors,
        isValidating,
        isCreatingOrder,
        handleCheckout,
        handleCreateOrder,
        handleGoToShop,
        handleBackToCart,
    };
}
