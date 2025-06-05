import { toast } from 'react-toastify';
import { RegisterFormData } from '../types/RegisterFormData';

const API_REGISTER_URL = '/api/auth/register';

export const register = async (payload: RegisterFormData): Promise<void> => {
    const response = await fetch(`${API_REGISTER_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: payload.username,
            email: payload.email,
            password: payload.password,
            firstName: payload.firstName,
            lastName: payload.lastname,
            role: payload.role
        }),
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            console.error("Failed to parse error response:", e);
        }
        console.error('Failed to register:', response.status, errorData);
        toast.error('Registration failed!');
        throw new Error(errorData?.message || `Failed to register. Status: ${response.status}`);
    } else {
        toast.success('Registration successful!');
    }
}; 