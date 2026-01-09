// pages/admin/pages/PageEditor.tsx
// Editor de página con Tiptap

import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Controller } from 'react-hook-form';
import { usePageForm } from './hooks/usePageForm';
import TiptapEditor from '@/components/ui/tiptap-editor';

export default function PageEditor() {
    const { id } = useParams();
    const pageId = id ? parseInt(id) : undefined;
    const { form, onSubmit, isLoading, isSaving, isEditMode } = usePageForm({ pageId });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="sm">
                    <Link to="/admin/paginas">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">
                    {isEditMode ? 'Editar Página' : 'Nueva Página'}
                </h1>
            </div>

            {/* Formulario */}
            <form onSubmit={onSubmit} className="space-y-6">
                <Card className="p-6 space-y-6">
                    {/* Información básica */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Información Básica</h2>

                        <div className="space-y-2">
                            <Label htmlFor="title">Título *</Label>
                            <Input
                                id="title"
                                {...form.register('title', { required: true })}
                                placeholder="Ej: Contacto"
                            />
                            <p className="text-xs text-muted-foreground">
                                El slug (URL) se generará automáticamente a partir del título
                            </p>
                        </div>

                        {/* Slug Editable */}
                        <div className="space-y-2">
                            <Label htmlFor="slug">URL de la página</Label>
                            <div className="flex items-center">
                                <span className="bg-muted px-3 py-2 border border-r-0 rounded-l-md text-sm text-muted-foreground h-9 flex items-center">
                                    /
                                </span>
                                <Input
                                    id="slug"
                                    {...form.register('slug')}
                                    placeholder="url-de-la-pagina"
                                    className="rounded-l-none"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {isEditMode
                                    ? "Modificar la URL puede afectar enlaces existentes."
                                    : "Si se deja vacío, se generará automáticamente desde el título."}
                            </p>
                        </div>

                        {/* Editor de contenido */}
                        <div className="space-y-2">
                            <Label>Contenido *</Label>
                            <Controller
                                name="content"
                                control={form.control}
                                render={({ field }) => (
                                    <TiptapEditor
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Publicación */}
                    <div className="flex items-center justify-between pt-6 border-t">
                        <div className="space-y-1">
                            <Label htmlFor="published">Publicar página</Label>
                            <p className="text-sm text-muted-foreground">
                                La página será visible públicamente
                            </p>
                        </div>
                        <Switch
                            id="published"
                            checked={form.watch('published')}
                            onCheckedChange={(checked) => form.setValue('published', checked)}
                        />
                    </div>
                </Card>

                {/* Acciones */}
                <div className="flex gap-3 justify-end">
                    <Button type="button" variant="outline" asChild>
                        <Link to="/admin/paginas">Cancelar</Link>
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear Página'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
