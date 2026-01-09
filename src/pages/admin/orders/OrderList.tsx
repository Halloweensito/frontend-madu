// pages/admin/orders/OrderList.tsx
// Página principal de gestión de pedidos con filtros

import { useState, useMemo } from 'react';
import { Loader2, AlertCircle, Package, RefreshCw, Eye, MoreHorizontal, Calendar, ShoppingBag, Search, Filter, X } from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { OrderStatusBadge } from './components';
import type { OrderSummaryResponse, OrderStatus, OrderFilterRequest } from '@/types/order';
import { ORDER_STATUS_LABELS, OrderStatus as OrderStatusEnum } from '@/types/order';

// Helper para formatear fecha
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatShortDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
    });
}

// Dialog de detalle de pedido (resumen)
function OrderDetailDialog({
    order,
    open,
    onOpenChange
}: {
    order: OrderSummaryResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    if (!order) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Pedido #{order.orderNumber}
                    </DialogTitle>
                    <DialogDescription>
                        Resumen del pedido
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-stone-500">Fecha</span>
                            <p className="font-medium">{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                            <span className="text-stone-500">Estado</span>
                            <p className="font-medium mt-1">
                                <OrderStatusBadge status={order.status} />
                            </p>
                        </div>
                        <div>
                            <span className="text-stone-500">Cliente</span>
                            <p className="font-medium">{order.customerName}</p>
                        </div>
                        <div>
                            <span className="text-stone-500">Productos</span>
                            <p className="font-medium">{order.itemsCount} items</p>
                        </div>
                    </div>
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-medium">Total</span>
                            <span className="text-xl font-bold">
                                ${order.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Card móvil
function MobileOrderCard({
    order,
    onStatusChange,
    onViewDetail
}: {
    order: OrderSummaryResponse;
    onStatusChange: (orderId: number, status: OrderStatus) => Promise<void>;
    onViewDetail: (order: OrderSummaryResponse) => void;
}) {
    return (
        <Card className="p-4">
            <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <span className="font-mono font-semibold text-sm">#{order.orderNumber}</span>
                        <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                            <Calendar className="h-3 w-3" />
                            {formatShortDate(order.createdAt)}
                        </div>
                    </div>
                    <OrderStatusBadge status={order.status} />
                </div>

                {/* Cliente */}
                <div className="text-sm">
                    <p className="font-medium">{order.customerName}</p>
                    <div className="flex items-center gap-1 text-stone-500">
                        <ShoppingBag className="h-3 w-3" />
                        {order.itemsCount} productos
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <span className="text-lg font-semibold">
                        ${order.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>

                    {/* Acciones */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onViewDetail(order)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalle
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Cambiar estado
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuRadioGroup value={order.status} onValueChange={(v) => onStatusChange(order.id, v as OrderStatus)}>
                                        {Object.values(OrderStatusEnum).map((status) => (
                                            <DropdownMenuRadioItem key={status} value={status}>
                                                {ORDER_STATUS_LABELS[status]}
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </Card>
    );
}

// Componente de filtros
function OrderFilters({
    filters,
    onFiltersChange,
    onClear
}: {
    filters: OrderFilterRequest;
    onFiltersChange: (filters: OrderFilterRequest) => void;
    onClear: () => void;
}) {
    const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

    return (
        <Collapsible>
            <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filtros
                        {hasActiveFilters && (
                            <span className="ml-1 bg-stone-900 text-white text-xs rounded-full px-1.5 py-0.5">
                                !
                            </span>
                        )}
                    </Button>
                </CollapsibleTrigger>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={onClear} className="text-stone-500">
                        <X className="h-4 w-4 mr-1" />
                        Limpiar
                    </Button>
                )}
            </div>
            <CollapsibleContent className="mt-4">
                <Card className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Estado */}
                        <div className="space-y-2">
                            <Label htmlFor="status-filter">Estado</Label>
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(value) =>
                                    onFiltersChange({ ...filters, status: value === 'all' ? undefined : value as OrderStatus })
                                }
                            >
                                <SelectTrigger id="status-filter">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {Object.values(OrderStatusEnum).map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {ORDER_STATUS_LABELS[status]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Buscar cliente */}
                        <div className="space-y-2">
                            <Label htmlFor="customer-filter">Cliente</Label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-400" />
                                <Input
                                    id="customer-filter"
                                    placeholder="Nombre..."
                                    className="pl-8"
                                    value={filters.customerName || ''}
                                    onChange={(e) =>
                                        onFiltersChange({ ...filters, customerName: e.target.value || undefined })
                                    }
                                />
                            </div>
                        </div>

                        {/* Fecha desde */}
                        <div className="space-y-2">
                            <Label htmlFor="start-date">Desde</Label>
                            <Input
                                id="start-date"
                                type="date"
                                value={filters.startDate || ''}
                                onChange={(e) =>
                                    onFiltersChange({ ...filters, startDate: e.target.value || undefined })
                                }
                            />
                        </div>

                        {/* Fecha hasta */}
                        <div className="space-y-2">
                            <Label htmlFor="end-date">Hasta</Label>
                            <Input
                                id="end-date"
                                type="date"
                                value={filters.endDate || ''}
                                onChange={(e) =>
                                    onFiltersChange({ ...filters, endDate: e.target.value || undefined })
                                }
                            />
                        </div>
                    </div>
                </Card>
            </CollapsibleContent>
        </Collapsible>
    );
}

export default function OrderList() {
    const [filters, setFilters] = useState<OrderFilterRequest>({});
    const [selectedOrder, setSelectedOrder] = useState<OrderSummaryResponse | null>(null);

    // Usamos useMemo para evitar re-renders innecesarios
    const activeFilters = useMemo(() => {
        const clean: OrderFilterRequest = {};
        if (filters.status) clean.status = filters.status;
        if (filters.customerName) clean.customerName = filters.customerName;
        if (filters.startDate) clean.startDate = filters.startDate;
        if (filters.endDate) clean.endDate = filters.endDate;
        return Object.keys(clean).length > 0 ? clean : undefined;
    }, [filters]);

    const { data: ordersData, isLoading, error, refetch, isRefetching } = useOrders(0, 20, activeFilters);
    const updateStatus = useUpdateOrderStatus();

    const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
        try {
            await updateStatus.mutateAsync({ orderId, status: newStatus });
            toast.success('Estado actualizado');
        } catch {
            toast.error('Error al actualizar estado');
        }
    };

    const handleClearFilters = () => {
        setFilters({});
    };

    const orders = ordersData?.content || [];

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                        Pedidos
                    </h1>
                    <p className="text-stone-500 text-sm sm:text-base">
                        Gestiona y actualiza el estado de los pedidos.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => refetch()}
                    disabled={isRefetching}
                    className="w-full sm:w-auto"
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                    Actualizar
                </Button>
            </div>

            {/* Filtros */}
            <OrderFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClear={handleClearFilters}
            />

            {/* Estado de carga */}
            {isLoading && (
                <div className="bg-white rounded-md border border-stone-200 shadow-sm p-12 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
                        <p className="text-sm text-stone-500">Cargando pedidos...</p>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-white rounded-md border border-red-200 shadow-sm p-12 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                        <p className="text-sm text-red-600">
                            Error al cargar los pedidos. Por favor, intenta nuevamente.
                        </p>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && orders.length === 0 && (
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <Package className="h-12 w-12 text-stone-300" />
                        <div>
                            <h3 className="font-medium text-stone-900">
                                {activeFilters ? 'No hay resultados' : 'No hay pedidos'}
                            </h3>
                            <p className="text-sm text-stone-500 mt-1">
                                {activeFilters
                                    ? 'Intenta con otros filtros de búsqueda.'
                                    : 'Los pedidos aparecerán aquí cuando los clientes compren.'}
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Vista móvil: Cards */}
            {!isLoading && !error && orders.length > 0 && (
                <div className="block sm:hidden space-y-3">
                    {orders.map((order) => (
                        <MobileOrderCard
                            key={order.id}
                            order={order}
                            onStatusChange={handleStatusChange}
                            onViewDetail={setSelectedOrder}
                        />
                    ))}
                </div>
            )}

            {/* Vista desktop: Tabla */}
            {!isLoading && !error && orders.length > 0 && (
                <div className="hidden sm:block bg-white rounded-md border border-stone-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">Pedido</TableHead>
                                <TableHead className="w-[100px]">Fecha</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead className="w-[90px] text-center">Items</TableHead>
                                <TableHead className="text-right w-[100px]">Total</TableHead>
                                <TableHead className="w-[130px]">Estado</TableHead>
                                <TableHead className="w-[80px] text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono font-medium">
                                        #{order.orderNumber}
                                    </TableCell>
                                    <TableCell className="text-sm text-stone-600">
                                        {formatShortDate(order.createdAt)}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {order.customerName}
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                        {order.itemsCount}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        ${order.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell>
                                        <OrderStatusBadge status={order.status} />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Ver detalle
                                                </DropdownMenuItem>
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger>
                                                        <RefreshCw className="mr-2 h-4 w-4" />
                                                        Cambiar estado
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuRadioGroup value={order.status} onValueChange={(v) => handleStatusChange(order.id, v as OrderStatus)}>
                                                            {Object.values(OrderStatusEnum).map((status) => (
                                                                <DropdownMenuRadioItem key={status} value={status}>
                                                                    {ORDER_STATUS_LABELS[status]}
                                                                </DropdownMenuRadioItem>
                                                            ))}
                                                        </DropdownMenuRadioGroup>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuSub>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Dialog de detalle */}
            <OrderDetailDialog
                order={selectedOrder}
                open={!!selectedOrder}
                onOpenChange={(open) => !open && setSelectedOrder(null)}
            />
        </div>
    );
}
