// pages/admin/pages/hooks/usePageForm.ts
// Hook personalizado para manejar lógica del formulario de página

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreatePage, useUpdatePage, useAdminPage } from '@/hooks/usePageContent';
import type { PageContentData } from '@/types/pageContent';

interface UsePageFormProps {
    pageId?: number;
}

export function usePageForm({ pageId }: UsePageFormProps = {}) {
    const navigate = useNavigate();
    const isEditMode = !!pageId;

    // Cargar datos si es edición
    const { data: existingPage, isLoading: isLoadingPage } = useAdminPage(pageId!);

    // Mutations
    const createMutation = useCreatePage();
    const updateMutation = useUpdatePage();

    // Form
    const form = useForm<PageContentData>({
        defaultValues: {
            title: '',
            content: '',
            published: false,
        },
        values: existingPage
            ? {
                slug: existingPage.slug,
                title: existingPage.title,
                content: existingPage.content,
                published: existingPage.published,
            }
            : undefined,
    });

    // Submit handler
    const onSubmit = async (data: PageContentData) => {
        try {
            if (isEditMode) {
                await updateMutation.mutateAsync({ id: pageId, data });
                toast.success('Página actualizada correctamente');
            } else {
                await createMutation.mutateAsync(data);
                toast.success('Página creada correctamente');
            }
            navigate('/admin/paginas');
        } catch (error) {
            toast.error(isEditMode ? 'Error al actualizar página' : 'Error al crear página');
            console.error(error);
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isLoading: isLoadingPage,
        isSaving: createMutation.isPending || updateMutation.isPending,
        isEditMode,
    };
}
