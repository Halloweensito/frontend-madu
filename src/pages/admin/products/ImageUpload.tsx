import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/services/imageService";
import type { ImageRequest } from "@/types/types";
import imageCompression from "browser-image-compression";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { IMAGE_UPLOAD_CONFIG, IMAGE_FORMATS, IMAGE_COMPRESSION_OPTIONS } from "@/constants/image";
import { logger } from "@/utils/logger";
import { ImageUploadItem, type UI_ImageItem } from "./ImageUploadItem";

interface ImageUploadProps {
  value: ImageRequest[];
  onChange: (images: ImageRequest[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export interface ImageUploadHandle {
  uploadPreviews: () => Promise<ImageRequest[]>;
  hasPreviews: () => boolean;
  getPreviews: () => ImageRequest[];
}

export const ImageUpload = forwardRef<ImageUploadHandle, ImageUploadProps>(({
  value = [],
  onChange,
  maxImages = IMAGE_UPLOAD_CONFIG.DEFAULT_MAX_IMAGES,
  disabled = false,
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uiItems, setUiItems] = useState<UI_ImageItem[]>([]);
  // Track the last URLs we sent to parent to avoid race conditions
  const lastSentUrlsRef = useRef<string>("");

  // Sincronización Inicial (Props -> State)
  // Solo sincroniza si las URLs del servidor son diferentes a las que enviamos
  useEffect(() => {
    const propsUrls = value.map(v => v.url).sort().join(',');

    // Si las URLs de props son iguales a las que enviamos, ignorar (es nuestro propio update)
    if (propsUrls === lastSentUrlsRef.current) {
      return;
    }

    setUiItems(prevItems => {
      const newItems: UI_ImageItem[] = value.map((req, idx) => {
        const existing = prevItems.find(p => p.serverUrl === req.url || p.url === req.url);
        return {
          id: existing?.id || `server-${req.url}-${idx}`,
          url: req.url,
          position: req.position ?? idx,
          status: 'server',
          serverUrl: req.url
        };
      });

      const pendingItems = prevItems.filter(p => p.status !== 'server' && p.status !== 'error');
      return [...newItems, ...pendingItems].sort((a, b) => a.position - b.position);
    });
  }, [value]);

  const notifyParent = (items: UI_ImageItem[]) => {
    const allValidImages: ImageRequest[] = items
      .filter(item => item.status !== 'error')
      .map((item, index) => ({
        url: item.url,
        position: index,
        tempId: item.id
      }));

    // Guardar las URLs que estamos enviando para evitar que el useEffect las restaure
    lastSentUrlsRef.current = allValidImages.map(i => i.url).sort().join(',');

    onChange(allValidImages);
  };

  const processUpload = async (itemId: string, file: File) => {
    try {
      setUiItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, status: 'uploading', progress: 0 } : item
      ));

      let fileToUpload = file;
      try {
        const compressedFile = await imageCompression(file, IMAGE_COMPRESSION_OPTIONS);
        fileToUpload = compressedFile;
      } catch (compressionError) {
        logger.warn("Error comprimiendo imagen, usando original:", compressionError);
      }

      setUiItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, progress: 30 } : item
      ));

      const uploadedUrl = await uploadImage(fileToUpload);

      setUiItems(prev => {
        const newItems = prev.map(item =>
          item.id === itemId
            ? { ...item, status: 'server' as const, progress: 100, serverUrl: uploadedUrl, url: uploadedUrl }
            : item
        );
        setTimeout(() => notifyParent(newItems), 0);
        return newItems;
      });

    } catch (error) {
      logger.error("Upload failed:", error);
      setUiItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, status: 'error' } : item
      ));
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    if (uiItems.length + files.length > maxImages) {
      alert(`Máximo ${maxImages} imágenes permitidas.`);
      return;
    }

    try {
      // Función para generar ID único (compatible con Android)
      const generateId = () => {
        try {
          return crypto.randomUUID();
        } catch {
          // Fallback para navegadores que no soportan randomUUID
          return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);
        }
      };

      const newItems: UI_ImageItem[] = Array.from(files).map((file, idx) => ({
        id: generateId(),
        url: URL.createObjectURL(file),
        originalFile: file,
        position: uiItems.length + idx,
        status: 'pending' as const,
        progress: 0
      }));

      setUiItems(prev => {
        const updated = [...prev, ...newItems];
        setTimeout(() => notifyParent(updated), 0);
        return updated;
      });

      if (fileInputRef.current) fileInputRef.current.value = "";

      for (const item of newItems) {
        if (item.originalFile) {
          processUpload(item.id, item.originalFile);
        }
      }

    } catch (error) {
      logger.error("Error en handleFileSelect:", error);
    }
  };

  const handleRemove = (id: string) => {
    setUiItems(prev => {
      const itemToRemove = prev.find(i => i.id === id);
      if (itemToRemove?.url.startsWith('blob:')) {
        URL.revokeObjectURL(itemToRemove.url);
      }

      const filtered = prev.filter(i => i.id !== id);
      const reindexed = filtered.map((item, idx) => ({ ...item, position: idx }));

      setTimeout(() => notifyParent(reindexed), 0);
      return reindexed;
    });
  };

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setUiItems(prev => {
      const oldIndex = prev.findIndex(item => item.id === active.id);
      const newIndex = prev.findIndex(item => item.id === over.id);

      const reordered = arrayMove(prev, oldIndex, newIndex).map((item, idx) => ({
        ...item,
        position: idx
      }));

      setTimeout(() => notifyParent(reordered), 0);
      return reordered;
    });
  };

  useImperativeHandle(ref, () => ({
    hasPreviews: () => uiItems.some(i => i.status !== 'server'),
    uploadPreviews: async () => {
      return uiItems
        .filter(i => i.status === 'server' && i.serverUrl)
        .map(i => ({
          url: i.serverUrl!,
          position: i.position,
          tempId: i.id
        }));
    },
    getPreviews: () => uiItems.map(i => ({ url: i.url, position: i.position, tempId: i.id }))
  }));

  useEffect(() => {
    return () => {
      uiItems.forEach(item => {
        if (item.url.startsWith('blob:')) URL.revokeObjectURL(item.url);
      });
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-500">
          {uiItems.length} / {maxImages} imágenes
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => !disabled && fileInputRef.current?.click()}
          disabled={disabled || uiItems.length >= maxImages}
        >
          <Upload className="mr-2 h-4 w-4" /> Subir
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={IMAGE_FORMATS.ACCEPT_STRING}
        className="hidden"
        onChange={handleFileSelect}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={uiItems.map(i => i.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uiItems.map((item, index) => (
              <ImageUploadItem
                key={item.id}
                item={item}
                index={index}
                disabled={disabled}
                onRemove={() => handleRemove(item.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {uiItems.length === 0 && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-stone-200 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-stone-50 transition-colors"
        >
          <ImageIcon className="h-10 w-10 text-stone-400 mb-2" />
          <p className="text-sm text-stone-500">Click para subir imágenes</p>
        </div>
      )}
    </div>
  );
});

ImageUpload.displayName = "ImageUpload";