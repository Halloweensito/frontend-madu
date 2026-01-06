// pages/admin/home/HomeEditor.tsx
// Main page for managing home sections

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Loader2,
    AlertCircle,
    GripVertical,
    Pencil,
    Trash2,
    EyeOff,
    LayoutTemplate,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
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

import {
    useAdminHomeSections,
    useArchiveHomeSection,
} from '@/hooks/useHome';
import type { HomeSectionResponse } from '@/types/homeSection';
import { SectionType } from '@/types/homeSection';

// Configuración visual por tipo de sección
const sectionTypeConfig: Record<SectionType, { label: string; color: string }> = {
    HERO: { label: 'Hero', color: 'bg-purple-100 text-purple-800' },
    CATEGORIES: { label: 'Categorías', color: 'bg-blue-100 text-blue-800' },
    FEATURED_PRODUCTS: { label: 'Productos Destacados', color: 'bg-green-100 text-green-800' },
    BANNER: { label: 'Banner', color: 'bg-orange-100 text-orange-800' },
    TEXT_BLOCK: { label: 'Texto', color: 'bg-stone-100 text-stone-800' },
};

export default function HomeEditor() {
    const navigate = useNavigate();
    const { data: sections, isLoading, error } = useAdminHomeSections();
    const archiveMutation = useArchiveHomeSection();

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);

        try {
            await archiveMutation.mutateAsync(deleteId);
            toast.success('Sección eliminada exitosamente');
            setDeleteId(null);
        } catch (error) {
            toast.error('Error al eliminar la sección');
        } finally {
            setIsDeleting(false);
        }
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="flex h-96 flex-col items-center justify-center gap-4 text-destructive">
                <AlertCircle className="h-10 w-10" />
                <p>Error al cargar las secciones</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                        Editor del Home
                    </h1>
                    <p className="text-stone-500">
                        Gestiona las secciones que aparecen en tu página principal
                    </p>
                </div>
                <Button onClick={() => navigate('/admin/home/nueva')}>
                    <Plus className="mr-2 h-4 w-4" /> Nueva Sección
                </Button>
            </div>

            {/* Empty State */}
            {(!sections || sections.length === 0) && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <LayoutTemplate className="h-12 w-12 text-stone-300 mb-4" />
                        <h3 className="text-lg font-medium text-stone-900 mb-2">
                            No hay secciones configuradas
                        </h3>
                        <p className="text-stone-500 text-center mb-4">
                            Crea tu primera sección para personalizar el Home de tu tienda
                        </p>
                        <Button onClick={() => navigate('/admin/home/nueva')}>
                            <Plus className="mr-2 h-4 w-4" /> Crear Primera Sección
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Sections List */}
            {sections && sections.length > 0 && (
                <div className="space-y-3">
                    {sections.map((section) => (
                        <SectionCard
                            key={section.id}
                            section={section}
                            onEdit={() => navigate(`/admin/home/editar/${section.id}`)}
                            onDelete={() => setDeleteId(section.id)}
                        />
                    ))}
                </div>
            )}

            {/* Delete Confirmation */}
            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar esta sección?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción desactivará la sección y ya no aparecerá en el Home.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                        >
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// Componente para cada sección en la lista
function SectionCard({
    section,
    onEdit,
    onDelete,
}: {
    section: HomeSectionResponse;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const config = sectionTypeConfig[section.type] || sectionTypeConfig.TEXT_BLOCK;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-4">
                {/* Drag Handle (visual, no funcional aún) */}
                <div className="cursor-grab text-stone-300 hover:text-stone-500">
                    <GripVertical className="h-5 w-5" />
                </div>

                {/* Preview Image */}
                {section.imageUrl ? (
                    <img
                        src={section.imageUrl}
                        alt={section.title || 'Sección'}
                        className="w-16 h-16 rounded object-cover border border-stone-200"
                    />
                ) : (
                    <div className="w-16 h-16 rounded bg-stone-100 border border-stone-200 flex items-center justify-center">
                        <LayoutTemplate className="h-6 w-6 text-stone-400" />
                    </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-stone-900 truncate">
                            {section.title || `Sección ${section.id}`}
                        </h3>
                        <Badge variant="secondary" className={config.color}>
                            {config.label}
                        </Badge>
                        {!section.active && (
                            <Badge variant="outline" className="text-stone-500">
                                <EyeOff className="h-3 w-3 mr-1" />
                                Inactiva
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-stone-500 truncate">
                        {section.subtitle || `${section.items?.length || 0} items`}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={onEdit}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
