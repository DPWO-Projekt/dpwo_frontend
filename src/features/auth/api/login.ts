import { LoginFormData } from '../types/LoginFormData';
import { AuthService } from '../services/auth.service';
import { toast } from 'react-toastify';

const API_LOGIN_URL = '/api/auth/login';

interface LoginResponse {
    token: string;
}

export const login = async (payload: LoginFormData): Promise<void> => {
    const response = await fetch(`${API_LOGIN_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            console.error("Failed to parse error response:", e);
        }
        console.error('Failed to login:', response.status, errorData);
        toast.error('Login failed!');
        throw new Error(errorData?.message || `Failed to login. Status: ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    AuthService.setToken(data.token);
    toast.success('Login successful!');
}; 