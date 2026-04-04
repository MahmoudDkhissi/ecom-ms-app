import api from './axiosInstance'

export const getAllBills = () =>
    api.get('/api/bills').then(res => res.data)

export const getBillById = (id) =>
    api.get(`/api/bills/${id}`).then(res => res.data)

export const createBill = (billData) =>
    api.post('/api/bills', billData).then(res => res.data)

export const deleteBill = (id) =>
    api.delete(`/api/bills/${id}`).then(res => res.data)