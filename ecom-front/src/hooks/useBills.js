import { useQuery } from '@tanstack/react-query'
import {getAllBills, getBillById, getBillsByCustomer} from '../api/billService'
import {useAuth} from "./useAuth.js";

export function useBills() {
    const { isAdmin, userId } = useAuth()

    return useQuery({
        queryKey: ['bills', isAdmin ? 'all' : userId],
        queryFn: () => isAdmin ? getAllBills() : getBillsByCustomer(userId),
        enabled: !!userId,
    })
}

export function useBill(id) {
    return useQuery({
        queryKey: ['bills', id],
        queryFn: () => getBillById(id),
        enabled: !!id,
    })
}