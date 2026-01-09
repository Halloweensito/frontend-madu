// hooks/useOrders.ts
// Hook para gestión de pedidos (fetching y mutaciones)

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import type { OrderStatus, OrderFilterRequest } from '@/types/order';

const ORDERS_QUERY_KEY = 'orders';
const ORDER_DETAIL_QUERY_KEY = 'order-detail';

/**
 * Hook para obtener lista de pedidos paginada con filtros opcionales
 */
export function useOrders(
    page: number = 0,
    size: number = 10,
    filters?: OrderFilterRequest
) {
    return useQuery({
        queryKey: [ORDERS_QUERY_KEY, page, size, filters],
        queryFn: () => orderService.getOrders(page, size, filters),
        staleTime: 1000 * 60, // 1 minuto
    });
}

/**
 * Hook para obtener detalle completo de un pedido
 */
export function useOrderDetail(orderId: number | null) {
    return useQuery({
        queryKey: [ORDER_DETAIL_QUERY_KEY, orderId],
        queryFn: () => orderService.getOrderById(orderId!),
        enabled: orderId !== null,
        staleTime: 1000 * 30, // 30 segundos
    });
}

/**
 * Hook para actualizar estado de un pedido
 */
export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, status }: { orderId: number; status: OrderStatus }) =>
            orderService.updateOrderStatus(orderId, status),
        onSuccess: () => {
            // Invalidar cache para refrescar lista
            queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [ORDER_DETAIL_QUERY_KEY] });
        },
    });
}
