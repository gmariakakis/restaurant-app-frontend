import React, { useState } from 'react';
import { View, Button, Alert, Text, Platform } from 'react-native';
import DateTimePicker, {
    DateTimePickerAndroid
} from '@react-native-community/datetimepicker';
import NumericInput from 'react-native-numeric-input';
import useApi from '../api/api';
import styles from '../styles/restaurantStyles';

export default function EditReservationScreen({ route, navigation }) {
    const { reservation } = route.params;
    const api = useApi();

    const [date,   setDate]   = useState(
        new Date(reservation.reservation_datetime)
    );
    const [showIOS, setShowIOS] = useState(false);
    const [guests, setGuests] = useState(reservation.guests);

    /* ------------ helpers ------------- */
    const mysqlDate = d => d.toISOString().slice(0, 19).replace('T', ' ');

    const handleSave = async () => {
        try {
            await api(`/reservations/${reservation.reservation_uuid}`, {
                method: 'PUT',
                body: JSON.stringify({
                    reservation_datetime: mysqlDate(date),
                    guests
                })
            });
            Alert.alert('Επιτυχία', 'Η κράτηση ενημερώθηκε!');
            navigation.goBack();
        } catch (err) {
            Alert.alert('Σφάλμα', err.message);
        }
    };

    /* ----------- Android pickers ------------ */
    const openAndroidDate = () => {
        DateTimePickerAndroid.open({
            value: date,
            mode: 'date',
            is24Hour: true,
            onChange: (_, selected) => {
                if (selected) {
                    // κράτησε την ημερομηνία, ώρα όπως πριν
                    const newDate = new Date(date);
                    newDate.setFullYear(
                        selected.getFullYear(),
                        selected.getMonth(),
                        selected.getDate()
                    );
                    // Ύστερα άνοιξε time-picker
                    openAndroidTime(newDate);
                }
            }
        });
    };

    const openAndroidTime = baseDate => {
        DateTimePickerAndroid.open({
            value: baseDate,
            mode: 'time',
            is24Hour: true,
            onChange: (_, selected) => {
                if (selected) setDate(selected);
            }
        });
    };

    /* ------------ iOS inline ------------ */
    const onIOSChange = (_, selected) => {
        if (selected) setDate(selected);
    };

    /* --------------- UI ---------------- */
    const openPicker = () =>
        Platform.OS === 'android' ? openAndroidDate() : setShowIOS(true);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Επεξεργασία κράτησης</Text>

            <Button title="Αλλαγή Ημερομηνίας & Ώρας" onPress={openPicker} />

            {showIOS && (
                <DateTimePicker
                    value={date}
                    mode="datetime"
                    display="spinner"
                    onChange={onIOSChange}
                    style={{ marginVertical: 12 }}
                />
            )}

            <Text style={{ marginTop: 20 }}>Άτομα:</Text>
            <NumericInput
                value={guests}
                onChange={setGuests}
                minValue={1}
                totalWidth={140}
            />

            <Button title="Αποθήκευση" onPress={handleSave} style={{ marginTop: 30 }} />
        </View>
    );
}
