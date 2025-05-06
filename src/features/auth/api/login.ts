import { LoginFormData } from '../types/LoginFormData';

const API_LOGIN_URL = '/api/auth/login';

export const login = async (payload: LoginFormData): Promise<void> => {
    const response = await fetch(`${API_LOGIN_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            usernameOrEmail: payload.usernameOrEmail,
            password: payload.password
        }),
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            console.error("Failed to parse error response:", e);
        }
        console.error('Failed to login:', response.status, errorData);
        throw new Error(errorData?.message || `Failed to login. Status: ${response.status}`);
    }
}; 