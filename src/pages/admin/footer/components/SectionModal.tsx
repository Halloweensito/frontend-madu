// pages/admin/footer/components/SectionModal.tsx
// Modal para crear/editar secciones del footer

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import type { FooterSectionRequest } from '@/types/footerSection';

interface SectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isEditing: boolean;
    form: FooterSectionRequest;
    onFormChange: (form: FooterSectionRequest) => void;
    onSave: () => void;
    isSaving: boolean;
}

export function SectionModal({
    open,
    onOpenChange,
    isEditing,
    form,
    onFormChange,
    onSave,
    isSaving,
}: SectionModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Sección' : 'Nueva Sección'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="section-title">Título</Label>
                        <Input
                            id="section-title"
                            value={form.title}
                            onChange={(e) => onFormChange({ ...form, title: e.target.value })}
                            placeholder="Ej: Ayuda"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="section-active">Activo</Label>
                        <Switch
                            id="section-active"
                            checked={form.active}
                            onCheckedChange={(checked) => onFormChange({ ...form, active: checked })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={onSave} disabled={!form.title || isSaving}>
                        {isSaving ? 'Guardando...' : 'Guardar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
