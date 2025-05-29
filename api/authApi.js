import { API_BASE_URL } from '../utils/apiConfig';

/**
 * Logs a user in with email and password.
 */
export const loginUser = async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
    };
};

/**
 * Registers a new user.
 */
export const registerUser = async (username, email, password) => {
    const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data.message;
};

/**
 * Verifies email using a token from the URL.
 */
export const verifyEmail = async (token) => {
    const res = await fetch(`${API_BASE_URL}/verify-email?token=${token}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Email verification failed');
    return data.message;
};

/**
 * Resends email verification.
 */
export const resendVerification = async (email) => {
    const res = await fetch(`${API_BASE_URL}/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Resend verification failed');
    return data.message;
};

/**
 * Sends password reset email.
 */
export const forgotPassword = async (email) => {
    const res = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Password reset request failed');
    return data.message;
};

/**
 * Resets password using token and new password.
 */
export const resetPassword = async (token, newPassword) => {
    const res = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Reset password failed');
    return data.message;
};

/**
 * Refreshes the access token using a refresh token.
 */
export const refreshToken = async (refreshToken) => {
    const res = await fetch(`${API_BASE_URL}/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Token refresh failed');
    return data.accessToken;
};

/**
 * Logs out the current user by invalidating the refresh token.
 */
export const logoutUser = async (accessToken) => {
    const res = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Logout failed');
    return data.message;
};
