import { Outlet, NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../hooks/useAuth'

export default function Layout() {
    const { cartCount } = useCart()
    const { username, isAdmin, logout } = useAuth()

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900 text-lg">ecom-ms-app</span>
                        {isAdmin && (
                            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                Admin
              </span>
                        )}
                    </div>

                    <div className="flex gap-6 items-center">
                        <NavLink
                            to="/products"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1'
                                    : 'text-sm text-gray-500 hover:text-gray-900 pb-1'
                            }
                        >
                            Catalogue
                        </NavLink>
                        <NavLink
                            to="/cart"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1 flex items-center gap-2'
                                    : 'text-sm text-gray-500 hover:text-gray-900 pb-1 flex items-center gap-2'
                            }
                        >
                            Panier
                            {cartCount > 0 && (
                                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
                            )}
                        </NavLink>
                        <NavLink
                            to="/bills"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1'
                                    : 'text-sm text-gray-500 hover:text-gray-900 pb-1'
                            }
                        >
                            {isAdmin ? 'Toutes les factures' : 'Mes factures'}
                        </NavLink>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{username}</span>
                        <button
                            onClick={logout}
                            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            Déconnexion
                        </button>
                    </div>

                </div>
            </nav>
            <main className="max-w-6xl mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    )
}