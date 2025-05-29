import React, { useContext }      from 'react';
import { createStackNavigator }    from '@react-navigation/stack';
import { TouchableOpacity, Text, View }    from 'react-native';

import SplashScreen                from '../screens/SplashScreen';
import LoginScreen                 from '../screens/LoginScreen';
import RegisterScreen              from '../screens/RegisterScreen';
import RestaurantListScreen        from '../screens/RestaurantListScreen';
import RestaurantDetailScreen      from '../screens/RestaurantDetailScreen';
import ReservationListScreen       from '../screens/ReservationListScreen';
import ReservationDetailScreen     from '../screens/ReservationDetailScreen';
import EditReservationScreen       from '../screens/EditReservationScreen';

import { AuthContext }             from '../context/AuthContext';

const Stack = createStackNavigator();

export default function AppNavigator() {
    const { isLoading, userToken, logout } = useContext(AuthContext);

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: true }}>
            {userToken == null ? (
                <>
                    <Stack.Screen name="Login"    component={LoginScreen}    />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen
                        name="RestaurantList"
                        component={RestaurantListScreen}
                        options={({ navigation }) => ({
                            title: 'Εστιατόρια',
                            headerRight: () => (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('ReservationList')}
                                        style={{ marginRight: 15 }}
                                    >
                                        <Text style={{ color: '#007AFF' }}>Οι κρατήσεις μου</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={logout}
                                        style={{ marginRight: 10 }}
                                    >
                                        <Text style={{ color: '#FF3B30' }}>Logout</Text>
                                    </TouchableOpacity>
                                </View>
                            ),
                        })}
                    />

                    <Stack.Screen
                        name="RestaurantDetail"
                        component={RestaurantDetailScreen}
                        options={{ title: 'Λεπτομέρειες Εστιατορίου' }}
                    />

                    <Stack.Screen
                        name="ReservationList"
                        component={ReservationListScreen}
                        options={{ title: 'Οι Κρατήσεις Μου' }}
                    />

                    <Stack.Screen
                        name="ReservationDetail"
                        component={ReservationDetailScreen}
                        options={{ title: 'Λεπτομέρειες Κράτησης' }}
                    />

                    <Stack.Screen
                        name="EditReservation"
                        component={EditReservationScreen}
                        options={{ title: 'Επεξεργασία Κράτησης' }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
}
