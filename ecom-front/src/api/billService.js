import api from './axiosInstance'

export const getAllBills = () =>
    api.get('/bills').then(res => res.data)

export const getMyBills = () =>
    api.get('/api/bills/my-bills').then(res => res.data)

export const getBillsByCustomer = (customerId) =>
    api.get(`/api/bills?customerId=${customerId}`).then(res => res.data)

export const getBillById = (id) =>
    api.get(`/api/bills/${id}`).then(res => res.data)

export const createBill = (billData) =>
    api.post('/api/bills', billData).then(res => res.data)

export const deleteBill = (id) =>
    api.delete(`/api/bills/${id}`).then(res => res.data)