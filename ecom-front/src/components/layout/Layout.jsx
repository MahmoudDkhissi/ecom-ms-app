import { Outlet, NavLink } from 'react-router-dom'

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <span className="font-semibold text-gray-900 text-lg">ecom-ms-app</span>
                    <div className="flex gap-6">
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
                                    ? 'text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1'
                                    : 'text-sm text-gray-500 hover:text-gray-900 pb-1'
                            }
                        >
                            Panier
                        </NavLink>
                        <NavLink
                            to="/bills"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1'
                                    : 'text-sm text-gray-500 hover:text-gray-900 pb-1'
                            }
                        >
                            Factures
                        </NavLink>
                    </div>
                </div>
            </nav>
            <main className="max-w-6xl mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    )
}