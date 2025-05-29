import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import useApi from '../api/api';

export default function ReservationDetailScreen({ route, navigation }) {
    const { reservation } = route.params;
    const api = useApi();

    const onDelete = () => {
        Alert.alert('Ακύρωση Κράτησης', 'Θέλετε σίγουρα να ακυρώσετε;', [
            { text: 'Όχι' },
            {
                text: 'Ναι',
                onPress: async () => {
                    try {
                        const { reservation_uuid: uuid } = reservation;
                        await api(`/reservations/${uuid}`, { method: 'DELETE' });
                        Alert.alert('Επιτυχία', 'Η κράτηση ακυρώθηκε.');
                        navigation.popToTop(); // επιστροφή στη λίστα
                    } catch (err) {
                        Alert.alert('Σφάλμα', err.message);
                    }
                }
            }
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{reservation.restaurant_name}</Text>
            <Text style={styles.field}>
                Ημερομηνία & Ώρα:{' '}
                {new Date(reservation.reservation_datetime).toLocaleString()}
            </Text>
            <Text style={styles.field}>Άτομα: {reservation.guests}</Text>

            <View style={styles.buttons}>
                <Button
                    title="Επεξεργασία"
                    onPress={() => navigation.navigate('EditReservation', { reservation })}
                />
                <Button
                    title="Διαγραφή"
                    color="red"
                    onPress={onDelete}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title:     { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    field:     { fontSize: 16, marginBottom: 12 },
    buttons:   { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }
});
