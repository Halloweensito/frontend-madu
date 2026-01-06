import { useState, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import { Plus, X, Loader2, AlertCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { type CategoryResponse } from "@/types/types";
import { useCreateCategory } from "@/hooks/useCatalog";
import { uploadImage } from "@/services/imageService";
import { logger } from "@/utils/logger";
import imageCompression from "browser-image-compression";
import { IMAGE_COMPRESSION_OPTIONS } from "@/constants/image";

// ✅ 1. INTERFAZ CORREGIDA
export interface CategorySelectorProps {
  categories: CategoryResponse[] | undefined;
  isLoading: boolean;
  error: Error | null;
  // Permitimos undefined o null para formularios vacíos
  value?: number | null;
  // La función devuelve null si se limpia la selección
  onValueChange: (categoryId: number | null) => void;
  disabled?: boolean;
  placeholder?: string;
  // Nueva prop para decidir si permitimos seleccionar "Ninguna" (Raíz)
  allowRoot?: boolean;
}

export function CategorySelector({
  categories = [],
  isLoading,
  error,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Selecciona una categoría",
  allowRoot = false, // Por defecto false (para Productos)
}: CategorySelectorProps) {
  // --- ESTADOS PARA CREACIÓN INLINE ---
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryParentId, setNewCategoryParentId] = useState<number | undefined>(undefined);
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const createCategoryMutation = useCreateCategory();

  // Refs para UX (foco)
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const createButtonRef = useRef<HTMLButtonElement>(null);

  // --- MANEJO DE TECLAS ---
  const handleKeyDown = (e: KeyboardEvent, nextFieldRef?: React.RefObject<HTMLElement | null>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextFieldRef?.current?.focus();
    }
  };

  // --- LÓGICA DE IMAGEN (COMPRESIÓN) ---
  const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen');
      return;
    }

    try {
      setIsUploadingImage(true);
      const compressedFile = await imageCompression(file, IMAGE_COMPRESSION_OPTIONS);

      setNewCategoryImage(compressedFile);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(compressedFile);

      logger.log(`Imagen comprimida: ${(file.size / 1024).toFixed(2)}KB → ${(compressedFile.size / 1024).toFixed(2)}KB`);
    } catch (error) {
      logger.error('Error comprimiendo imagen:', error);
      // Fallback a imagen original si falla compresión
      setNewCategoryImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setNewCategoryImage(null);
    setImagePreview(null);
  };

  // --- LÓGICA DE CREACIÓN ---
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Por favor ingresa un nombre para la categoría");
      return;
    }

    try {
      setIsUploadingImage(true);
      let imageUrl: string | undefined = undefined;

      if (newCategoryImage) {
        imageUrl = await uploadImage(newCategoryImage);
      }

      const newCategory = await createCategoryMutation.mutateAsync({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined,
        parentId: newCategoryParentId,
        imageUrl,
        status: 'ACTIVE',
        sortOrder: 0,
      });

      // ✅ Seleccionamos automáticamente la nueva categoría
      onValueChange(newCategory.id);

      // Reset y cerrar modal inline
      handleCancelCreateCategory();
    } catch (error) {
      logger.error("Error al crear categoría:", error);
      alert("Error al crear la categoría.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCancelCreateCategory = () => {
    setIsCreatingCategory(false);
    setNewCategoryName("");
    setNewCategoryDescription("");
    setNewCategoryParentId(undefined);
    setNewCategoryImage(null);
    setImagePreview(null);
  };

  // --- RENDERIZADO RECURSIVO DEL ÁRBOL ---
  const renderCategoryNode = (cat: CategoryResponse, depth = 0) => {
    return (
      <div key={cat.id}>
        <SelectItem value={cat.id.toString()}>
          <div className="flex items-center" style={{ paddingLeft: depth * 12 }}>
            {cat.imageUrl ? (
              <Avatar className="mr-2 h-6 w-6">
                <AvatarImage src={cat.imageUrl} alt={cat.name} />
              </Avatar>
            ) : (
              <div className="mr-2 h-6 w-6 rounded-full bg-stone-100 flex-shrink-0" />
            )}
            <span className="truncate">{cat.name}</span>
          </div>
        </SelectItem>
        {cat.subCategories && cat.subCategories.length > 0 && (
          cat.subCategories.map((c) => renderCategoryNode(c, depth + 1))
        )}
      </div>
    );
  };

  // --- VISTA DE CREACIÓN ---
  if (isCreatingCategory) {
    return (
      <Card className="bg-stone-50 border-2 border-dashed">
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-sm">Crear Nueva Categoría</h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCancelCreateCategory}
              disabled={createCategoryMutation.isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre *</label>
              <Input
                ref={nameInputRef}
                placeholder="Ej: Accesorios"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                disabled={createCategoryMutation.isPending || isUploadingImage}
                onKeyDown={(e) => handleKeyDown(e, descriptionInputRef)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                ref={descriptionInputRef}
                placeholder="Descripción..."
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                disabled={createCategoryMutation.isPending}
                rows={2}
                className="resize-none"
              />
            </div>

            {/* Selector de padre simple dentro de la creación */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría Padre</label>
              <Select
                value={newCategoryParentId?.toString() || "none"}
                onValueChange={(val) => setNewCategoryParentId(val === "none" ? undefined : Number(val))}
                disabled={createCategoryMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sin padre (Nivel superior)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin padre</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Imagen</label>
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-24 object-cover rounded-lg border" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-stone-400 bg-white">
                  <Upload className="h-6 w-6 text-stone-400" />
                  <span className="text-xs text-stone-500 mt-1">Subir imagen</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                </label>
              )}
            </div>
          </div>

          <Button
            ref={createButtonRef}
            type="button"
            className="w-full"
            onClick={handleCreateCategory}
            disabled={!newCategoryName.trim() || createCategoryMutation.isPending || isUploadingImage}
          >
            {createCategoryMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Guardar Categoría
          </Button>
        </CardContent>
      </Card>
    );
  }

  // --- PREPARACIÓN DEL VALOR PARA SELECT ---
  // ✅ Convertimos el valor numérico a string para Shadcn Select
  // ✅ IMPORTANTE: Siempre debe ser string (nunca undefined) para evitar warning controlled/uncontrolled
  let selectValue = ""; // Default: empty string (unselected)

  // Helper function to recursively check if category exists
  const categoryExists = (catId: number, cats: CategoryResponse[]): boolean => {
    for (const cat of cats) {
      if (cat.id === catId) return true;
      if (cat.subCategories && cat.subCategories.length > 0) {
        if (categoryExists(catId, cat.subCategories)) return true;
      }
    }
    return false;
  };

  if (value) {
    // Si tenemos un valor, verificamos que exista en las categorías cargadas
    const exists = categoryExists(value, categories);
    if (exists || !isLoading) {
      selectValue = value.toString();
    }
  } else if (allowRoot && value === null) {
    // Caso especial para "Categoría Raíz" seleccionada explícitamente
    selectValue = "root";
  }

  // Debug logging
  logger.debug('🔍 CategorySelector - Value state:', {
    receivedValue: value,
    computedSelectValue: selectValue,
    categoriesCount: categories.length,
    isLoading,
    exists: value ? categoryExists(value, categories) : 'N/A'
  });

  return (
    <Select
      value={selectValue}
      onValueChange={(val) => {
        if (val === "new_category") {
          setIsCreatingCategory(true);
        } else if (val === "root") {
          onValueChange(null);
        } else {
          onValueChange(Number(val));
        }
      }}
      disabled={disabled || isLoading || !!error}
    >
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder={isLoading ? "Cargando..." : placeholder} />
      </SelectTrigger>

      <SelectContent>
        {/* Opción de Crear */}
        <SelectItem value="new_category" className="font-medium text-blue-600 focus:text-blue-700 bg-blue-50 focus:bg-blue-100">
          <Plus className="inline mr-2 h-4 w-4" />
          Crear Nueva Categoría
        </SelectItem>

        {/* Opción Raíz (Solo si allowRoot es true) */}
        {allowRoot && (
          <SelectItem value="root" className="text-stone-500 italic border-t mt-1 pt-1">
            — Ninguna (Categoría Principal) —
          </SelectItem>
        )}

        {/* Lista de Categorías */}
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin text-stone-400" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 p-4 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>Error al cargar</span>
          </div>
        ) : categories.length > 0 ? (
          <>
            {!allowRoot && <div className="h-px bg-stone-100 my-1" />}
            {categories.map((category) => renderCategoryNode(category))}
          </>
        ) : (
          <div className="p-4 text-sm text-stone-500">No hay categorías</div>
        )}
      </SelectContent>
    </Select>
  );
}