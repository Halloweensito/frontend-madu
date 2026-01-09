// pages/admin/footer/hooks/useFooterManager.ts
// Hook para gestionar la lógica del administrador de footer

import { useState } from 'react';
import { toast } from 'sonner';
import {
    useAdminSections,
    useAdminLinks,
    useCreateSection,
    useUpdateSection,
    useDeleteSection,
    useReorderSections,
    useCreateLink,
    useUpdateLink,
    useDeleteLink,
    useReorderLinks,
} from '@/hooks/useFooter';
import { useAdminPages } from '@/hooks/usePageContent';
import type { FooterSectionAdmin, FooterLinkAdmin, FooterSectionRequest, FooterLinkRequest } from '@/types/footerSection';

export function useFooterManager() {
    // Queries
    const { data: sections = [], isLoading: isLoadingSections } = useAdminSections();
    const { data: links = [], isLoading: isLoadingLinks } = useAdminLinks();
    const { data: pages = [] } = useAdminPages();

    // Mutations
    const createSectionMutation = useCreateSection();
    const updateSectionMutation = useUpdateSection();
    const deleteSectionMutation = useDeleteSection();
    const reorderSectionsMutation = useReorderSections();
    const createLinkMutation = useCreateLink();
    const updateLinkMutation = useUpdateLink();
    const deleteLinkMutation = useDeleteLink();
    const reorderLinksMutation = useReorderLinks();

    // Modal states
    const [sectionModalOpen, setSectionModalOpen] = useState(false);
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<FooterSectionAdmin | null>(null);
    const [editingLink, setEditingLink] = useState<FooterLinkAdmin | null>(null);
    const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);

    // Secciones expandidas
    const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

    // Form states
    const [sectionForm, setSectionForm] = useState<FooterSectionRequest>({ title: '', active: true });
    const [linkForm, setLinkForm] = useState<FooterLinkRequest>({ label: '', url: '', sectionId: 0, active: true });
    const [linkType, setLinkType] = useState<'custom' | 'page'>('custom');

    // Secciones ordenadas
    const sortedSections = [...sections].sort((a, b) => a.position - b.position);

    // Páginas publicadas
    const publishedPages = pages.filter((p) => p.published);

    // Toggle sección expandida
    const toggleExpand = (id: number) => {
        const newSet = new Set(expandedSections);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedSections(newSet);
    };

    // Obtener links de una sección
    const getLinksBySection = (sectionId: number) => {
        return links.filter((l) => l.sectionId === sectionId).sort((a, b) => a.position - b.position);
    };

    // ==================== SECCIONES ====================

    const openNewSectionModal = () => {
        setEditingSection(null);
        setSectionForm({ title: '', active: true });
        setSectionModalOpen(true);
    };

    const openEditSectionModal = (section: FooterSectionAdmin) => {
        setEditingSection(section);
        setSectionForm({ title: section.title, position: section.position, active: section.active });
        setSectionModalOpen(true);
    };

    const handleSaveSection = async () => {
        try {
            if (editingSection) {
                await updateSectionMutation.mutateAsync({ id: editingSection.id, data: sectionForm });
                toast.success('Sección actualizada');
            } else {
                await createSectionMutation.mutateAsync(sectionForm);
                toast.success('Sección creada');
            }
            setSectionModalOpen(false);
        } catch {
            toast.error('Error al guardar sección');
        }
    };

    const handleDeleteSection = async (id: number) => {
        try {
            await deleteSectionMutation.mutateAsync(id);
            toast.success('Sección eliminada');
        } catch {
            toast.error('Error al eliminar sección');
        }
    };

    const handleReorderSections = (orderedIds: number[]) => {
        reorderSectionsMutation.mutate(orderedIds);
    };

    // ==================== LINKS ====================

    const openNewLinkModal = (sectionId: number) => {
        setEditingLink(null);
        setSelectedSectionId(sectionId);
        setLinkForm({ label: '', url: '', sectionId, active: true });
        setLinkType('custom');
        setLinkModalOpen(true);
    };

    const openEditLinkModal = (link: FooterLinkAdmin) => {
        setEditingLink(link);
        setSelectedSectionId(link.sectionId);
        setLinkForm({
            label: link.label,
            url: link.url,
            pageId: link.pageId,
            sectionId: link.sectionId,
            position: link.position,
            active: link.active,
        });
        setLinkType(link.pageId ? 'page' : 'custom');
        setLinkModalOpen(true);
    };

    const handleSaveLink = async () => {
        try {
            const data = {
                ...linkForm,
                sectionId: selectedSectionId!,
                pageId: linkType === 'page' ? linkForm.pageId : null,
                url: linkType === 'page' ? '' : linkForm.url,
            };

            if (editingLink) {
                await updateLinkMutation.mutateAsync({ id: editingLink.id, data });
                toast.success('Link actualizado');
            } else {
                await createLinkMutation.mutateAsync(data);
                toast.success('Link creado');
            }
            setLinkModalOpen(false);
        } catch {
            toast.error('Error al guardar link');
        }
    };

    const handleDeleteLink = async (id: number) => {
        try {
            await deleteLinkMutation.mutateAsync(id);
            toast.success('Link eliminado');
        } catch {
            toast.error('Error al eliminar link');
        }
    };

    const handleReorderLinks = (sectionId: number, orderedIds: number[]) => {
        reorderLinksMutation.mutate({ sectionId, orderedIds });
    };

    return {
        // Data
        sortedSections,
        publishedPages,
        isLoading: isLoadingSections || isLoadingLinks,

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
        isSectionSaving: createSectionMutation.isPending || updateSectionMutation.isPending,

        // Link modal
        linkModalOpen,
        setLinkModalOpen,
        editingLink,
        linkForm,
        setLinkForm,
        linkType,
        setLinkType,
        isLinkSaving: createLinkMutation.isPending || updateLinkMutation.isPending,

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
    };
}
