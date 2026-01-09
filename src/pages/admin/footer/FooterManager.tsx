// pages/admin/footer/FooterManager.tsx
// Componente principal - solo composición, sin lógica de negocio

import { useState } from 'react';
import { Plus } from 'lucide-react';
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
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SortableSectionItem, SectionModal, LinkModal, SectionDragPreview } from './components';
import { useFooterManager } from './hooks/useFooterManager';

export default function FooterManager() {
    const {
        // Data
        sortedSections,
        publishedPages,
        isLoading,
        // Expand state
        expandedSections,
        toggleExpand,
        getLinksBySection,
        // Section modal
        sectionModalOpen,
        setSectionModalOpen,
        editingSection,
        sectionForm,
        setSectionForm,
        isSectionSaving,
        // Link modal
        linkModalOpen,
        setLinkModalOpen,
        editingLink,
        linkForm,
        setLinkForm,
        linkType,
        setLinkType,
        isLinkSaving,
        // Handlers
        openNewSectionModal,
        openEditSectionModal,
        handleSaveSection,
        handleDeleteSection,
        handleReorderSections,
        openNewLinkModal,
        openEditLinkModal,
        handleSaveLink,
        handleDeleteLink,
        handleReorderLinks,
    } = useFooterManager();

    // Estado para el item siendo arrastrado
    const [activeSectionId, setActiveSectionId] = useState<number | null>(null);

    // Sensores para DnD de secciones
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Drag start para secciones
    const handleSectionDragStart = (event: DragStartEvent) => {
        setActiveSectionId(event.active.id as number);
    };

    // Drag end para secciones
    const handleSectionDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveSectionId(null);

        if (!over || active.id === over.id) return;

        const oldIndex = sortedSections.findIndex((s) => s.id === active.id);
        const newIndex = sortedSections.findIndex((s) => s.id === over.id);
        const reordered = arrayMove(sortedSections, oldIndex, newIndex);

        handleReorderSections(reordered.map((s) => s.id));
    };

    // Sección activa para overlay
    const activeSection = activeSectionId
        ? sortedSections.find((s) => s.id === activeSectionId)
        : null;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header - stack en móvil */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Footer</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Gestiona las secciones y links. Arrastra para reordenar.
                    </p>
                </div>
                <Button onClick={openNewSectionModal} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="sm:inline">Nueva Sección</span>
                </Button>
            </div>

            {/* Lista de secciones con DnD */}
            {sortedSections.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">No hay secciones en el footer</p>
                    <Button onClick={openNewSectionModal} variant="outline">
                        Crear primera sección
                    </Button>
                </Card>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleSectionDragStart}
                    onDragEnd={handleSectionDragEnd}
                >
                    <SortableContext items={sortedSections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                            {sortedSections.map((section) => (
                                <SortableSectionItem
                                    key={section.id}
                                    section={section}
                                    links={getLinksBySection(section.id)}
                                    expanded={expandedSections.has(section.id)}
                                    onToggle={() => toggleExpand(section.id)}
                                    onEditSection={() => openEditSectionModal(section)}
                                    onDeleteSection={() => handleDeleteSection(section.id)}
                                    onAddLink={() => openNewLinkModal(section.id)}
                                    onEditLink={openEditLinkModal}
                                    onDeleteLink={handleDeleteLink}
                                    onReorderLinks={(ids) => handleReorderLinks(section.id, ids)}
                                />
                            ))}
                        </div>
                    </SortableContext>

                    {/* DragOverlay para secciones */}
                    <DragOverlay>
                        {activeSection && (
                            <SectionDragPreview
                                section={activeSection}
                                linksCount={getLinksBySection(activeSection.id).length}
                            />
                        )}
                    </DragOverlay>
                </DndContext>
            )}

            {/* Modales */}
            <SectionModal
                open={sectionModalOpen}
                onOpenChange={setSectionModalOpen}
                isEditing={!!editingSection}
                form={sectionForm}
                onFormChange={setSectionForm}
                onSave={handleSaveSection}
                isSaving={isSectionSaving}
            />

            <LinkModal
                open={linkModalOpen}
                onOpenChange={setLinkModalOpen}
                isEditing={!!editingLink}
                form={linkForm}
                onFormChange={setLinkForm}
                linkType={linkType}
                onLinkTypeChange={setLinkType}
                onSave={handleSaveLink}
                isSaving={isLinkSaving}
                publishedPages={publishedPages}
            />
        </div>
    );
}
