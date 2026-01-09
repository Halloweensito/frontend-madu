// pages/admin/settings/components/ThemeSection.tsx
// Sección de colores del tema

import type { UseFormReturn } from 'react-hook-form';
import { Palette } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

import type { StoreSettingsFormData } from '../types';

interface ThemeSectionProps {
    form: UseFormReturn<StoreSettingsFormData>;
}

export const ThemeSection = ({ form }: ThemeSectionProps) => {
    return (
        <AccordionItem value="theme" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-primary" />
                    <div className="text-left">
                        <p className="font-medium">Colores del Tema</p>
                        <p className="text-sm text-muted-foreground font-normal">
                            Personaliza la paleta de colores
                        </p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="primaryColor">Color Primario</Label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                className="w-10 h-10 rounded cursor-pointer border"
                                {...form.register('primaryColor')}
                            />
                            <Input
                                id="primaryColor"
                                placeholder="#000000"
                                {...form.register('primaryColor')}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="secondaryColor">Color Secundario</Label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                className="w-10 h-10 rounded cursor-pointer border"
                                {...form.register('secondaryColor')}
                            />
                            <Input
                                id="secondaryColor"
                                placeholder="#f5f5f4"
                                {...form.register('secondaryColor')}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accentColor">Color de Acento</Label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                className="w-10 h-10 rounded cursor-pointer border"
                                {...form.register('accentColor')}
                            />
                            <Input
                                id="accentColor"
                                placeholder="#78716c"
                                {...form.register('accentColor')}
                            />
                        </div>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};
