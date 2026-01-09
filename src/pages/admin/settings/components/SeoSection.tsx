// pages/admin/settings/components/SeoSection.tsx
// Sección de SEO

import type { UseFormReturn } from 'react-hook-form';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

import type { StoreSettingsFormData } from '../types';

interface SeoSectionProps {
    form: UseFormReturn<StoreSettingsFormData>;
}

export const SeoSection = ({ form }: SeoSectionProps) => {
    return (
        <AccordionItem value="seo" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-primary" />
                    <div className="text-left">
                        <p className="font-medium">SEO</p>
                        <p className="text-sm text-muted-foreground font-normal">
                            Optimización para buscadores
                        </p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="metaTitle">Meta Título (máx. 70 caracteres)</Label>
                        <Input
                            id="metaTitle"
                            placeholder="Tu Tienda - Lencería de Diseño"
                            maxLength={70}
                            {...form.register('metaTitle')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="metaDescription">Meta Descripción (máx. 160 caracteres)</Label>
                        <Textarea
                            id="metaDescription"
                            placeholder="Descubre nuestra colección de lencería..."
                            rows={3}
                            maxLength={160}
                            {...form.register('metaDescription')}
                        />
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};
