import { useCart } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { createBill } from '../../api/billService'
import { useState } from 'react'
import {useKeycloak} from "../../auth/KeycloakProvider.jsx";

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { keycloak } = useKeycloak()
    const email = keycloak.tokenParsed?.email

    const handleOrder = async () => {
        setLoading(true)
        setError(null)
        try {
            const billData = {
                email: email,
                productItems: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            }
            const createdBill = await createBill(billData)
            clearCart()
            navigate(`/bills/${createdBill.id}`)
        } catch (err) {
            setError('Erreur lors de la création de la facture.')
        } finally {
            setLoading(false)
        }
    }

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
                <p className="text-gray-400 text-sm">Votre panier est vide.</p>
                <button
                    onClick={() => navigate('/products')}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Retour au catalogue
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-medium text-gray-900">Panier</h1>
                <button
                    onClick={clearCart}
                    className="text-xs text-red-400 hover:text-red-600"
                >
                    Vider le panier
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
                {cartItems.map((item, index) => (
                    <div
                        key={item.id}
                        className={`flex items-center gap-4 px-5 py-4 ${
                            index !== cartItems.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                    >
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{item.price?.toFixed(2)} € / unité</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-sm"
                            >
                                −
                            </button>
                            <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-sm"
                            >
                                +
                            </button>
                        </div>

                        <div className="text-sm font-medium text-gray-900 w-16 text-right">
                            {(item.price * item.quantity).toFixed(2)} €
                        </div>

                        <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-300 hover:text-red-400 text-lg leading-none"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 mb-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="text-lg font-medium text-gray-900">{cartTotal.toFixed(2)} €</span>
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-500 mb-3">{error}</p>
            )}

            <button
                onClick={handleOrder}
                disabled={loading}
                className="w-full bg-blue-600 text-white text-sm font-medium py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? 'Création en cours...' : 'Confirmer la commande'}
            </button>
        </div>
    )
}