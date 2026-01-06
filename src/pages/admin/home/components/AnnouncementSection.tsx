// pages/admin/home/components/AnnouncementSection.tsx
// Dumb component for Announcement Bar settings (simplified for Accordion use)

import type { UseFormReturn } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import type { HomeSettingsFormData } from '@/pages/admin/home/types';

interface AnnouncementSectionProps {
    form: UseFormReturn<HomeSettingsFormData>;
}

export function AnnouncementSection({ form }: AnnouncementSectionProps) {
    return (
        <div className="space-y-4 pb-4">
            <FormField
                control={form.control}
                name="announcementEnabled"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Activo</FormLabel>
                            <FormDescription>
                                Mostrar barra de aviso
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="announcementMessage"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Mensaje</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="¡Envío gratis en compras mayores a $50.000!"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
