// src/screens/RestaurantDetailScreen.js

import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import NumericInput   from 'react-native-numeric-input';
import useApi         from '../api/api';
import styles         from '../styles/restaurantStyles';

export default function RestaurantDetailScreen({ route, navigation }) {
    const { restaurant } = route.params;
    const api = useApi();

    const [date, setDate]                   = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [guests, setGuests]               = useState(2);

    const onSubmit = async () => {
        const iso = date.toISOString();
        try {
            await api('/reservations', {
                method: 'POST',
                body: JSON.stringify({
                    restaurant_id: restaurant.restaurant_id,
                    reservation_datetime: iso,
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
        <View style={styles.container}>
            <Text style={styles.title}>{restaurant.name}</Text>
            {restaurant.description ? (
                <Text style={styles.subtitle}>{restaurant.description}</Text>
            ) : null}

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
                            const newDate = new Date(date);
                            newDate.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
                            setDate(newDate);
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
                            const newDate = new Date(date);
                            newDate.setHours(t.getHours(), t.getMinutes());
                            setDate(newDate);
                        }
                    }}
                />
            )}

            <Text style={{ marginTop: 20, fontSize: 16 }}>Άτομα:</Text>
            <NumericInput
                value={guests}
                onChange={setGuests}
                minValue={1}
                totalWidth={140}
                totalHeight={40}
                iconSize={20}
                step={1}
                valueType="integer"
                rounded
                textColor="#000"
                iconStyle={{ color: 'white' }}
                rightButtonBackgroundColor="#007AFF"
                leftButtonBackgroundColor="#007AFF"
            />

            <View style={{ marginTop: 30 }}>
                <Button title="Κράτηση" onPress={onSubmit} />
            </View>
        </View>
    );
}
