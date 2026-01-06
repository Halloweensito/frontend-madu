// pages/Search.tsx
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '@/hooks/useSearch';
import { SearchBar } from '@/components/search/SearchBar';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const {
        query,
        setQuery,
        products,
        isLoading,
        isFetching,
        isEmpty,
        totalElements,
        page,
        setPage,
        totalPages,
    } = useSearch(initialQuery);

    // Sincronizar query con URL
    useEffect(() => {
        if (query) {
            setSearchParams({ q: query });
        } else {
            setSearchParams({});
        }
    }, [query, setSearchParams]);

    const handleQueryChange = (newQuery: string) => {
        setQuery(newQuery);
        setPage(0); // Resetear a la primera página al cambiar búsqueda
    };

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Barra de búsqueda */}
                <div className="flex justify-center mb-8">
                    <SearchBar
                        value={query}
                        onChange={handleQueryChange}
                        autoFocus={true}
                    />
                </div>

                {/* Indicador de búsqueda activa */}
                {isFetching && query.length >= 2 && (
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-2 text-stone-500 text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Buscando...
                        </div>
                    </div>
                )}

                {/* Resultados */}
                {query.length < 2 ? (
                    <div className="text-center py-12 text-stone-500">
                        <p className="text-lg">Escribe al menos 2 caracteres para buscar</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
                    </div>
                ) : isEmpty ? (
                    <div className="text-center py-12">
                        <p className="text-stone-600 text-lg mb-2">
                            No se encontraron resultados para "{query}"
                        </p>
                        <p className="text-stone-500 text-sm">
                            Intenta con otras palabras clave
                        </p>
                    </div>
                ) : (
                    <div>
                        {/* Contador de resultados */}
                        <p className="text-stone-600 mb-6">
                            {totalElements} resultado{totalElements !== 1 ? 's' : ''} para "{query}"
                        </p>

                        {/* Grid de productos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    to={`/producto/${product.slug}`}
                                    className="group"
                                >
                                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="aspect-square overflow-hidden bg-stone-100">
                                            <img
                                                src={product.images?.[0]?.url || '/placeholder.jpg'}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium text-stone-900 mb-1 line-clamp-2">
                                                {product.name}
                                            </h3>
                                            {product.variants && product.variants.length > 0 && (
                                                <p className="text-stone-600">
                                                    ${product.variants[0].price.toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 0}
                                >
                                    Anterior
                                </Button>

                                <span className="text-sm text-stone-600 px-4">
                                    Página {page + 1} de {totalPages}
                                </span>

                                <Button
                                    variant="outline"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= totalPages - 1}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
