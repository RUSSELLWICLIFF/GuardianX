// Firestore Database Service
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase.config';

/**
 * Get all contacts for a user
 */
export const getContacts = async (userId) => {
    try {
        const contactsRef = collection(db, 'users', userId, 'contacts');
        const querySnapshot = await getDocs(contactsRef);

        const contacts = [];
        querySnapshot.forEach((doc) => {
            contacts.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, contacts };
    } catch (error) {
        console.error('Get contacts error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Add a new contact
 */
export const addContact = async (userId, contactData) => {
    try {
        const contactsRef = collection(db, 'users', userId, 'contacts');
        const docRef = await addDoc(contactsRef, {
            ...contactData,
            createdAt: new Date().toISOString()
        });

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Add contact error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update a contact
 */
export const updateContact = async (userId, contactId, contactData) => {
    try {
        const contactRef = doc(db, 'users', userId, 'contacts', contactId);
        await updateDoc(contactRef, {
            ...contactData,
            updatedAt: new Date().toISOString()
        });

        return { success: true };
    } catch (error) {
        console.error('Update contact error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete a contact
 */
export const deleteContact = async (userId, contactId) => {
    try {
        const contactRef = doc(db, 'users', userId, 'contacts', contactId);
        await deleteDoc(contactRef);

        return { success: true };
    } catch (error) {
        console.error('Delete contact error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Listen to real-time contacts changes
 */
export const subscribeToContacts = (userId, callback) => {
    const contactsRef = collection(db, 'users', userId, 'contacts');

    return onSnapshot(contactsRef, (snapshot) => {
        const contacts = [];
        snapshot.forEach((doc) => {
            contacts.push({ id: doc.id, ...doc.data() });
        });
        callback(contacts);
    }, (error) => {
        console.error('Contacts subscription error:', error);
    });
};

/**
 * Create SOS alert in Firestore
 */
export const createSOSAlert = async (userId, alertData) => {
    try {
        const alertsRef = collection(db, 'sos Alerts');
        const docRef = await addDoc(alertsRef, {
            userId,
            ...alertData,
            timestamp: new Date().toISOString(),
            status: 'active'
        });

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Create SOS alert error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get user's SOS alert history
 */
export const getSOSHistory = async (userId) => {
    try {
        const alertsRef = collection(db, 'sosAlerts');
        const q = query(
            alertsRef,
            where('userId', '==', userId),
            orderBy('timestamp', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const alerts = [];

        querySnapshot.forEach((doc) => {
            alerts.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, alerts };
    } catch (error) {
        console.error('Get SOS history error:', error);
        return { success: false, error: error.message };
    }
};
