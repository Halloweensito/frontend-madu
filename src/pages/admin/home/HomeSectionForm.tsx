// pages/admin/home/HomeSectionForm.tsx
// Smart Container - uses hook for logic, dumb components for UI

import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { SectionType } from '@/types/homeSection';

// Custom hook (all logic)
import { useHomeSectionForm } from './hooks/useHomeSectionForm';

// Dumb components
import {
    SectionTypeCard,
    ContentFieldsCard,
    BannerImageCard,
    StatusCard,
    ItemsPlaceholderCard,
} from './components';

export default function HomeSectionForm() {
    const {
        form,
        sectionType,
        isEditMode,
        sectionId,
        isLoadingSection,
        sectionError,
        isSubmitting,
        imageUploadRef,
        onSubmit,
        navigateBack,
    } = useHomeSectionForm();

    // Loading State
    if (isEditMode && isLoadingSection) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Error State
    if (isEditMode && sectionError) {
        return (
            <div className="flex h-96 flex-col items-center justify-center gap-4 text-destructive">
                <AlertCircle className="h-10 w-10" />
                <p>Error al cargar la sección</p>
                <Button variant="outline" onClick={navigateBack}>
                    Volver
                </Button>
            </div>
        );
    }

    const showItemsPlaceholder =
        sectionType === SectionType.HERO ||
        sectionType === SectionType.CATEGORIES ||
        sectionType === SectionType.FEATURED_PRODUCTS;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={navigateBack}
                    className="h-10 w-10 rounded-full"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-stone-900">
                        {isEditMode ? 'Editar Sección' : 'Nueva Sección'}
                    </h1>
                    <p className="text-sm text-stone-500">
                        {isEditMode ? `ID: ${sectionId}` : 'Configura una nueva sección para tu Home'}
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Left Column - Main Settings */}
                        <div className="md:col-span-2 space-y-6">
                            <SectionTypeCard form={form} disabled={isEditMode} />

                            <ContentFieldsCard form={form} sectionType={sectionType} />

                            {sectionType === SectionType.BANNER && (
                                <BannerImageCard
                                    form={form}
                                    imageUploadRef={imageUploadRef}
                                    disabled={isSubmitting}
                                />
                            )}

                            {showItemsPlaceholder && (
                                <ItemsPlaceholderCard sectionType={sectionType} />
                            )}
                        </div>

                        {/* Right Column - Status & Actions */}
                        <div className="space-y-6">
                            <StatusCard form={form} />

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isEditMode ? 'Guardar Cambios' : 'Crear Sección'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    onClick={navigateBack}
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
