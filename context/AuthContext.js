import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, logoutUser as apiLogout, refreshToken as apiRefresh } from '../api/authApi';
import { getTokens, removeTokens, saveTokens } from '../utils/storage';

export const AuthContext = createContext();

/**
 * Custom hook for accessing auth context
 */
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [refreshTokenValue, setRefreshTokenValue] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load tokens from storage on app start
    useEffect(() => {
        const loadTokens = async () => {
            try {
                const { accessToken, refreshToken } = await getTokens();
                setUserToken(accessToken);
                setRefreshTokenValue(refreshToken);
            } catch (e) {
                console.error('Error loading tokens:', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadTokens();
    }, []);

    /**
     * Log in using email and password, save access and refresh tokens.
     */
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const { accessToken, refreshToken: newRefreshToken } = await loginUser(email, password);
            await saveTokens(accessToken, newRefreshToken);
            setUserToken(accessToken);
            setRefreshTokenValue(newRefreshToken);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Log out and clear stored tokens.
     */
    const logout = async () => {
        setIsLoading(true);
        try {
            if (userToken) await apiLogout(userToken);
        } catch (e) {
            console.warn('Logout error:', e);
        }
        await removeTokens();
        setUserToken(null);
        setRefreshTokenValue(null);
        setIsLoading(false);
    };

    /**
     * Refresh the access token using the stored refresh token.
     */
    const refreshAuthToken = async () => {
        if (!refreshTokenValue) return;
        try {
            const newAccessToken = await apiRefresh(refreshTokenValue);
            await AsyncStorage.setItem('userToken', newAccessToken);
            setUserToken(newAccessToken);
        } catch (e) {
            console.error('Refresh token failed:', e);
            await logout();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                userToken,
                isLoading,
                login,
                logout,
                refreshAuthToken,
                isAuthenticated: !!userToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
