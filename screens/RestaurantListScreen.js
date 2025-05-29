import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import useApi from '../api/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styles from '../styles/restaurantStyles';   // αναπροσαρμόζεις

export default function RestaurantListScreen() {
    const api = useApi();
    const navigation = useNavigation();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading]         = useState(false);
    const [refreshing, setRefreshing]   = useState(false);

    const loadRestaurants = async () => {
        setLoading(true);
        try {
            const data = await api('/restaurants');
            setRestaurants(data);
        } catch (err) {
            console.warn(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => { loadRestaurants(); }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadRestaurants();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
            style={styles.card}
        >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.location}</Text>
        </TouchableOpacity>
    );

    if (loading && !refreshing) return <ActivityIndicator style={{ flex:1 }} />;

    return (
        <View style={{ flex:1 }}>
            <FlatList
                data={restaurants}
                keyExtractor={(item) => item.restaurant_id.toString()}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </View>
    );
}
