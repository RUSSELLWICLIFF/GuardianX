// Firebase Configuration
// 
// IMPORTANT: Replace these placeholder values with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > General > Your apps > Web app


// Firebase configuration object
// TODO: Replace with your actual Firebase project credentials
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Replace with your API key
    authDomain: "guardianx-xxxxx.firebaseapp.com", // Replace with your auth domain
    projectId: "guardianx-xxxxx", // Replace with your project ID
    storageBucket: "guardianx-xxxxx.appspot.com", // Replace with your storage bucket
    messagingSenderId: "123456789012", // Replace with your sender ID
    appId: "1:123456789012:web:xxxxxxxxxxxxxx" // Replace with your app ID
};

// Initialize Firebase
// import { getApps, getApp, initializeApp } from 'firebase/app';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';

let app;
let auth;

// MOCK MODE: Firebase initialization disabled to prevent crashes with invalid keys.
/*
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
} else {
    app = getApp();
    auth = getAuth(app);
}
*/

export { auth };
// export const db = getFirestore(app);
// export const functions = getFunctions(app);

// Export the app instance
export default app;
