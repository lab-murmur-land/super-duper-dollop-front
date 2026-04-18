export const API_BASE = 'https://forum.murmurs.world/api';

export async function fetchApi(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };
    
    // Support multipart/form-data by removing Content-Type so browser sets boundary
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'API Request Failed');
    }
    return data;
}
