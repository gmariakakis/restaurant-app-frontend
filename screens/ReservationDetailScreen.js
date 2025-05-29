import React from 'react';
import { View, Text, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import useApi from '../api/api';

export default function ReservationDetailScreen({ route, navigation }) {
    const { reservation } = route.params;        // έρχεται ολόκληρο object
    const api = useApi();

    /* === υπολογισμός αν είναι παρελθόν === */
    const reservationDate = new Date(reservation.reservation_datetime);
    const isPast = reservationDate < new Date();   // true = παλαιότερη

    const handleDelete = async () => {
        try {
            await api(`/reservations/${reservation.reservation_uuid}`, { method: 'DELETE' });
            Alert.alert('Επιτυχία', 'Η κράτηση διαγράφηκε.');
            navigation.popToTop();                     // επιστρέφει στη λίστα
        } catch (err) {
            Alert.alert('Σφάλμα', err.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{reservation.restaurant_name}</Text>
            <Text style={styles.field}>
                Ημερομηνία & Ώρα:{' '}
                {reservationDate.toLocaleDateString()}{' '}
                {reservationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Text style={styles.field}>Άτομα: {reservation.guests}</Text>

            <View style={styles.buttonsRow}>
                {/* δείχνουμε ΕΠΕΞΕΡΓΑΣΙΑ μόνο αν ΔΕΝ είναι παλαιότερη */}
                {!isPast && (
                    <View style={styles.buttonWrap}>
                        <Button
                            title="Επεξεργασία"
                            onPress={() =>
                                navigation.navigate('EditReservation', { reservation })
                            }
                        />
                    </View>
                )}

                <View style={styles.buttonWrap}>
                    <Button title="Διαγραφή" color="#FF3B30" onPress={handleDelete} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: '#fff' },
    title:     { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
    field:     { fontSize: 16, marginBottom: 8 },
    buttonsRow:{ flexDirection: 'row', marginTop: 24 },
    buttonWrap:{ marginRight: 12 }
});
