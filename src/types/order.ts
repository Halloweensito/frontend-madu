// types/order.ts - Tipos para el sistema de pedidos

// ==================== ENUMS ====================

export const OrderStatus = {
    CREATED: 'CREATED',
    SENT: 'SENT',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED'
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

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
    subtotal: number;
    total: number;
    createdAt: string;
    updatedAt: string;
    items: OrderItemResponse[];
}

// ==================== UI HELPERS ====================

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    CREATED: 'Creado',
    SENT: 'Enviado a WA',
    CONFIRMED: 'Confirmado',
    CANCELLED: 'Cancelado',
    COMPLETED: 'Completado'
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
    CREATED: 'bg-stone-100 text-stone-800',
    SENT: 'bg-blue-100 text-blue-800',
    CONFIRMED: 'bg-indigo-100 text-indigo-800',
    CANCELLED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-green-100 text-green-800'
};
