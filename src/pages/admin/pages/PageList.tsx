// pages/admin/pages/PageList.tsx
// Listado de páginas con acciones CRUD

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAdminPages, useDeletePage } from '@/hooks/usePageContent';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PageList() {
    const { data: pages, isLoading } = useAdminPages();
    const deleteMutation = useDeletePage();
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        try {
            await deleteMutation.mutateAsync(id);
            toast.success('Página eliminada');
        } catch (error) {
            toast.error('Error al eliminar página');
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header - stack en móvil */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Páginas</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                        Gestiona el contenido de páginas estáticas
                    </p>
                </div>
                <Button asChild className="w-full sm:w-auto">
                    <Link to="/admin/paginas/nueva">
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Página
                    </Link>
                </Button>
            </div>

            {/* Lista */}
            {!pages || pages.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">No hay páginas creadas</p>
                    <Button asChild variant="outline">
                        <Link to="/admin/paginas/nueva">Crear primera página</Link>
                    </Button>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {pages.map((page) => (
                        <Card key={page.id} className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <h3 className="text-base sm:text-lg font-semibold truncate">{page.title}</h3>
                                        {page.published ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                                <Eye className="h-3 w-3" />
                                                <span className="hidden xs:inline">Publicada</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                                                <EyeOff className="h-3 w-3" />
                                                <span className="hidden xs:inline">Borrador</span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                        <span className="font-mono">/{page.slug}</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Actualizada: {new Date(page.updatedAt).toLocaleDateString('es-AR')}
                                    </p>
                                </div>

                                <div className="flex gap-2 self-end sm:self-start">
                                    <Button asChild variant="outline" size="sm">
                                        <Link to={`/admin/paginas/${page.id}`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={deletingId === page.id}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>¿Eliminar página?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta acción no se puede deshacer. Se eliminará permanentemente la página <strong>"{page.title}"</strong>.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-red-600 hover:bg-red-700"
                                                    onClick={() => handleDelete(page.id)}
                                                >
                                                    Eliminar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
