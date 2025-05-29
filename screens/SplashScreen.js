import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { splashStyles as styles } from '../styles/splashStyles';

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reserve your Table App</Text>
            <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
        </View>
    );
};

export default SplashScreen;
