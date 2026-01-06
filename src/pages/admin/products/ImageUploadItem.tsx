import { X, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface UI_ImageItem {
    id: string;
    url: string;
    originalFile?: File;
    position: number;
    status: 'server' | 'pending' | 'uploading' | 'error';
    progress?: number;
    serverUrl?: string;
}

interface ImageUploadItemProps {
    item: UI_ImageItem;
    index: number;
    onRemove: () => void;
    disabled: boolean;
}

export function ImageUploadItem({
    item,
    index,
    onRemove,
    disabled,
}: ImageUploadItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id, disabled });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "relative group aspect-square rounded-lg overflow-hidden border-2 transition-all bg-stone-100",
                isDragging ? "border-blue-500 z-50" : "border-stone-200",
                item.status === 'error' && "border-red-300 bg-red-50"
            )}
            {...attributes}
            {...listeners}
        >
            <img
                src={item.url}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover pointer-events-none select-none"
            />

            {/* Position badge */}
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                {index + 1}
            </div>

            {/* Uploading overlay */}
            {item.status === 'uploading' && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20">
                    <Loader2 className="h-8 w-8 text-white animate-spin mb-2" />
                    <span className="text-white text-xs font-semibold">{item.progress}%</span>
                </div>
            )}

            {/* Error overlay */}
            {item.status === 'error' && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center z-20">
                    <div className="bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center shadow-sm">
                        <AlertCircle className="w-3 h-3 mr-1" /> Error
                    </div>
                </div>
            )}

            {/* Remove button */}
            {!disabled && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 z-30 cursor-pointer"
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
