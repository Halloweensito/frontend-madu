// services/orderService.ts - Servicio para gestión de pedidos

import { http } from './http';
import type {
    OrderRequest,
    OrderResponse,
    OrderSummaryResponse,
    OrderStatus,
    OrderFilterRequest
} from '@/types/order';

interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export const orderService = {
    /**
     * POST /api/public/orders - Crear pedido (público)
     */
    createOrder: (request: OrderRequest) =>
        http<OrderResponse>('/public/orders', {
            method: 'POST',
            body: JSON.stringify(request),
        }),

    /**
     * GET /api/admin/orders/{id} - Obtener detalle de un pedido
     */
    getOrderById: (orderId: number) =>
        http<OrderResponse>(`/admin/orders/${orderId}`),

    /**
     * GET /api/admin/orders - Listar pedidos con filtros opcionales
     */
    getOrders: (
        page: number = 0,
        size: number = 10,
        filters?: OrderFilterRequest
    ) => {
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('size', String(size));

        // Agregar filtros si existen
        if (filters) {
            if (filters.status) params.append('status', filters.status);
            if (filters.orderNumber) params.append('orderNumber', filters.orderNumber);
            if (filters.customerName) params.append('customerName', filters.customerName);
            if (filters.customerPhone) params.append('customerPhone', filters.customerPhone);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
        }

        return http<PaginatedResponse<OrderSummaryResponse>>(`/admin/orders?${params.toString()}`);
    },

    /**
     * PATCH /api/admin/orders/{id}/status - Cambiar estado de pedido
     */
    updateOrderStatus: (orderId: number, status: OrderStatus) =>
        http<void>(`/admin/orders/${orderId}/status?status=${status}`, {
            method: 'PATCH',
        }),
};
