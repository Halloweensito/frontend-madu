// hooks/useCartCheckout.ts
// Hook que encapsula toda la lógica de checkout del carrito

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useCartStore } from '@/stores/cartStore';
import { useCartValidation } from '@/hooks/useCartValidation';
import { usePublicSiteSettings } from '@/hooks/useSiteSettings';
import { orderService } from '@/services/orderService';
import { openWhatsApp } from '@/utils/whatsapp';
import type { OrderRequest, ShippingMethod, PaymentMethod } from '@/types/order';
import { SHIPPING_METHOD_LABELS, PAYMENT_METHOD_LABELS } from '@/types/order';

export type CheckoutStep = 'cart' | 'form';

export interface CustomerData {
    customerName: string;
    customerPhone: string;
    customerNote: string;
    shippingMethod: ShippingMethod;
    shippingAddress: string;
    shippingNote: string;
    shippingReferences: string; // Solo frontend (WhatsApp)
    paymentMethod: PaymentMethod;
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

/**
 * Extrae el número de teléfono de una URL de WhatsApp
 * Soporta formatos: https://wa.me/5491234567890 o solo el número
 */
function extractWhatsAppNumber(whatsappUrl: string | null | undefined): string | null {
    if (!whatsappUrl) return null;

    // Si ya es un número, retornarlo
    if (/^\d+$/.test(whatsappUrl.trim())) {
        return whatsappUrl.trim();
    }

    // Extraer de URL wa.me
    const waMatch = whatsappUrl.match(/wa\.me\/(\d+)/);
    if (waMatch) return waMatch[1];

    // Extraer de URL api.whatsapp.com
    const apiMatch = whatsappUrl.match(/api\.whatsapp\.com\/send\?phone=(\d+)/);
    if (apiMatch) return apiMatch[1];

    // Fallback: extraer cualquier secuencia de dígitos
    const digits = whatsappUrl.replace(/\D/g, '');
    return digits.length >= 8 ? digits : null;
}

export function useCartCheckout(): UseCartCheckoutReturn {
    const navigate = useNavigate();
    const { items, setItems, clearCart, closeCart } = useCartStore();
    const { validateCart, isValidating } = useCartValidation();
    const { data: siteSettings } = usePublicSiteSettings();

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
     * Construye el mensaje personalizado para WhatsApp con toda la info del pedido
     */
    const buildOrderMessage = (orderNumber: string, customerData: CustomerData): string => {
        let message = `🛒 *Pedido #${orderNumber}*\n\n`;

        // Info del cliente
        message += `👤 *Cliente:* ${customerData.customerName}\n`;
        message += `📱 *Teléfono:* ${customerData.customerPhone}\n\n`;

        // Método de entrega
        message += `📦 *Entrega:* ${SHIPPING_METHOD_LABELS[customerData.shippingMethod]}\n`;

        if (customerData.shippingMethod === 'DELIVERY') {
            message += `📍 *Dirección:* ${customerData.shippingAddress}\n`;
            if (customerData.shippingReferences) {
                message += `🗺️ *Referencias:* ${customerData.shippingReferences}\n`;
            }
            if (customerData.shippingNote) {
                message += `📝 *Nota de envío:* ${customerData.shippingNote}\n`;
            }
        }

        // Método de pago
        message += `\n💳 *Pago:* ${PAYMENT_METHOD_LABELS[customerData.paymentMethod]}\n`;

        // Nota adicional
        if (customerData.customerNote) {
            message += `\n📋 *Nota:* ${customerData.customerNote}\n`;
        }

        return message;
    };

    /**
     * Crea el pedido en el backend y abre WhatsApp
     */
    const handleCreateOrder = async (customerData: CustomerData) => {
        // Obtener número de WhatsApp dinámicamente desde settings
        const whatsappNumber = extractWhatsAppNumber(siteSettings?.whatsappUrl)
            || extractWhatsAppNumber(siteSettings?.phone);

        if (!whatsappNumber) {
            toast.error("Error de configuración", {
                description: "No hay número de WhatsApp configurado. Contacta al administrador."
            });
            return;
        }

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
                customerNote: customerData.customerNote || undefined,
                shippingMethod: customerData.shippingMethod,
                shippingAddress: customerData.shippingAddress || undefined,
                shippingNote: customerData.shippingNote || undefined,
                paymentMethod: customerData.paymentMethod
            };

            const order = await orderService.createOrder(orderRequest);

            // Construir mensaje completo con info del pedido
            const orderMessage = buildOrderMessage(order.orderNumber, customerData);

            openWhatsApp(
                whatsappNumber,
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
