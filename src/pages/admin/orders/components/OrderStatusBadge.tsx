// pages/admin/orders/components/OrderStatusBadge.tsx
// Componente de presentación para mostrar el estado de un pedido

import { Badge } from '@/components/ui/badge';
import {
    OrderStatus,
    ORDER_STATUS_LABELS,
    ORDER_STATUS_COLORS
} from '@/types/order';

interface OrderStatusBadgeProps {
    status: OrderStatus;
    className?: string;
}

export function OrderStatusBadge({ status, className = '' }: OrderStatusBadgeProps) {
    const label = ORDER_STATUS_LABELS[status] || status;
    const colorClass = ORDER_STATUS_COLORS[status] || 'bg-stone-100 text-stone-800';

    return (
        <Badge
            variant="outline"
            className={`${colorClass} border-0 font-medium ${className}`}
        >
            {label}
        </Badge>
    );
}
