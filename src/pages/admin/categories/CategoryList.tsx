// pages/admin/categories/CategoryList.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { categoryService } from '@/services/categoryService';
import { useCategories } from '@/hooks/useCatalog';
import type { CategoryResponse } from '@/types/types';
import { Status } from '@/types/types';

export default function CategoryList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data: categories, isLoading, error } = useCategories();

    const deleteMutation = useMutation({
        mutationFn: categoryService.deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Categoría eliminada exitosamente');
            setDeleteId(null);
        },
        onError: (error: Error) => {
            toast.error(`Error al eliminar categoría: ${error.message}`);
        },
    });

    const getStatusBadge = (status: Status) => {
        const styles = {
            [Status.ACTIVE]: 'bg-green-50 text-green-700',
            [Status.ARCHIVED]: 'bg-stone-100 text-stone-600',
            [Status.INACTIVE]: 'bg-yellow-50 text-yellow-700',
        };
        const labels = {
            [Status.ACTIVE]: 'Activa',
            [Status.ARCHIVED]: 'Archivada',
            [Status.INACTIVE]: 'Inactiva',
        };
        return (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || styles[Status.INACTIVE]}`}>
                {labels[status] || 'Inactiva'}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-96 items-center justify-center text-destructive">
                Error al cargar categorías
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header - responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                        Categorías
                    </h1>
                    <p className="text-stone-500 text-sm sm:text-base">
                        Gestiona las categorías de productos
                    </p>
                </div>
                <Button onClick={() => navigate('/admin/categorias/nueva')} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Categoría
                </Button>
            </div>

            {/* Vista móvil: Cards */}
            <div className="block sm:hidden space-y-3">
                {categories && categories.length > 0 ? (
                    categories.map((category: CategoryResponse) => (
                        <Card key={category.id} className="p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-medium text-sm truncate">{category.name}</h3>
                                        {getStatusBadge(category.status ?? Status.ACTIVE)}
                                    </div>
                                    <p className="text-xs text-stone-500 font-mono truncate">/{category.slug}</p>
                                    {((category as any).parentName || category.parentId) && (
                                        <p className="text-xs text-stone-400 mt-1">
                                            Padre: {(category as any).parentName || category.parentId}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => navigate(`/admin/categorias/editar/${category.id}`)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setDeleteId(category.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="p-8 text-center text-stone-500">
                        No hay categorías creadas
                    </Card>
                )}
            </div>

            {/* Vista desktop: Table */}
            <div className="hidden sm:block rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Padre</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories && categories.length > 0 ? (
                            categories.map((category: CategoryResponse) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell className="text-stone-500">{category.slug}</TableCell>
                                    <TableCell className="text-stone-500">
                                        {(category as any).parentName || category.parentId || '-'}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(category.status ?? Status.ACTIVE)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    navigate(`/admin/categorias/editar/${category.id}`)
                                                }
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeleteId(category.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-stone-500">
                                    No hay categorías creadas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la categoría.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
