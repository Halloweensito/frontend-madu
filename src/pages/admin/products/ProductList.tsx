// ProductList.tsx
import { useNavigate } from "react-router-dom";
import { Plus, Loader2, AlertCircle, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useProducts, useDeleteProduct } from "@/hooks/useCatalog";
import type { ProductResponse, ProductVariantResponse } from "@/types/types";

// Helper functions
function getFirstProductImage(product: ProductResponse): string | null {
  for (const variant of product.variants) {
    if (variant.images && variant.images.length > 0) {
      return variant.images[0].url;
    }
  }
  return null;
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

// Mobile product card component
function MobileProductCard({ product }: { product: ProductResponse }) {
  const navigate = useNavigate();
  const deleteProduct = useDeleteProduct();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const firstImage = getFirstProductImage(product);
  const totalStock = getTotalStock(product);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success("Producto eliminado");
      setShowDeleteDialog(false);
    } catch {
      toast.error("Error al eliminar producto");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="p-3">
        <div className="flex gap-3">
          {/* Imagen */}
          {firstImage ? (
            <img
              src={firstImage}
              alt={product.name}
              className="w-16 h-16 rounded object-cover border border-stone-200 bg-stone-50 shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
              <span className="text-xs text-stone-400">Sin img</span>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                <p className="text-xs text-stone-500">{product.category?.name || 'Sin categoría'}</p>
              </div>

              {/* Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/producto/${product.slug}`)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/admin/productos/editar/${product.id}`)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-sm font-medium">{getPriceRange(product)}</span>
              <Badge
                variant={totalStock > 10 ? "default" : totalStock > 0 ? "secondary" : "destructive"}
                className="font-mono text-xs"
              >
                {totalStock} uds
              </Badge>
              <span className="text-xs text-stone-500">
                {product.variants.length} var.
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará "{product.name}" y todas sus variantes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function ProductList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const { data: productsData, isLoading, error } = useProducts({ page: currentPage, size: pageSize });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Encabezado - responsive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Productos
          </h1>
          <p className="text-stone-500 text-sm sm:text-base">
            Gestiona tu catálogo, precios y stock.
          </p>
        </div>
        <Button onClick={() => navigate("/admin/productos/nuevo")} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      {/* Estados de carga y error */}
      {isLoading && (
        <div className="bg-white rounded-md border border-stone-200 shadow-sm p-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
            <p className="text-sm text-stone-500">Cargando productos...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-white rounded-md border border-red-200 shadow-sm p-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-sm text-red-600">
              Error al cargar los productos. Por favor, intenta nuevamente.
            </p>
          </div>
        </div>
      )}

      {/* Vista móvil: Cards */}
      {!isLoading && !error && (
        <div className="block sm:hidden space-y-3">
          {productsData?.content && productsData.content.length > 0 ? (
            productsData.content.map((product) => (
              <MobileProductCard key={product.id} product={product} />
            ))
          ) : (
            <Card className="p-8 text-center text-stone-500">
              No hay productos creados
            </Card>
          )}
        </div>
      )}

      {/* Vista desktop: Tabla */}
      {!isLoading && !error && (
        <div className="hidden sm:block bg-white rounded-md border border-stone-200 shadow-sm overflow-hidden">
          <DataTable columns={columns} data={productsData?.content || []} />
        </div>
      )}

      {/* Paginación */}
      {!isLoading && !error && productsData && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={productsData.totalPages}
          totalElements={productsData.totalElements}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}