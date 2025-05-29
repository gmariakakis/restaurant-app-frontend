import { API_BASE_URL } from '../utils/apiConfig';
import { useAuth } from '../context/AuthContext';

export default function useApi() {
    const { userToken } = useAuth();

    return async (endpoint, options = {}) => {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}),
                ...(options.headers || {}),
            },
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Server error');
        }
        return res.status === 204 ? {} : res.json();
    };
}
