import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { categoryService } from '@/services/categoryService';
import { useActiveCategories} from '@/hooks/useCatalog';
import { categoryFormSchema, type CategoryFormData } from '@/schemas/categoryForm';
import {
    defaultCategoryValues,
    mapCategoryToFormData,
    mapFormToPayload,
    generateSlug,
} from '../utils/category-helpers';
import type { ImageUploadHandle } from '../../products/ImageUpload';

export function useCategoryForm() {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const queryClient = useQueryClient();
    const imageUploadRef = useRef<ImageUploadHandle>(null);

    // Estado derivado
    const isEditMode = Boolean(id);
    const categoryId = id ? Number(id) : undefined;

    // 1. Cargar datos necesarios (Categorías Padre)
    const {
        data: categories = [],
        isLoading: isLoadingCategories,
        error: categoriesError,
    } = useActiveCategories();

    // 2. Cargar datos de la categoría actual (si es edición)
    const {
        data: existingCategory,
        isLoading: isLoadingCategory,
        error: categoryError,
    } = useQuery({
        queryKey: ['category', categoryId],
        queryFn: () => categoryService.getCategoryById(categoryId!),
        enabled: isEditMode && !isNaN(Number(categoryId)),
        retry: 1,
    });

    // Filtro de padres disponibles (Evitar dependencias circulares)
    const availableParents = useMemo(() => {
        if (!isEditMode || !categoryId) return categories;
        return categories.filter(cat => cat.id !== categoryId);
    }, [categories, isEditMode, categoryId]);

    // Configuración del Formulario
    const form = useForm<CategoryFormData>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: defaultCategoryValues,
        mode: 'onSubmit',
    });

    // Efecto para cargar datos en el formulario al editar
    useEffect(() => {
        if (isEditMode && existingCategory) {
            const formData = mapCategoryToFormData(existingCategory);
            form.reset(formData);
        }
    }, [existingCategory, isEditMode, form]);

    // Efecto para Auto-Slug
    const name = form.watch('name');
    useEffect(() => {
        if (name && !isEditMode) {
            const slug = generateSlug(name);
            form.setValue('slug', slug, { shouldValidate: true });
        }
    }, [name, form, isEditMode]);

    // Mutaciones
    const createMutation = useMutation({
        mutationFn: categoryService.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Categoría creada exitosamente');
            navigate('/admin/categorias');
        },
        onError: (error: Error) => {
            toast.error(`Error al crear: ${error.message}`);
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: Parameters<typeof categoryService.updateCategory>[1]) =>
            categoryService.updateCategory(categoryId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['category', categoryId] });
            toast.success('Categoría actualizada exitosamente');
            navigate('/admin/categorias');
        },
        onError: (error: Error) => {
            toast.error(`Error al actualizar: ${error.message}`);
        },
    });

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    // Submit Handler
    const onSubmit = async (data: CategoryFormData) => {
        if (isSubmitting) return;

        try {
            let finalImageUrl = data.imageUrl;

            if (imageUploadRef.current?.hasPreviews()) {
                const uploadedImages = await imageUploadRef.current.uploadPreviews();
                if (uploadedImages.length > 0) {
                    finalImageUrl = uploadedImages[0].url;
                }
            }

            const payload = mapFormToPayload({
                ...data,
                imageUrl: finalImageUrl,
            });

            if (isEditMode) {
                await updateMutation.mutateAsync(payload);
            } else {
                await createMutation.mutateAsync(payload);
            }
        } catch (error) {
            console.error('Error submitting category:', error);
        }
    };

    return {
        // Form
        form,
        imageUploadRef,
        onSubmit,
        isSubmitting,

        // Estado
        isEditMode,
        categoryId,
        isLoadingCategory,
        categoryError,

        // Datos
        availableParents,
        isLoadingCategories,
        categoriesError,

        // Acciones
        navigate,
    };
}
