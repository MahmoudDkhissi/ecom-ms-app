import { createContext, useContext, useEffect, useState } from 'react'
import keycloak from './keycloak'

const KeycloakContext = createContext(null)

export function KeycloakProvider({ children }) {
    const [initialized, setInitialized] = useState(false)
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        keycloak
            .init({
                onLoad: 'login-required',
                checkLoginIframe: false,
            })
            .then((auth) => {
                setAuthenticated(auth)
                setInitialized(true)
            })
            .catch(() => {
                setInitialized(true)
            })
    }, [])

    if (!initialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="text-gray-400 text-sm">Chargement...</span>
            </div>
        )
    }

    const roles = keycloak.tokenParsed?.realm_access?.roles ?? []
    const isAdmin = roles.includes('ADMIN')
    const isUser = roles.includes('USER')
    const username = keycloak.tokenParsed?.preferred_username
    const userId = keycloak.tokenParsed?.sub

    return (
        <KeycloakContext.Provider value={{
            keycloak,
            authenticated,
            roles,
            isAdmin,
            isUser,
            username,
            userId,
        }}>
            {children}
        </KeycloakContext.Provider>
    )
}

export function useKeycloak() {
    return useContext(KeycloakContext)
}