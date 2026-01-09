// components/ui/single-image-upload.tsx
// Componente simplificado para subir una única imagen (logo, favicon, etc.)
// Con compresión automática usando browser-image-compression

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/services/imageService';
import { IMAGE_COMPRESSION_OPTIONS } from '@/constants/image';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

interface SingleImageUploadProps {
    value?: string | null;
    onChange: (url: string | null) => void;
    folder?: string;
    placeholder?: string;
    aspectRatio?: 'square' | 'wide' | 'auto';
    disabled?: boolean;
}

export function SingleImageUpload({
    value,
    onChange,
    folder = 'settings',
    placeholder = 'Subir imagen',
    aspectRatio = 'auto',
    disabled = false,
}: SingleImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const aspectRatioClass = {
        square: 'aspect-square',
        wide: 'aspect-video',
        auto: 'aspect-auto min-h-[120px]',
    }[aspectRatio];

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo (más permisivo para Android)
        if (!file.type.startsWith('image/') && !file.name.match(/\.(jpg|jpeg|png|gif|webp|heic|heif)$/i)) {
            toast.error('Solo se permiten archivos de imagen');
            return;
        }

        // Validar tamaño máximo antes de comprimir (10MB para dar margen)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('La imagen no puede superar los 10MB');
            return;
        }

        try {
            setIsUploading(true);

            // Comprimir imagen antes de subir
            let fileToUpload: File = file;
            try {
                logger.log(`[SingleImageUpload] Comprimiendo: ${file.name}, tipo: ${file.type}, tamaño: ${(file.size / 1024).toFixed(2)}KB`);
                const compressedFile = await imageCompression(file, IMAGE_COMPRESSION_OPTIONS);
                fileToUpload = compressedFile;
                logger.log(
                    `Imagen comprimida: ${(file.size / 1024).toFixed(2)}KB → ${(compressedFile.size / 1024).toFixed(2)}KB`
                );
            } catch (compressionError) {
                logger.warn('[SingleImageUpload] Error comprimiendo imagen, usando original:', compressionError);
                // En Android puede fallar la compresión, continuamos con el archivo original
            }

            const url = await uploadImage(fileToUpload, folder);
            onChange(url);
            toast.success('Imagen subida correctamente');
        } catch (uploadError) {
            logger.error('[SingleImageUpload] Error al subir:', uploadError);
            toast.error('Error al subir la imagen');
        } finally {
            setIsUploading(false);
            // Limpiar input para permitir subir la misma imagen de nuevo
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = () => {
        onChange(null);
    };

    return (
        <div className="space-y-2">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={disabled || isUploading}
            />

            {value ? (
                // Vista con imagen cargada
                <div className={`relative rounded-lg overflow-hidden border bg-stone-50 ${aspectRatioClass}`}>
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-full object-contain"
                    />

                    {/* Overlay con acciones */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={disabled || isUploading}
                        >
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            Cambiar
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={handleRemove}
                            disabled={disabled || isUploading}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                // Vista sin imagen (dropzone)
                <div
                    onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
                    className={`
            border-2 border-dashed border-stone-200 rounded-lg 
            flex flex-col items-center justify-center cursor-pointer 
            hover:bg-stone-50 hover:border-stone-300 transition-colors
            ${aspectRatioClass}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                >
                    {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
                    ) : (
                        <>
                            <ImageIcon className="h-8 w-8 text-stone-400 mb-2" />
                            <p className="text-sm text-stone-500">{placeholder}</p>
                            <p className="text-xs text-stone-400 mt-1">Se optimizará automáticamente</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
