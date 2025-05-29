// src/screens/ReservationListScreen.js

import React, { useState, useCallback } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native';
import useApi from '../api/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function ReservationListScreen() {
    const api = useApi();
    const navigation = useNavigation();

    const [reservations, setReservations] = useState([]);
    const [loading, setLoading]         = useState(false);
    const [refreshing, setRefreshing]   = useState(false);

    // Φόρτωσε τις κρατήσεις του χρήστη
    const loadReservations = async () => {
        setLoading(true);
        try {
            const data = await api('/reservations/me');
            setReservations(data);
        } catch (err) {
            console.warn('Error loading reservations:', err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadReservations();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadReservations();
    };

    const renderItem = ({ item }) => {
        const reservationDate = new Date(item.reservation_datetime);
        const isPast = reservationDate < new Date();

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('ReservationDetail', { reservation: item })}
                style={[styles.card, isPast && styles.pastCard]}
            >
                {isPast && (
                    <View style={styles.pastBadge}>
                        <Text style={styles.pastBadgeText}>ΠΑΛΑΙΟΤΕΡΗ ΚΡΑΤΗΣΗ</Text>
                    </View>
                )}

                <Text style={styles.title}>{item.restaurant_name}</Text>
                <Text style={styles.subtitle}>
                    {reservationDate.toLocaleDateString()}{' '}
                    {reservationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={styles.subtitleSmall}>Άτομα: {item.guests}</Text>
            </TouchableOpacity>
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={reservations}
                keyExtractor={(item) => item.reservation_uuid}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Δεν βρέθηκαν κρατήσεις.</Text>
                        </View>
                    )
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f9f9f9'
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 6,
        marginBottom: 10,
        position: 'relative'
    },
    pastCard: {
        opacity: 0.5,
        backgroundColor: '#eee'
    },
    pastBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        zIndex: 1
    },
    pastBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        marginBottom: 2
    },
    subtitleSmall: {
        fontSize: 12,
        color: '#888'
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20
    },
    emptyText: {
        fontSize: 14,
        color: '#555'
    }
});
