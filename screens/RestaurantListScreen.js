// src/screens/RestaurantListScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    TextInput,
    StyleSheet
} from 'react-native';
import useApi from '../api/api';
import { useNavigation } from '@react-navigation/native';

export default function RestaurantListScreen() {
    const api = useApi();
    const navigation = useNavigation();

    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading]         = useState(false);
    const [refreshing, setRefreshing]   = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setLoading(true);
        const url = searchQuery
            ? `/restaurants?search=${encodeURIComponent(searchQuery)}`
            : '/restaurants';
        api(url)
            .then(setRestaurants)
            .catch(err => console.warn('Error loading:', err.message))
            .finally(() => {
                setLoading(false);
                setRefreshing(false);
            });
    }, [searchQuery]);

    const onRefresh = () => {
        setRefreshing(true);
        api('/restaurants')
            .then(setRestaurants)
            .catch(console.warn)
            .finally(() => setRefreshing(false));
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                navigation.navigate('RestaurantDetail', { uuid: item.restaurant_uuid })
            }
        >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.address}</Text>
            <Text style={styles.subtitleSmall}>Περιοχή: {item.region}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Αναζήτηση ονόματος ή περιοχής..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
            />
            {loading && <ActivityIndicator style={styles.indicator} />}
            <FlatList
                data={restaurants}
                keyExtractor={item => item.restaurant_uuid}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Δεν βρέθηκαν εστιατόρια.</Text>
                        </View>
                    )
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
    searchInput: {
        height: 40, borderColor: '#ccc', borderWidth: 1,
        borderRadius: 5, marginBottom: 10, paddingHorizontal: 10,
        backgroundColor: '#fff'
    },
    indicator: { marginBottom: 10 },
    card: {
        backgroundColor: '#fff', padding: 12,
        borderRadius: 6, marginBottom: 8
    },
    title: { fontSize: 16, fontWeight: 'bold' },
    subtitle: { fontSize: 14, color: '#555' },
    subtitleSmall: { fontSize: 12, color: '#888' },
    emptyContainer: { alignItems: 'center', marginTop: 20 },
    emptyText: { fontSize: 14, color: '#555' }
});
