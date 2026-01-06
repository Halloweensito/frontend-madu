import { type ColumnDef } from "@tanstack/react-table";
import { type ProductResponse, type AttributeValueResponse, type ProductVariantResponse } from "@/types/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, Eye, Loader2, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useDeleteProduct } from "@/hooks/useCatalog";
import { useState } from "react";

function ProductActions({ product }: { product: ProductResponse }) {
  const navigate = useNavigate();
  const deleteProduct = useDeleteProduct();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    navigate(`/admin/productos/editar/${product.id}`);
  };

  const handleView = () => {
    navigate(`/producto/${product.slug}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    // ✅ Bloquear inmediatamente al hacer click
    if (isDeleting) return;

    // ✅ Activar estado inmediatamente para bloquear el botón
    setIsDeleting(true);

    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success("Producto eliminado exitosamente");
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      toast.error("Hubo un error al eliminar el producto");
    } finally {
      setIsDeleting(false);
    }
    // ✅ No usar finally aquí - si es exitoso, el componente se desmontará
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting}>
            <span className="sr-only">Abrir menú</span>
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(product.slug)}
          >
            Copiar slug
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleView}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="text-red-600"
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el producto <strong>"{product.name}"</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-stone-600">
              Esta acción no se puede deshacer. El producto y todas sus variantes serán eliminados permanentemente.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function formatVariantAttributes(attributes: AttributeValueResponse[] | Record<string, string> | undefined): string {
  if (!attributes) return "";

  if (Array.isArray(attributes)) {
    return attributes
      .map(attr => typeof attr === 'object' && 'value' in attr ? attr.value : String(attr))
      .join(" • ");
  }

  if (typeof attributes === 'object') {
    return Object.values(attributes).join(" • ");
  }

  return "";
}

function getTotalStock(product: ProductResponse): number {
  return product.variants.reduce((sum: number, v: ProductVariantResponse) => sum + v.stock, 0);
}

function getPriceRange(product: ProductResponse): string {
  const prices = product.variants.map((v: ProductVariantResponse) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  if (min === max) {
    return `$${min.toLocaleString('es-AR')}`;
  }
  return `$${min.toLocaleString('es-AR')} - $${max.toLocaleString('es-AR')}`;
}

function getFirstProductImage(product: ProductResponse): string | null {
  // Buscar la primera imagen de cualquier variante
  for (const variant of product.variants) {
    if (variant.images && variant.images.length > 0) {
      // Las imágenes ya vienen combinadas (generales + específicas) del mapper
      return variant.images[0].url;
    }
  }
  return null;
}

export const columns: ColumnDef<ProductResponse>[] = [
  {
    accessorKey: "name",
    header: "Producto",
    cell: ({ row }) => {
      const product = row.original;
      const firstImage = getFirstProductImage(product);

      return (
        <div className="flex items-center gap-3">
          {firstImage ? (
            <img
              src={firstImage}
              alt={product.name}
              className="w-14 h-14 rounded object-cover border border-stone-200 bg-stone-50"
              onError={(e) => {
                // Si la imagen falla al cargar, mostrar placeholder
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.image-placeholder')) {
                  const placeholder = document.createElement('div');
                  placeholder.className = 'image-placeholder w-14 h-14 rounded bg-stone-100 border border-stone-200 flex items-center justify-center';
                  placeholder.innerHTML = '<span class="text-xs text-stone-400">Sin imagen</span>';
                  parent.appendChild(placeholder);
                }
              }}
            />
          ) : (
            <div className="w-14 h-14 rounded bg-stone-100 border border-stone-200 flex items-center justify-center">
              <span className="text-xs text-stone-400">Sin imagen</span>
            </div>
          )}
          <div>
            <div className="font-medium text-stone-900">{product.name}</div>
            <div className="text-sm text-stone-500">{product.category?.name || 'Sin categoría'}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "variants",
    header: "Variantes",
    cell: ({ row }) => {
      const product = row.original;
      const variantCount = product.variants.length;

      return (
        <div className="space-y-1">
          <div className="text-sm font-medium text-stone-700">
            {variantCount} {variantCount === 1 ? 'variante' : 'variantes'}
          </div>
          <div className="text-xs text-stone-500 space-y-0.5">
            {product.variants.slice(0, 3).map((variant: ProductVariantResponse, idx: number) => (
              <div key={idx}>
                {formatVariantAttributes(variant.attributeValues)}
              </div>
            ))}
            {variantCount > 3 && (
              <div className="text-stone-400 italic">
                +{variantCount - 3} más
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="font-medium text-stone-900">
          {getPriceRange(product)}
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const product = row.original;
      const totalStock = getTotalStock(product);

      return (
        <Badge
          variant={totalStock > 10 ? "default" : totalStock > 0 ? "secondary" : "destructive"}
          className="font-mono"
        >
          {totalStock} {totalStock === 1 ? 'unidad' : 'unidades'}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const product = row.original;
      const status = product.status || 'ACTIVE';

      const statusConfig = {
        ACTIVE: { label: 'Activo', className: 'bg-green-50 text-green-700' },
        INACTIVE: { label: 'Inactivo', className: 'bg-yellow-50 text-yellow-700' },
        ARCHIVED: { label: 'Archivado', className: 'bg-stone-100 text-stone-600' },
      };

      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE;

      return (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.className}`}>
          {config.label}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ProductActions product={row.original} />;
    },
  },
];