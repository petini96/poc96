import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Platform, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

export default function LocationScreen() {
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const getLocation = async () => {
        setLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            console.log('Permission Status:', status);

            if (status !== 'granted') {
                setErrorMsg('Permissão para acessar localização foi negada');
                setLoading(false);
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
                timeInterval: 0,
                distanceInterval: 0,
            });

            console.log('Location Object:', currentLocation);
            console.log('Latitude:', currentLocation.coords.latitude);
            console.log('Longitude:', currentLocation.coords.longitude);

            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude
            });

            Alert.alert(
                'Localização Capturada',
                `Latitude: ${currentLocation.coords.latitude}\nLongitude: ${currentLocation.coords.longitude}`
            );
        } catch (error) {
            console.error('Erro na localização:', error);
            setErrorMsg('Erro ao obter localização: ' + JSON.stringify(error));
        }
        setLoading(false);
    };

    useEffect(() => {
        getLocation();
    }, []);

    let mapRegion = location ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    } : undefined;

    return (
        <View style={styles.container}>
            {loading && <Text>Buscando localização via GPS... (pode levar alguns segundos)</Text>}

            {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

            {location && (
                <View style={styles.coordinatesContainer}>
                    <Text style={styles.coordinatesText}>
                        {location.latitude}
                    </Text>
                    <Text style={styles.coordinatesText}>
                        {location.longitude}
                    </Text>
                </View>
            )}

            {location && mapRegion && (
                <MapView
                    style={styles.map}
                    region={mapRegion}
                    showsUserLocation={true}
                    provider={Platform.OS === 'android' ? 'google' : undefined}
                >
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude
                        }}
                        title="Você está aqui"
                    />
                </MapView>
            )}

            <Button
                title="Atualizar Localização"
                onPress={getLocation}
                disabled={loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    map: {
        width: '100%',
        height: '70%',
        marginBottom: 20,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    coordinatesContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    coordinatesText: {
        fontSize: 16,
        marginVertical: 5,
    }
});