// pages/admin/settings/StoreSettings.tsx
// Smart Container - handles state, data fetching, and business logic
// UI components are extracted to ./components/

import { Loader2, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Accordion } from '@/components/ui/accordion';

import { useStoreSettingsForm } from './hooks/useStoreSettingsForm';
import {
    BrandingSection,
    SocialSection,
    FooterSection,
    MaintenanceCard,
} from './components';

export default function StoreSettings() {
    const { form, isLoading, isError, isSaving, onSubmit } = useStoreSettingsForm();

    // Estados de carga y error
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-12 text-red-500">
                Error al cargar la configuración. Intenta recargar la página.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Configuración del Sitio</h1>
                    <p className="text-muted-foreground">
                        Personaliza tu tienda, redes sociales y footer
                    </p>
                </div>
                <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    Guardar Cambios
                </Button>
            </div>

            {/* Formulario con Acordeón */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="pb-32">
                <Accordion type="multiple" defaultValue={['branding', 'social']} className="space-y-4">
                    <BrandingSection form={form} />
                    <SocialSection form={form} />
                    <FooterSection form={form} />
                </Accordion>
                <MaintenanceCard form={form} />
            </form>
        </div>
    );
}
