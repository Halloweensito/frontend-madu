// pages/admin/orders/components/OrderStatusSelector.tsx
// Selector de estado para actualizar pedidos

import { useState } from 'react';
import { Loader2, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    OrderStatus,
    ORDER_STATUS_LABELS,
    ORDER_STATUS_COLORS
} from '@/types/order';

interface OrderStatusSelectorProps {
    currentStatus: OrderStatus;
    onStatusChange: (newStatus: OrderStatus) => Promise<void>;
    disabled?: boolean;
}

const STATUS_OPTIONS: OrderStatus[] = Object.values(OrderStatus);

export function OrderStatusSelector({
    currentStatus,
    onStatusChange,
    disabled = false
}: OrderStatusSelectorProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleSelect = async (status: OrderStatus) => {
        if (status === currentStatus || isUpdating) return;

        setIsUpdating(true);
        try {
            await onStatusChange(status);
        } finally {
            setIsUpdating(false);
        }
    };

    const currentLabel = ORDER_STATUS_LABELS[currentStatus];
    const currentColor = ORDER_STATUS_COLORS[currentStatus];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={disabled || isUpdating}
                    className={`${currentColor} border-0 min-w-[120px] justify-between`}
                >
                    {isUpdating ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                        <>
                            {currentLabel}
                            <ChevronDown className="ml-2 h-3 w-3" />
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {STATUS_OPTIONS.map((status) => (
                    <DropdownMenuItem
                        key={status}
                        onClick={() => handleSelect(status)}
                        className="flex items-center justify-between"
                    >
                        <span className={ORDER_STATUS_COLORS[status].replace('bg-', 'text-').split(' ')[1]}>
                            {ORDER_STATUS_LABELS[status]}
                        </span>
                        {status === currentStatus && (
                            <Check className="h-4 w-4 ml-2" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
