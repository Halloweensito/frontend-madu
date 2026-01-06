// ProductList.tsx
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useCatalog";

export default function ProductList() {
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useProducts();

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Productos
          </h1>
          <p className="text-stone-500">
            Gestiona tu catálogo, precios y stock.
          </p>
        </div>
        <Button onClick={() => navigate("/admin/productos/nuevo")}>
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

      {/* Tabla */}
      {!isLoading && !error && (
        <div className="bg-white rounded-md border border-stone-200 shadow-sm overflow-hidden">
          <DataTable columns={columns} data={products?.content || []} />
        </div>
      )}
    </div>
  );
}