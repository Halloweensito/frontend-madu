import { ArrowLeft, Loader2, AlertCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { CategorySelector } from '../products/CategorySelector';
import { ImageUpload } from '../products/ImageUpload';
import { useCategoryForm } from './hooks/useCategoryForm';

export default function CategoryCreate() {
    const {
        form,
        imageUploadRef,
        onSubmit,
        isSubmitting,
        isEditMode,
        categoryId,
        isLoadingCategory,
        categoryError,
        availableParents,
        isLoadingCategories,
        categoriesError,
        navigate,
    } = useCategoryForm();

    // Loading State Global
    if (isEditMode && isLoadingCategory) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-stone-300" />
            </div>
        );
    }

    // Error State
    if (isEditMode && categoryError) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-red-500">
                <AlertCircle className="h-12 w-12" />
                <h2 className="text-lg font-semibold">No se pudo cargar la categoría</h2>
                <Button variant="outline" onClick={() => navigate('/admin/categorias')}>
                    Volver al listado
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* Header con acciones */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate('/admin/categorias')}
                        className="h-10 w-10 rounded-full bg-white"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
                            {isEditMode ? 'Editar Categoría' : 'Nueva Categoría'}
                        </h1>
                        <p className="text-sm text-stone-500">
                            {isEditMode ? `ID: ${categoryId}` : 'Crea una nueva sección para tu catálogo'}
                        </p>
                    </div>
                </div>

                {/* Botones de acción superiores (UX móvil) */}
                <div className="flex gap-3 sm:hidden">
                    <Button
                        className="w-full"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Guardar
                    </Button>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Columna Izquierda: Datos Principales */}
                        <div className="md:col-span-2 space-y-6">
                            <Card className="border-stone-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Detalles Generales</CardTitle>
                                    <CardDescription>Información básica visible para el cliente</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre de la Categoría</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej. Zapatillas Deportivas" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Descripción (Opcional)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Breve descripción para SEO y clientes..."
                                                        className="min-h-[120px] resize-y"
                                                        {...field}
                                                        value={field.value ?? ''}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="border-stone-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Configuración Técnica</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <FormField
                                        control={form.control}
                                        name="parentId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Categoría Padre</FormLabel>
                                                <FormControl>
                                                    <CategorySelector
                                                        categories={availableParents}
                                                        isLoading={isLoadingCategories}
                                                        error={categoriesError}
                                                        value={field.value ?? undefined}
                                                        onValueChange={(value) => field.onChange(value || null)}
                                                        placeholder="Es una categoría principal"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Si seleccionas una, esta categoría será una sub-categoría.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Columna Derecha: Multimedia y Estado */}
                        <div className="space-y-6">
                            <Card className="border-stone-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Imagen de Portada</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="imageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <ImageUpload
                                                        ref={imageUploadRef}
                                                        value={field.value ? [{ url: field.value }] : []}
                                                        onChange={(images) => field.onChange(images[0]?.url || null)}
                                                        disabled={isSubmitting}
                                                        maxImages={1}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="border-stone-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Estado</CardTitle>
                                    <CardDescription>
                                        Controla la visibilidad de esta categoría
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Estado de la Categoría</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        key={field.value} // 🔑 Mantenemos el fix de seguridad
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value || 'ACTIVE'}
                                                        value={field.value || 'ACTIVE'}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona un estado" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="ACTIVE">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                                                    <span>Activa</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="INACTIVE">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                                                    <span>Inactiva</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="ARCHIVED">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-2 w-2 rounded-full bg-stone-400" />
                                                                    <span>Archivada</span>
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <div className="hidden sm:flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full bg-stone-900 hover:bg-black"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isEditMode ? 'Guardar Cambios' : 'Crear Categoría'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    onClick={() => navigate('/admin/categorias')}
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}