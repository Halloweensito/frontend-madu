import { Loader2 } from "lucide-react";
import { useActiveProducts } from "../../hooks/useCatalog";
import { ProductCard } from "../../components/commerce/ProductCard";
import { Breadcrumb } from "../../components/commerce/Breadcrumb";



export const Shop = () => {
    const { data: products, isLoading, error } = useActiveProducts();

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-stone-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-stone-400" size={40} />
            </div>
        );
    }
    if (error) {
        return (
            <div className="w-full min-h-screen bg-stone-50 flex items-center justify-center text-red-500">
                Error cargando productos.
            </div>
        );
    }
    const breadcrumbItems = [
        { label: 'Productos' }
    ];

    return (
        <div className="w-full bg-stone-50 min-h-screen">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Breadcrumb items={breadcrumbItems} />
                {products?.content && products.content.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.content.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-stone-500">
                        <p className="text-lg font-light">No hay productos disponibles en este momento.</p>
                        <p className="text-sm mt-2">Vuelve pronto para ver nuestras novedades.</p>
                    </div>
                )}
            </div>
        </div>
    );
}