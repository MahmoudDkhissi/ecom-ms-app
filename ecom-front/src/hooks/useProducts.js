import { useQuery } from '@tanstack/react-query'
import { getAllProducts } from '../api/productService'

export function useProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: getAllProducts,
    })
}