// pages/admin/home/HomeSettings.tsx
// Smart Container - handles state, data fetching, and business logic

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, Save, AlertCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import type { ImageUploadHandle } from '@/pages/admin/products/ImageUpload';
import { useCategories } from '@/hooks/useCatalog';
import {
    useAdminHomeSections,
    useCreateHomeSection,
    useUpdateHomeSection,
} from '@/hooks/useHome';
import { SectionType, type HomeSectionResponse, type HomeSectionRequest } from '@/types/homeSection';

import {
    BannerSection,
    AnnouncementSection,
    FeaturedProductsSection,
    CategoriesGridSection,
} from './components';

// Types
import { type HomeSettingsFormData, defaultFormValues } from './types';

export default function HomeSettings() {
    const imageUploadRef = useRef<ImageUploadHandle | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const queryClient = useQueryClient();

    // ==========================================
    // DATA FETCHING
    // ==========================================

    const { data: categories, isLoading: isLoadingCategories } = useCategories();
    const { data: sections, isLoading: isLoadingSections, error: sectionsError } = useAdminHomeSections();

    // ==========================================
    // MUTATIONS
    // ==========================================

    const createMutation = useCreateHomeSection();
    const updateMutation = useUpdateHomeSection();

    // ==========================================
    // FORM SETUP
    // ==========================================

    const form = useForm<HomeSettingsFormData>({
        defaultValues: defaultFormValues,
    });

    // Helper to find section by type
    const findSectionByType = (type: SectionType): HomeSectionResponse | undefined => {
        return sections?.find(s => s.type === type);
    };

    // ==========================================
    // LOAD EXISTING DATA
    // ==========================================

    useEffect(() => {
        if (!sections) return;

        const heroSection = findSectionByType(SectionType.HERO);
        const bannerSection = findSectionByType(SectionType.BANNER);
        const featuredSection = findSectionByType(SectionType.FEATURED_PRODUCTS);
        const categoriesSection = findSectionByType(SectionType.CATEGORIES);

        form.reset({
            // Banner Principal (HERO)
            bannerTitle: heroSection?.title || '',
            bannerSubtitle: heroSection?.subtitle || '',
            bannerImageUrl: heroSection?.imageUrl || '',
            bannerLink: heroSection?.linkUrl || '/productos',
            bannerActive: heroSection?.active ?? true,
            // Barra de Aviso (BANNER)
            announcementEnabled: bannerSection?.active ?? false,
            announcementMessage: bannerSection?.title || '',
            // Productos Destacados
            featuredCategoryId: featuredSection?.items?.[0]?.category?.id?.toString() || '',
            featuredActive: featuredSection?.active ?? true,
            selectedProductIds: featuredSection?.items?.map(item => item.product?.id).filter(Boolean) as number[] || [],
            // Categorías en Home
            selectedCategoryIds: categoriesSection?.items?.map(item => item.category?.id).filter(Boolean) as number[] || [],
            categoriesActive: categoriesSection?.active ?? true,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sections]);

    // ==========================================
    // SUBMIT HANDLER
    // ==========================================

    const onSubmit = async (data: HomeSettingsFormData) => {
        setIsSaving(true);
        try {
            // Helper para guardar o actualizar sección
            const saveSection = async (
                type: SectionType,
                payload: HomeSectionRequest,
                shouldCreate: boolean = true
            ) => {
                const existingSection = findSectionByType(type);
                if (existingSection) {
                    return updateMutation.mutateAsync({ id: existingSection.id, data: payload });
                } else if (shouldCreate) {
                    return createMutation.mutateAsync(payload);
                }
            };

            // 1. Upload Banner Image if needed
            let finalImageUrl = data.bannerImageUrl;
            if (imageUploadRef.current?.hasPreviews()) {
                const uploadedImages = await imageUploadRef.current.uploadPreviews();
                if (uploadedImages.length > 0) {
                    finalImageUrl = uploadedImages[0].url;
                }
            }

            // 2. Prepare Payloads

            // HERO (Banner Principal) - Pos 0
            const heroPayload: HomeSectionRequest = {
                type: SectionType.HERO,
                title: data.bannerTitle,
                subtitle: data.bannerSubtitle,
                imageUrl: finalImageUrl,
                ctaLink: data.bannerLink,
                active: data.bannerActive,
                position: 0,
            };

            // BANNER (Barra Aviso) - Pos 3
            const bannerPayload: HomeSectionRequest = {
                type: SectionType.BANNER,
                title: data.announcementMessage,
                active: data.announcementEnabled,
                position: 3,
            };

            // FEATURED_PRODUCTS - Pos 2
            const featuredPayload: HomeSectionRequest = {
                type: SectionType.FEATURED_PRODUCTS,
                title: 'Productos Destacados',
                active: data.featuredActive,
                position: 2,
                items: data.selectedProductIds.map((productId, idx) => ({
                    position: idx,
                    productId: productId,
                })),
            };

            // CATEGORIES - Pos 1
            const categoriesPayload: HomeSectionRequest = {
                type: SectionType.CATEGORIES,
                title: 'Categorías',
                active: data.categoriesActive,
                position: 1,
                items: data.selectedCategoryIds.map((catId, idx) => ({
                    position: idx,
                    categoryId: catId,
                })),
            };

            // 3. Execute all in parallel
            await Promise.all([
                saveSection(SectionType.HERO, heroPayload),
                saveSection(SectionType.BANNER, bannerPayload, !!data.announcementMessage),
                saveSection(SectionType.FEATURED_PRODUCTS, featuredPayload, data.selectedProductIds.length > 0),
                saveSection(SectionType.CATEGORIES, categoriesPayload, data.selectedCategoryIds.length > 0),
            ]);

            toast.success('Configuración guardada correctamente');

            // Invalidate query to refresh data
            queryClient.invalidateQueries({ queryKey: ['home-sections'] });

        } catch (error) {
            console.error('Error saving home settings:', error);
            toast.error('Error al guardar la configuración');
        } finally {
            setIsSaving(false);
        }
    };

    // ==========================================
    // LOADING & ERROR STATES
    // ==========================================

    if (isLoadingSections) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (sectionsError) {
        return (
            <div className="flex h-96 flex-col items-center justify-center gap-4 text-destructive">
                <AlertCircle className="h-10 w-10" />
                <p>Error al cargar la configuración</p>
            </div>
        );
    }

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-stone-900">
                    Configuración del Home
                </h1>
                <p className="text-sm text-stone-500">
                    Personaliza lo que ven tus clientes en la página principal
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    <Accordion type="multiple" defaultValue={[]} className="space-y-4">
                        {/* Banner Principal */}
                        <AccordionItem value="banner" className="border rounded-lg px-4 bg-white">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold">Banner Principal</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <BannerSection
                                    form={form}
                                    imageUploadRef={imageUploadRef}
                                    isSaving={isSaving}
                                />
                            </AccordionContent>
                        </AccordionItem>

                        {/* Categorías en Home */}
                        <AccordionItem value="categories" className="border rounded-lg px-4 bg-white">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold">Categorías en Home</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <CategoriesGridSection
                                    form={form}
                                    categories={categories}
                                    isLoading={isLoadingCategories}
                                />
                            </AccordionContent>
                        </AccordionItem>

                        {/* Productos Destacados */}
                        <AccordionItem value="featured" className="border rounded-lg px-4 bg-white">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold">Productos Destacados</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <FeaturedProductsSection form={form} />
                            </AccordionContent>
                        </AccordionItem>

                        {/* Barra de Aviso */}
                        <AccordionItem value="announcement" className="border rounded-lg px-4 bg-white">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold">Barra de Aviso</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <AnnouncementSection form={form} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Cambios
                            </>
                        )}
                    </Button>

                </form>
            </Form>
        </div>
    );
}
