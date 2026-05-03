import { useKeycloak } from '../auth/KeycloakProvider'

export function useAuth() {
    const { keycloak, authenticated, isAdmin, isUser, username, userId } = useKeycloak()

    return {
        isAdmin,
        isUser,
        username,
        userId,
        authenticated,
        logout: () => keycloak.logout({ redirectUri: 'http://localhost:5173' }),
    }
}