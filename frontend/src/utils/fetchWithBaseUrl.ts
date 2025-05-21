const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchWithBaseUrl = (endpoint: string, options: RequestInit = {}) => {
    const hasBody = !!options.body;

    return fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
            ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
            ...(options?.headers || {}),
        },
    });
};