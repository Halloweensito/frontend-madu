// pages/admin/settings/components/SocialSection.tsx
// Sección de redes sociales y contacto - Solo usuarios/números

import type { UseFormReturn } from 'react-hook-form';
import { Share2, Instagram, Facebook, MessageCircle } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

import type { StoreSettingsFormData } from '../types';

interface SocialSectionProps {
    form: UseFormReturn<StoreSettingsFormData>;
}

export const SocialSection = ({ form }: SocialSectionProps) => {
    return (
        <AccordionItem value="social" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                    <Share2 className="h-5 w-5 text-primary" />
                    <div className="text-left">
                        <p className="font-medium">Redes Sociales</p>
                        <p className="text-sm text-muted-foreground font-normal">
                            Ingresa solo tu usuario o número
                        </p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
                <div className="grid gap-4 md:grid-cols-2">

                    {/* Instagram */}
                    <div className="space-y-2">
                        <Label htmlFor="instagramUrl" className="flex items-center gap-2">
                            <Instagram className="h-4 w-4" />
                            Instagram
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                @
                            </span>
                            <Input
                                id="instagramUrl"
                                placeholder="tu_tienda"
                                className="rounded-l-none"
                                {...form.register('instagramUrl')}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Se creará: instagram.com/@tu_tienda
                        </p>
                    </div>

                    {/* Facebook */}
                    <div className="space-y-2">
                        <Label htmlFor="facebookUrl" className="flex items-center gap-2">
                            <Facebook className="h-4 w-4" />
                            Facebook
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                facebook.com/
                            </span>
                            <Input
                                id="facebookUrl"
                                placeholder="tu.tienda"
                                className="rounded-l-none"
                                {...form.register('facebookUrl')}
                            />
                        </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-2">
                        <Label htmlFor="whatsappUrl" className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                +
                            </span>
                            <Input
                                id="whatsappUrl"
                                placeholder="5491112345678"
                                className="rounded-l-none"
                                {...form.register('whatsappUrl')}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Solo números, sin espacios ni guiones. Ej: 5491112345678
                        </p>
                    </div>

                    {/* TikTok */}
                    <div className="space-y-2">
                        <Label htmlFor="tiktokUrl">TikTok</Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                @
                            </span>
                            <Input
                                id="tiktokUrl"
                                placeholder="tu_tienda"
                                className="rounded-l-none"
                                {...form.register('tiktokUrl')}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Se creará: tiktok.com/@tu_tienda
                        </p>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email de Contacto</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="contacto@tu-tienda.com"
                            {...form.register('email')}
                        />
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                            id="phone"
                            placeholder="+54 11 1234-5678"
                            {...form.register('phone')}
                        />
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};
