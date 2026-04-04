import { useProducts } from '../../hooks/useProducts'
import ProductCard from './ProductCard'

export default function ProductsPage() {
    const { data, isLoading, isError } = useProducts()

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="text-gray-400 text-sm">Chargement des produits...</span>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-64">
        <span className="text-red-500 text-sm">
          Impossible de charger les produits. Vérifie que le back tourne sur le port 8888.
        </span>
            </div>
        )
    }

    const products = data?._embedded?.products ?? data ?? []

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-medium text-gray-900">Catalogue</h1>
                <span className="text-sm text-gray-400">{products.length} produits</span>
            </div>
            {products.length === 0 ? (
                <p className="text-gray-400 text-sm">Aucun produit disponible.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}