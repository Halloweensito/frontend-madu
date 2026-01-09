// pages/admin/settings/components/MaintenanceCard.tsx
// Card de modo mantenimiento

import type { UseFormReturn } from 'react-hook-form';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

import type { StoreSettingsFormData } from '../types';

interface MaintenanceCardProps {
    form: UseFormReturn<StoreSettingsFormData>;
}

export const MaintenanceCard = ({ form }: MaintenanceCardProps) => {
    return (
        <Card className="mt-6 border-orange-200 bg-orange-50/50">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    ⚠️ Modo Mantenimiento
                </CardTitle>
                <CardDescription>
                    Activa este modo para mostrar una página de mantenimiento a los visitantes
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="maintenanceMode"
                        checked={form.watch('maintenanceMode')}
                        onCheckedChange={(checked) => form.setValue('maintenanceMode', checked)}
                    />
                    <Label htmlFor="maintenanceMode">
                        {form.watch('maintenanceMode') ? 'Activado' : 'Desactivado'}
                    </Label>
                </div>
            </CardContent>
        </Card>
    );
};
