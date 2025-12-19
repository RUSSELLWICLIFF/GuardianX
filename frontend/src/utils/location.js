import * as Location from 'expo-location';

export const requestLocationPermission = async () => {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('Error requesting location permission:', error);
        return false;
    }
};

export const getCurrentLocation = async () => {
    try {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            throw new Error('Location permission denied');
        }

        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });

        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
        };
    } catch (error) {
        console.error('Error getting location:', error);
        throw error;
    }
};

export const formatLocationForSMS = (location) => {
    if (!location) return '';
    const { latitude, longitude } = location;
    return `https://maps.google.com/?q=${latitude},${longitude}`;
};

export const getLocationString = (location) => {
    if (!location) return 'Unknown location';
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
};
