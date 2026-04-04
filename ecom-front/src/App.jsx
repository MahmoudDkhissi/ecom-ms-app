import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CartProvider } from './context/CartContext'
import Layout from './components/layout/Layout'
import ProductsPage from './pages/products/ProductsPage'
import CartPage from './pages/cart/CartPage'
import BillsPage from './pages/bills/BillsPage'
import BillDetailPage from './pages/bills/BillDetailPage'

const queryClient = new QueryClient()

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <CartProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Navigate to="/products" replace />} />
                            <Route path="products" element={<ProductsPage />} />
                            <Route path="cart" element={<CartPage />} />
                            <Route path="bills" element={<BillsPage />} />
                            <Route path="bills/:id" element={<BillDetailPage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </QueryClientProvider>
    )
}