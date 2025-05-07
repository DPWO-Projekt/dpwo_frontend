const TOKEN_KEY = 'auth_token';

export const AuthService = {
    getToken: (): string | null => {
        return localStorage.getItem(TOKEN_KEY);
    },

    setToken: (token: string): void => {
        localStorage.setItem(TOKEN_KEY, token);
    },

    removeToken: (): void => {
        localStorage.removeItem(TOKEN_KEY);
    },

    isAuthenticated: (): boolean => {
        return !!AuthService.getToken();
    }
}; 