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

let app = null;
let auth = null;
let db = null;
let functions = null;

// MOCK MODE: Firebase initialization disabled to prevent crashes with invalid keys.
// The app is currently using mockAuthService.js for authentication instead of Firebase.
/*
import { getApps, getApp, initializeApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
    db = getFirestore(app);
    functions = getFunctions(app);
} else {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    functions = getFunctions(app);
}
*/

// Export mock objects to prevent import errors
export { auth, db, functions };

// Export the app instance
export default app;
