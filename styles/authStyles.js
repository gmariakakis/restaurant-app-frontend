import { StyleSheet } from 'react-native';
import { baseStyles } from './baseStyles';

export const authStyles = StyleSheet.create({
    container: baseStyles.container,
    inner: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: baseStyles.title,
    input: baseStyles.input,
    button: baseStyles.button,
    buttonText: baseStyles.buttonText,
    linkText: {
        marginTop: 20,
        textAlign: 'center',
        color: '#007AFF',
    },
});
