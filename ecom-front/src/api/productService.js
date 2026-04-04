import api from './axiosInstance'

export const getAllProducts = () =>
    api.get('/products').then(res => res.data)

export const getProductById = (id) =>
    api.get(`/products/${id}`).then(res => res.data)