// pages/admin/footer/components/SortableSectionItem.tsx
// Componente de sección sorteable para el footer

import { useState } from 'react';
import { GripVertical, Edit, Trash2, ChevronDown, ChevronRight, Link as LinkIcon } from 'lucide-react';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { SortableLinkItem } from './SortableLinkItem';
import { LinkDragPreview } from './DragOverlayPreview';
import type { FooterSectionAdmin, FooterLinkAdmin } from '@/types/footerSection';

interface SortableSectionItemProps {
    section: FooterSectionAdmin;
    links: FooterLinkAdmin[];
    expanded: boolean;
    onToggle: () => void;
    onEditSection: () => void;
    onDeleteSection: () => void;
    onAddLink: () => void;
    onEditLink: (link: FooterLinkAdmin) => void;
    onDeleteLink: (id: number) => void;
    onReorderLinks: (orderedIds: number[]) => void;
}

export function SortableSectionItem({
    section,
    links,
    expanded,
    onToggle,
    onEditSection,
    onDeleteSection,
    onAddLink,
    onEditLink,
    onDeleteLink,
    onReorderLinks,
}: SortableSectionItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const [activeLinkId, setActiveLinkId] = useState<number | null>(null);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleLinkDragStart = (event: DragStartEvent) => {
        setActiveLinkId(event.active.id as number);
    };

    const handleLinkDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveLinkId(null);

        if (!over || active.id === over.id) return;

        const oldIndex = links.findIndex((l) => l.id === active.id);
        const newIndex = links.findIndex((l) => l.id === over.id);
        const reordered = arrayMove(links, oldIndex, newIndex);
        onReorderLinks(reordered.map((l) => l.id));
    };

    const activeLink = activeLinkId ? links.find((l) => l.id === activeLinkId) : null;

    return (
        <Card ref={setNodeRef} style={style} className="overflow-hidden">
            {/* Header de sección - responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 gap-3 hover:bg-muted/50 transition-colors">
                {/* Título y estado */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <button {...attributes} {...listeners} className="cursor-grab touch-none shrink-0">
                        <GripVertical className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    </button>
                    <button onClick={onToggle} className="flex items-center gap-1 sm:gap-2 min-w-0">
                        {expanded ? (
                            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                        ) : (
                            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                        )}
                        <span className="font-medium text-sm sm:text-base truncate">{section.title}</span>
                    </button>
                    {!section.active && (
                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">Inactivo</span>
                    )}
                    <span className="text-xs text-muted-foreground shrink-0">({links.length})</span>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-auto">
                    <Button variant="ghost" size="sm" onClick={onAddLink} className="h-8 px-2 sm:px-3">
                        <LinkIcon className="h-4 w-4" />
                        <span className="hidden sm:inline ml-1">Agregar Link</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onEditSection} className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar sección?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Se eliminarán también todos los links de esta sección.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={onDeleteSection}
                                >
                                    Eliminar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Links de la sección */}
            {expanded && (
                <div className="border-t bg-muted/20 p-4">
                    {links.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic text-center py-4">
                            No hay links en esta sección
                        </p>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleLinkDragStart}
                            onDragEnd={handleLinkDragEnd}
                        >
                            <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-2">
                                    {links.map((link) => (
                                        <SortableLinkItem
                                            key={link.id}
                                            link={link}
                                            onEdit={() => onEditLink(link)}
                                            onDelete={() => onDeleteLink(link.id)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>

                            {/* DragOverlay para links */}
                            <DragOverlay>
                                {activeLink && <LinkDragPreview link={activeLink} />}
                            </DragOverlay>
                        </DndContext>
                    )}
                </div>
            )}
        </Card>
    );
}
