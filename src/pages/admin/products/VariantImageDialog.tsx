import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import { type ImageRequest } from "@/types/types";

interface VariantImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variantDisplayName: string;
  selectedImageUrl?: string;
  generalImages: ImageRequest[];
  onSelectImage: (url: string | undefined) => void;
}

export function VariantImageDialog({
  open,
  onOpenChange,
  variantDisplayName,
  selectedImageUrl,
  generalImages,
  onSelectImage,
}: VariantImageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gestionar imágenes para {variantDisplayName}</DialogTitle>
          <DialogDescription>
            Selecciona UNA imagen de la galería general.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-6 gap-3 py-4 max-h-125 overflow-y-auto">
          {generalImages.length === 0 ? (
            <div className="col-span-6 text-center py-8 text-stone-500">
              No hay imágenes generales disponibles.
            </div>
          ) : (
            <>
              {/* Opción Heredar (Sin imagen específica) */}
              <div
                onClick={() => onSelectImage(undefined)}
                className={`relative aspect-square rounded-lg border-2 cursor-pointer transition-all ${
                  !selectedImageUrl
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full gap-2 p-2">
                  <ImageIcon className="h-6 w-6 text-stone-400" />
                  <span className="text-xs text-stone-600 font-medium text-center">Heredar generales</span>
                </div>
                {!selectedImageUrl && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">✓</div>
                )}
              </div>

              {/* Lista de Imágenes Generales */}
              {Array.from(new Map(generalImages.map(img => [img.url, img])).values()).map((img, idx) => {
                const isSelected = selectedImageUrl === img.url;
                return (
                  <div
                    key={`${img.url}-${idx}`}
                    onClick={() => onSelectImage(isSelected ? undefined : img.url)}
                    className={`relative aspect-square rounded-lg border-2 cursor-pointer transition-all overflow-hidden ${
                      isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <img src={img.url} alt={`Img ${idx}`} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">✓</div>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                        {(img.position ?? idx) + 1}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
            <Button type="button" onClick={() => onOpenChange(false)}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}