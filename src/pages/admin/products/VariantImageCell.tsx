import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { type ImageRequest } from "@/types/types";

interface VariantImageCellProps {
    selectedUrl: string | undefined;
    generalImages: ImageRequest[];
    inheritsImages: boolean;
    onManage: () => void;
    onRemove: () => void;
    isGroupHeader?: boolean;
}

export function VariantImageCell({
    selectedUrl,
    generalImages,
    inheritsImages,
    onManage,
    onRemove,
    isGroupHeader = false
}: VariantImageCellProps) {
    const selectedImage = selectedUrl
        ? generalImages.find(img => img.url === selectedUrl)
        : undefined;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                >
                    {selectedImage ? (
                        <img
                            src={selectedImage.url}
                            alt="Variant"
                            className={`rounded-lg object-cover border-2 border-stone-200 ${isGroupHeader ? 'w-16 h-16' : 'w-12 h-12 sm:w-16 sm:h-16'}`}
                        />
                    ) : inheritsImages ? (
                        <div className={`rounded-lg border border-stone-200 flex items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors ${isGroupHeader ? 'w-16 h-16' : 'w-12 h-12 sm:w-16 sm:h-16'}`}>
                            <ImageIcon className="h-6 w-6 text-stone-400" />
                        </div>
                    ) : (
                        <div className={`rounded-lg border-2 border-dashed border-stone-300 flex items-center justify-center ${isGroupHeader ? 'bg-stone-100' : 'bg-stone-50'} hover:bg-stone-100 transition-colors ${isGroupHeader ? 'w-16 h-16' : 'w-12 h-12 sm:w-16 sm:h-16'}`}>
                            <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-stone-400" />
                        </div>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onManage}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    {isGroupHeader ? 'Aplicar a todas' : 'Gestionar'}
                </DropdownMenuItem>
                {selectedImage && (
                    <DropdownMenuItem onClick={onRemove} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isGroupHeader ? 'Quitar de todas' : 'Quitar imagen específica'}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
