import { AuthService } from './auth.service';

const originalFetch = window.fetch;

const AUTH_ENDPOINTS = [
    '/api/auth/login',
    '/api/auth/register'
];

window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    const url = input instanceof Request ? input.url : input.toString();
    
    if (AUTH_ENDPOINTS.some(endpoint => url.includes(endpoint))) {
        return originalFetch(input, init);
    }

    const token = AuthService.getToken();
    
    if (!token) {
        window.location.href = '/login';
        return Promise.reject(new Error('No auth token'));
    }

    init = {
        ...init,
        headers: {
            ...init?.headers,
            'Authorization': `Bearer ${token}`
        }
    };

    return originalFetch(input, init);
}; 