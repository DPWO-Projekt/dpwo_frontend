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
    },

    getUserRole: (): string | null => {
        const token = AuthService.getToken();
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role;
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    }
}; 