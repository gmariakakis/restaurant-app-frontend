import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

export const saveTokens = async (accessToken, refreshToken) => {
    try {
        await AsyncStorage.multiSet([
            [TOKEN_KEY, accessToken],
            [REFRESH_KEY, refreshToken]
        ]);
    } catch (error) {
        console.error('Error saving tokens:', error);
        throw error;
    }
};

export const getTokens = async () => {
    try {
        const values = await AsyncStorage.multiGet(['accessToken', 'refreshToken']);
        const tokenMap = Object.fromEntries(values);

        console.log('[getTokens]', tokenMap); // ✅ Add this

        return {
            accessToken: tokenMap['accessToken'] || null,
            refreshToken: tokenMap['refreshToken'] || null,
        };
    } catch (error) {
        console.error('[getTokens error]', error);
        return { accessToken: null, refreshToken: null };
    }
};

export const removeTokens = async () => {
    try {
        await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_KEY]);
    } catch (error) {
        console.error('Error removing tokens:', error);
        throw error;
    }
};
