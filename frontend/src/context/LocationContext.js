import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';

const LocationContext = createContext();

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within LocationProvider');
    }
    return context;
};

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const [locationPermission, setLocationPermission] = useState(null);
    const [tracking, setTracking] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        requestLocationPermission();
    }, []);

    useEffect(() => {
        let subscription;

        if (tracking && locationPermission) {
            startLocationTracking();
        } else {
            if (subscription) {
                subscription.remove();
            }
        }

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, [tracking, locationPermission]);

    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setLocationPermission(status === 'granted');

            if (status === 'granted') {
                // Get initial location
                const initialLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High
                });
                setLocation(initialLocation.coords);
            }
        } catch (err) {
            console.error('Location permission error:', err);
            setError(err.message);
        }
    };

    const startLocationTracking = async () => {
        try {
            const subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 5000, // Update every 5 seconds
                    distanceInterval: 10 // Update every 10 meters
                },
                (newLocation) => {
                    setLocation(newLocation.coords);
                }
            );
            return subscription;
        } catch (err) {
            console.error('Location tracking error:', err);
            setError(err.message);
        }
    };

    const getCurrentLocation = async () => {
        try {
            if (!locationPermission) {
                await requestLocationPermission();
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });
            setLocation(currentLocation.coords);
            return currentLocation.coords;
        } catch (err) {
            console.error('Get current location error:', err);
            setError(err.message);
            return null;
        }
    };

    const value = {
        location,
        locationPermission,
        tracking,
        error,
        setTracking,
        getCurrentLocation,
        requestLocationPermission
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
};
