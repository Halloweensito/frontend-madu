// pages/admin/footer/components/LinkModal.tsx
// Modal para crear/editar links del footer

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { FooterLinkRequest } from '@/types/footerSection';
import type { PageContentRecord } from '@/types/pageContent';

interface LinkModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isEditing: boolean;
    form: FooterLinkRequest;
    onFormChange: (form: FooterLinkRequest) => void;
    linkType: 'custom' | 'page';
    onLinkTypeChange: (type: 'custom' | 'page') => void;
    onSave: () => void;
    isSaving: boolean;
    publishedPages: PageContentRecord[];
}

export function LinkModal({
    open,
    onOpenChange,
    isEditing,
    form,
    onFormChange,
    linkType,
    onLinkTypeChange,
    onSave,
    isSaving,
    publishedPages,
}: LinkModalProps) {
    const canSave =
        form.label &&
        ((linkType === 'custom' && form.url) || (linkType === 'page' && form.pageId));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Link' : 'Nuevo Link'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Tipo de enlace</Label>
                        <Select value={linkType} onValueChange={(v) => onLinkTypeChange(v as 'custom' | 'page')}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="custom">URL personalizada</SelectItem>
                                <SelectItem value="page">Página interna</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="link-label">Texto del enlace</Label>
                        <Input
                            id="link-label"
                            value={form.label}
                            onChange={(e) => onFormChange({ ...form, label: e.target.value })}
                            placeholder="Ej: Términos y Condiciones"
                        />
                    </div>

                    {linkType === 'custom' ? (
                        <div className="space-y-2">
                            <Label htmlFor="link-url">URL</Label>
                            <Input
                                id="link-url"
                                value={form.url}
                                onChange={(e) => onFormChange({ ...form, url: e.target.value })}
                                placeholder="https://ejemplo.com o /ruta-interna"
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label>Seleccionar página</Label>
                            <Select
                                value={form.pageId?.toString() || ''}
                                onValueChange={(v) => onFormChange({ ...form, pageId: parseInt(v) })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una página" />
                                </SelectTrigger>
                                <SelectContent>
                                    {publishedPages.map((page) => (
                                        <SelectItem key={page.id} value={page.id.toString()}>
                                            {page.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {publishedPages.length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                    No hay páginas publicadas disponibles
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <Label htmlFor="link-active">Activo</Label>
                        <Switch
                            id="link-active"
                            checked={form.active}
                            onCheckedChange={(checked) => onFormChange({ ...form, active: checked })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={onSave} disabled={!canSave || isSaving}>
                        {isSaving ? 'Guardando...' : 'Guardar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
