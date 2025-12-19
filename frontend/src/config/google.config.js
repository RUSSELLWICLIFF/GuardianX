// Google Maps and Places API Configuration
// 
// IMPORTANT: Replace 'YOUR_GOOGLE_API_KEY' with your actual Google Maps API key
// Get it from: https://console.cloud.google.com/
// 
// Required APIs to enable:
// - Maps SDK for Android
// - Maps SDK for iOS
// - Directions API
// - Places API

export const GOOGLE_MAPS_CONFIG = {
    apiKey: 'YOUR_GOOGLE_API_KEY', // Replace with your actual API key
    region: 'IN', // India
    language: 'en'
};

export const MAP_SETTINGS = {
    defaultLatitude: 28.7041, // New Delhi default
    defaultLongitude: 77.1025,
    defaultZoom: 15,
    checkpointRadius: 50, // meters - radius to consider checkpoint reached
    checkpointTimeout: 300, // seconds - max time allowed to reach checkpoint
    speedKmh: 40 // Average speed assumption for ETA calculation
};
