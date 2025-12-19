// Firebase Cloud Functions Service
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase.config';

/**
 * Send SOS alert via Cloud Functions
 * This triggers SMS sending to emergency contacts
 */
export const sendSOSAlert = async (contacts, location, message) => {
    try {
        const sendSOS = httpsCallable(functions, 'sendSOSAlert');

        const result = await sendSOS({
            contacts,
            location,
            message
        });

        return { success: true, data: result.data };
    } catch (error) {
        console.error('Send SOS alert error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send location SMS via Cloud Functions
 */
export const sendLocationSMS = async (phoneNumber, location, userName) => {
    try {
        const sendLocation = httpsCallable(functions, 'sendLocationSMS');

        const result = await sendLocation({
            phoneNumber,
            location,
            userName
        });

        return { success: true, data: result.data };
    } catch (error) {
        console.error('Send location SMS error:', error);
        return { success: false, error: error.message };
    }
};
