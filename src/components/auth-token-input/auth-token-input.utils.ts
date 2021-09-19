import { GITHUB_AUTH_TOKEN_LS_KEY } from './auth-token-input.constants'
import { isEmpty } from 'lodash'

export const getAuthTokenFromLocalStorage = () => {
    return localStorage.getItem(GITHUB_AUTH_TOKEN_LS_KEY) ?? ''
}

export const setAuthTokenToLocalStorage = (token: string): void => {
    localStorage.setItem(GITHUB_AUTH_TOKEN_LS_KEY, token)
}

export const isAuthTokenValid = (token: string = '', prevToken: string = ''): boolean => {
    return (token?.length === 40 && token?.startsWith?.('ghp'))
        && (
            isEmpty(prevToken)
                ? true
                : token !== prevToken
        )
}
