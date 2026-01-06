// pages/admin/home/hooks/useHomeSectionForm.ts
// Custom hook for HomeSectionForm logic (Smart Container logic)

import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import type { ImageUploadHandle } from '@/pages/admin/products/ImageUpload';
import {
    useHomeSectionById,
    useCreateHomeSection,
    useUpdateHomeSection,
} from '@/hooks/useHome';
import {
    homeSectionFormSchema,
    defaultHomeSectionValues,
    type HomeSectionFormData,
} from '@/schemas/homeSectionForm';

export function useHomeSectionForm() {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isEditMode = Boolean(id);
    const sectionId = id ? Number(id) : undefined;

    // Refs
    const imageUploadRef = useRef<ImageUploadHandle | null>(null);

    // Data fetching
    const {
        data: existingSection,
        isLoading: isLoadingSection,
        error: sectionError
    } = useHomeSectionById(sectionId);

    // Mutations
    const createMutation = useCreateHomeSection();
    const updateMutation = useUpdateHomeSection();
    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    // Form setup
    const form = useForm<HomeSectionFormData>({
        resolver: zodResolver(homeSectionFormSchema) as any,
        defaultValues: defaultHomeSectionValues,
        mode: 'onSubmit',
    });

    // Watch type for dynamic fields
    const sectionType = useWatch({ control: form.control, name: 'type' });

    // Load existing data in edit mode
    useEffect(() => {
        if (isEditMode && existingSection) {
            form.reset({
                type: existingSection.type,
                title: existingSection.title || '',
                subtitle: existingSection.subtitle || '',
                imageUrl: existingSection.imageUrl || '',
                position: existingSection.position,
                active: existingSection.active,
                items: existingSection.items?.map(item => ({
                    id: item.id,
                    position: item.position,
                    imageUrl: item.imageUrl,
                    redirectUrl: item.redirectUrl,
                    title: item.title,
                    productId: item.product?.id,
                    categoryId: item.category?.id,
                })) || [],
            });
        }
    }, [existingSection, isEditMode, form]);

    // Submit handler
    const onSubmit = async (data: HomeSectionFormData) => {
        if (isSubmitting) return;

        try {
            // Handle image upload if there are previews
            let finalImageUrl = data.imageUrl;
            if (imageUploadRef.current?.hasPreviews()) {
                const uploadedImages = await imageUploadRef.current.uploadPreviews();
                if (uploadedImages.length > 0) {
                    finalImageUrl = uploadedImages[0].url;
                }
            }

            const payload = {
                ...data,
                imageUrl: finalImageUrl,
            };

            if (isEditMode && sectionId) {
                await updateMutation.mutateAsync({ id: sectionId, data: payload });
                toast.success('Sección actualizada exitosamente');
            } else {
                await createMutation.mutateAsync(payload);
                toast.success('Sección creada exitosamente');
            }

            navigate('/admin/home');
        } catch (error) {
            toast.error('Error al guardar la sección');
            console.error('Error saving section:', error);
        }
    };

    const navigateBack = () => navigate('/admin/home');

    return {
        // State
        form,
        sectionType,
        isEditMode,
        sectionId,
        isLoadingSection,
        sectionError,
        isSubmitting,
        // Refs
        imageUploadRef,
        // Actions
        onSubmit,
        navigateBack,
    };
}
