// pages/admin/settings/hooks/useStoreSettingsForm.ts
// Hook que encapsula toda la lógica del formulario de configuración

import { useEffect } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { useAdminSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings';
import { type StoreSettingsFormData, defaultFormValues } from '../types';

export interface UseStoreSettingsFormReturn {
    form: UseFormReturn<StoreSettingsFormData>;
    isLoading: boolean;
    isError: boolean;
    isSaving: boolean;
    onSubmit: (data: StoreSettingsFormData) => Promise<void>;
}

/**
 * Hook que maneja la lógica del formulario de configuración:
 * - Carga inicial de datos
 * - Sincronización con el servidor
 * - Submit y manejo de errores
 */
export const useStoreSettingsForm = (): UseStoreSettingsFormReturn => {
    const { data: settings, isLoading, isError } = useAdminSiteSettings();
    const updateMutation = useUpdateSiteSettings();

    const form = useForm<StoreSettingsFormData>({
        defaultValues: defaultFormValues,
    });

    // Cargar datos cuando lleguen del servidor
    useEffect(() => {
        if (settings) {
            form.reset({
                siteName: settings.siteName || '',
                siteDescription: settings.siteDescription || '',
                logoUrl: settings.logoUrl || '',
                logoMobileUrl: settings.logoMobileUrl || '',
                faviconUrl: settings.faviconUrl || '',
                primaryColor: settings.primaryColor || '#000000',
                secondaryColor: settings.secondaryColor || '#f5f5f4',
                accentColor: settings.accentColor || '#78716c',
                metaTitle: settings.metaTitle || '',
                metaDescription: settings.metaDescription || '',
                email: settings.email || '',
                phone: settings.phone || '',
                instagramUrl: settings.instagramUrl || '',
                facebookUrl: settings.facebookUrl || '',
                whatsappUrl: settings.whatsappUrl || '',
                tiktokUrl: settings.tiktokUrl || '',
                footerText: settings.footerText || '',
                developerName: settings.developerName || '',
                developerUrl: settings.developerUrl || '',
                maintenanceMode: settings.maintenanceMode || false,
            });
        }
    }, [settings, form]);

    const onSubmit = async (data: StoreSettingsFormData) => {
        try {
            await updateMutation.mutateAsync(data);
            toast.success('Configuración guardada correctamente');
        } catch {
            toast.error('Error al guardar la configuración');
        }
    };

    return {
        form,
        isLoading,
        isError,
        isSaving: updateMutation.isPending,
        onSubmit,
    };
};
