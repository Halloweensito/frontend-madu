// pages/admin/settings/components/BrandingSection.tsx
// Sección de identidad de marca con subida de logo

import type { UseFormReturn } from 'react-hook-form';
import { Settings } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SingleImageUpload } from '@/components/ui/single-image-upload';
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

import type { StoreSettingsFormData } from '../types';

interface BrandingSectionProps {
    form: UseFormReturn<StoreSettingsFormData>;
}

export const BrandingSection = ({ form }: BrandingSectionProps) => {
    const logoUrl = form.watch('logoUrl');

    return (
        <AccordionItem value="branding" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-primary" />
                    <div className="text-left">
                        <p className="font-medium">Identidad de Marca</p>
                        <p className="text-sm text-muted-foreground font-normal">
                            Nombre, logo y descripción de tu tienda
                        </p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Nombre de la tienda */}
                    <div className="space-y-2">
                        <Label htmlFor="siteName">Nombre de la Tienda</Label>
                        <Input
                            id="siteName"
                            placeholder="Mi Tienda"
                            {...form.register('siteName')}
                        />
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                        <Label htmlFor="siteDescription">Descripción del Sitio</Label>
                        <Textarea
                            id="siteDescription"
                            placeholder="Breve descripción de tu tienda..."
                            rows={2}
                            {...form.register('siteDescription')}
                        />
                    </div>

                    {/* Logo principal */}
                    <div className="space-y-2">
                        <Label>Logo Principal</Label>
                        <SingleImageUpload
                            value={logoUrl}
                            onChange={(url) => form.setValue('logoUrl', url || '')}
                            folder="branding"
                            placeholder="Subir logo"
                            aspectRatio="wide"
                        />
                        <p className="text-xs text-muted-foreground">
                            Recomendado: 400x150px, formato PNG transparente
                        </p>
                    </div>

                    {/* Favicon */}
                    <div className="space-y-2">
                        <Label>Favicon</Label>
                        <SingleImageUpload
                            value={form.watch('faviconUrl')}
                            onChange={(url) => form.setValue('faviconUrl', url || '')}
                            folder="branding"
                            placeholder="Subir favicon"
                            aspectRatio="square"
                        />
                        <p className="text-xs text-muted-foreground">
                            Recomendado: 32x32px o 64x64px
                        </p>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};
