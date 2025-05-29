import React, { useState } from 'react';
import {
    View,
    ScrollView,
    Text,
    Button,
    Alert,
    StyleSheet
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import NumericInput   from 'react-native-numeric-input';
import useApi         from '../api/api';

/* helper — τοπική -> "YYYY-MM-DD HH:MM:SS" */
const toMySQLLocal = (d) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return (
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
        ` ${pad(d.getHours())}:${pad(d.getMinutes())}:00`
    );
};

export default function EditReservationScreen({ route, navigation }) {
    const { reservation } = route.params;
    const api = useApi();

    const [date, setDate]                     = useState(new Date(reservation.reservation_datetime));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [guests, setGuests]                 = useState(reservation.guests);

    const onSubmit = async () => {
        try {
            await api(`/reservations/${reservation.reservation_uuid}`, {
                method: 'PUT',
                body: JSON.stringify({
                    reservation_datetime: toMySQLLocal(date),   // τοπική ώρα
                    guests
                })
            });
            Alert.alert('Επιτυχία', 'Η κράτηση ενημερώθηκε.');
            navigation.goBack();
        } catch (err) {
            Alert.alert('Σφάλμα', err.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{reservation.restaurant_name}</Text>

            <View style={styles.pickerRow}>
                <Button
                    title={`Ημερομηνία: ${date.toLocaleDateString()}`}
                    onPress={() => setShowDatePicker(true)}
                />
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(_, d) => {
                            setShowDatePicker(false);
                            if (d) {
                                const nd = new Date(date);
                                nd.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
                                setDate(nd);
                                setShowTimePicker(true);
                            }
                        }}
                    />
                )}
                {showTimePicker && (
                    <DateTimePicker
                        value={date}
                        mode="time"
                        display="default"
                        onChange={(_, t) => {
                            setShowTimePicker(false);
                            if (t) {
                                const nd = new Date(date);
                                nd.setHours(t.getHours(), t.getMinutes());
                                setDate(nd);
                            }
                        }}
                    />
                )}
            </View>

            <Text style={styles.label}>Άτομα:</Text>
            <NumericInput
                value={guests}
                onChange={setGuests}
                minValue={1}
                totalWidth={140}
                totalHeight={40}
                rounded
            />

            <View style={styles.submitBtn}>
                <Button title="Αποθήκευση" onPress={onSubmit} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 15, backgroundColor: '#fff' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
    pickerRow: { marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 5 },
    submitBtn: { marginTop: 20 }
});
