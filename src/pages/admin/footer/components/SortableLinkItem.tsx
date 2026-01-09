// pages/admin/footer/components/SortableLinkItem.tsx
// Componente de link sorteable para el footer

import { GripVertical, Edit, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';
import type { FooterLinkAdmin } from '@/types/footerSection';

interface SortableLinkItemProps {
    link: FooterLinkAdmin;
    onEdit: () => void;
    onDelete: () => void;
}

export function SortableLinkItem({ link, onEdit, onDelete }: SortableLinkItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between bg-background p-3 rounded-md border"
        >
            <div className="flex items-center gap-3">
                <button {...attributes} {...listeners} className="cursor-grab touch-none">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </button>
                <div>
                    <p className="font-medium text-sm">{link.label}</p>
                    <p className="text-xs text-muted-foreground">
                        {link.pageTitle ? `Página: ${link.pageTitle}` : link.url}
                    </p>
                </div>
                {!link.active && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">Inactivo</span>
                )}
            </div>
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={onEdit}>
                    <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar link?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={onDelete}
                            >
                                Eliminar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
