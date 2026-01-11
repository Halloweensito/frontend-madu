// types/order.ts - Tipos para el sistema de pedidos

// ==================== ENUMS ====================

export const OrderStatus = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    SHIPPED: 'SHIPPED',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED'
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const ShippingMethod = {
    PICKUP: 'PICKUP',
    DELIVERY: 'DELIVERY'
} as const;

export type ShippingMethod = typeof ShippingMethod[keyof typeof ShippingMethod];

export const PaymentMethod = {
    CASH: 'CASH',
    BANK_TRANSFER: 'BANK_TRANSFER',
    CREDIT_CARD: 'CREDIT_CARD',
    DEBIT_CARD: 'DEBIT_CARD',
    MERCADOPAGO: 'MERCADOPAGO'
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

// ==================== REQUEST DTOs ====================

export interface OrderItemRequest {
    productId: number;
    variantId: number;
    quantity: number;
}

export interface OrderRequest {
    items: OrderItemRequest[];
    customerName: string;
    customerPhone: string;
    customerNote?: string;
    shippingMethod: ShippingMethod;
    shippingAddress?: string;
    shippingNote?: string;
    paymentMethod: PaymentMethod;
}

/**
 * Filtros para búsqueda de pedidos (GET /admin/orders)
 */
export interface OrderFilterRequest {
    status?: OrderStatus;
    orderNumber?: string;
    customerName?: string;
    customerPhone?: string;
    startDate?: string; // ISO date string
    endDate?: string;   // ISO date string
}

// ==================== RESPONSE DTOs ====================

/**
 * Item de pedido (usado en OrderResponse)
 */
export interface OrderItemResponse {
    id: number;
    productId: number;
    variantId: number;
    productName: string;
    sku: string;
    attributes: string; // Ej: "Color: Negro, Talle: M"
    price: number;
    quantity: number;
    total: number;
}

/**
 * Respuesta resumida para lista de pedidos (GET /admin/orders)
 */
export interface OrderSummaryResponse {
    id: number;
    orderNumber: string;
    status: OrderStatus;
    total: number;
    customerName: string;
    paymentMethod: PaymentMethod;
    itemsCount: number;
    createdAt: string; // ISO date string
}

/**
 * Respuesta completa de pedido (POST /public/orders, GET /admin/orders/{id})
 */
export interface OrderResponse {
    id: number;
    orderNumber: string;
    status: OrderStatus;
    customerName: string;
    customerPhone: string;
    customerNote?: string;
    shippingMethod: ShippingMethod;
    shippingAddress?: string;
    shippingNote?: string;
    paymentMethod: PaymentMethod;
    subtotal: number;
    total: number;
    createdAt: string;
    updatedAt: string;
    items: OrderItemResponse[];
}

// ==================== UI HELPERS ====================

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmado',
    SHIPPED: 'Enviado',
    CANCELLED: 'Cancelado',
    COMPLETED: 'Completado'
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
    PENDING: 'bg-amber-100 text-amber-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    CANCELLED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-green-100 text-green-800'
};

export const SHIPPING_METHOD_LABELS: Record<ShippingMethod, string> = {
    PICKUP: 'Retiro en tienda',
    DELIVERY: 'Envío a domicilio'
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
    CASH: 'Efectivo',
    BANK_TRANSFER: 'Transferencia',
    CREDIT_CARD: 'Tarjeta de Crédito',
    DEBIT_CARD: 'Tarjeta de Débito',
    MERCADOPAGO: 'MercadoPago'
};
