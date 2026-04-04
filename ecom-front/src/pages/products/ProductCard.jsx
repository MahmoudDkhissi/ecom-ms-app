import { useCart } from '../../context/CartContext'

export default function ProductCard({ product }) {
    const { addToCart, cartItems } = useCart()

    const itemInCart = cartItems.find(item => item.id === product.id)

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-sm font-medium text-gray-900">{product.name}</h2>
                    <p className="text-xs text-gray-400 mt-1">{product.description}</p>
                </div>
                {product.discount > 0 && (
                    <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
            -{product.discount}%
          </span>
                )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <span className="text-base font-medium text-gray-900">
          {product.price?.toFixed(2)} €
        </span>
                <button
                    onClick={() => addToCart(product)}
                    className="text-sm px-3 py-1.5 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                >
                    {itemInCart ? `Dans le panier (${itemInCart.quantity})` : 'Ajouter'}
                </button>
            </div>
        </div>
    )
}