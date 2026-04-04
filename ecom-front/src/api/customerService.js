import api from './axiosInstance'

export const getAllCustomers = () =>
    api.get('/customers').then(res => res.data)

export const getCustomerById = (id) =>
    api.get(`/customers/${id}`).then(res => res.data)