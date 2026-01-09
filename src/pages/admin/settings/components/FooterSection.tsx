// pages/admin/settings/components/FooterSection.tsx
// Sección de footer - Solo texto descriptivo

import type { UseFormReturn } from 'react-hook-form';
import { FileText } from 'lucide-react';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

import type { StoreSettingsFormData } from '../types';

interface FooterSectionProps {
    form: UseFormReturn<StoreSettingsFormData>;
}

export const FooterSection = ({ form }: FooterSectionProps) => {
    return (
        <AccordionItem value="footer" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="text-left">
                        <p className="font-medium">Footer</p>
                        <p className="text-sm text-muted-foreground font-normal">
                            Descripción de tu tienda para el pie de página
                        </p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
                <div className="space-y-2">
                    <Label htmlFor="footerText">Descripción de la tienda</Label>
                    <Textarea
                        id="footerText"
                        placeholder="Lencería de diseño pensada para empoderar tu sensualidad. Telas delicadas, cortes atrevidos y la elegancia que mereces."
                        rows={3}
                        {...form.register('footerText')}
                    />
                    <p className="text-xs text-muted-foreground">
                        Este texto aparece en el footer junto al logo de tu tienda.
                    </p>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};
