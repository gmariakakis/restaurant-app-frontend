import React, { useState, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Alert } from 'react-native';
import useApi from '../api/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/restaurantStyles';

export default function ReservationListScreen() {
    const api = useApi();
    const navigation = useNavigation();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const data = await api('/reservations/me');
            setReservations(data);
        } catch (err) {
            console.warn(err.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => { load(); }, []));

    const onDelete = (uuid) => {
        Alert.alert('Ακύρωση', 'Θες σίγουρα να ακυρώσεις;', [
            { text: 'Όχι' },
            {
                text: 'Ναι',
                onPress: async () => {
                    try {
                        await api(`/reservations/${uuid}`, { method: 'DELETE' });
                        load();
                    } catch (err) {
                        Alert.alert('Σφάλμα', err.message);
                    }
                }
            }
        ]);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ReservationDetail', { reservation: item })}
        >
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.restaurant_name}</Text>
                <Text>
                    {new Date(item.reservation_datetime).toLocaleString()} — {item.guests} άτομα
                </Text>
            </View>
            <Icon name="keyboard-arrow-right" size={24} />
        </TouchableOpacity>
    );

    if (loading) return <ActivityIndicator style={{ flex:1 }} />;

    return (
        <FlatList
            data={reservations}
            keyExtractor={(i) => i.reservation_uuid}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:30 }}>Δεν υπάρχουν κρατήσεις</Text>}
        />
    );
}
