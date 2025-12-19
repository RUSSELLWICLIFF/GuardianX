import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    USER: '@guardianx_user',
    CONTACTS: '@guardianx_contacts',
};

// User storage functions
export const saveUser = async (userData) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        return true;
    } catch (error) {
        console.error('Error saving user:', error);
        return false;
    }
};

export const getUser = async () => {
    try {
        const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};

export const clearUser = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER);
        return true;
    } catch (error) {
        console.error('Error clearing user:', error);
        return false;
    }
};

// Contacts storage functions
export const saveContacts = async (contacts) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
        return true;
    } catch (error) {
        console.error('Error saving contacts:', error);
        return false;
    }
};

export const getContacts = async () => {
    try {
        const contactsData = await AsyncStorage.getItem(STORAGE_KEYS.CONTACTS);
        return contactsData ? JSON.parse(contactsData) : [];
    } catch (error) {
        console.error('Error getting contacts:', error);
        return [];
    }
};

export const clearContacts = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.CONTACTS);
        return true;
    } catch (error) {
        console.error('Error clearing contacts:', error);
        return false;
    }
};
