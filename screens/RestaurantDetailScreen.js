import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    Text,
    Button,
    Alert,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import NumericInput   from 'react-native-numeric-input';
import useApi         from '../api/api';

/* helper: μετατρέπει Date → "YYYY-MM-DD HH:MM:SS" (τοπική ώρα) */
const toMySQLLocal = (d) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return (
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
        ` ${pad(d.getHours())}:${pad(d.getMinutes())}:00`
    );
};

export default function RestaurantDetailScreen({ route, navigation }) {
    const { uuid } = route.params;           // restaurant_uuid
    const api      = useApi();

    const [restaurant, setRestaurant]         = useState(null);
    const [date, setDate]                     = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [guests, setGuests]                 = useState(2);
    const [loading, setLoading]               = useState(true);

    useEffect(() => {
        api(`/restaurants/${uuid}`)
            .then(setRestaurant)
            .catch((err) => Alert.alert('Σφάλμα', err.message))
            .finally(() => setLoading(false));
    }, [uuid]);

    if (loading || !restaurant) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const onSubmit = async () => {
        try {
            await api('/reservations', {
                method: 'POST',
                body: JSON.stringify({
                    restaurant_id: restaurant.restaurant_id,
                    reservation_datetime: toMySQLLocal(date),   // τοπική ώρα
                    guests
                })
            });
            Alert.alert('Επιτυχία', 'Κράτηση επιτυχής!');
            navigation.goBack();
        } catch (err) {
            Alert.alert('Σφάλμα', err.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{restaurant.name}</Text>
            <Text style={styles.subtitle}>{restaurant.address}</Text>
            <Text style={styles.subtitleSmall}>Περιοχή: {restaurant.region}</Text>
            {restaurant.description && (
                <Text style={styles.description}>{restaurant.description}</Text>
            )}

            {/* Date / Time pickers */}
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
                <Button title="Κράτηση" onPress={onSubmit} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 15, backgroundColor: '#fff' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
    subtitle: { fontSize: 16, marginBottom: 3 },
    subtitleSmall: { fontSize: 14, color: '#555', marginBottom: 10 },
    description: { fontSize: 14, color: '#333', marginBottom: 20 },
    pickerRow: { marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 5 },
    submitBtn: { marginTop: 20 }
});
