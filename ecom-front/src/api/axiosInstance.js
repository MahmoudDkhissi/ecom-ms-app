import axios from 'axios'
import keycloak from '../auth/keycloak'

const api = axios.create({
    baseURL: 'http://localhost:8888',
})

api.interceptors.request.use((config) => {
    if (keycloak.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`
    }
    if (keycloak.tokenParsed?.email) {
        config.headers['X-User-Email'] = keycloak.tokenParsed.email
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                await keycloak.updateToken(30)
                error.config.headers.Authorization = `Bearer ${keycloak.token}`
                return api.request(error.config)
            } catch {
                await keycloak.login()
            }
        }
        return Promise.reject(error)
    }
)

export default api