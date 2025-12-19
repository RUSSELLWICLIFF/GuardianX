import React, { createContext, useState, useContext } from 'react';
import { Alert, Platform } from 'react-native';
import * as SMS from 'expo-sms';
import { getContacts } from '../utils/storage';

const SosContext = createContext();

export const useSos = () => {
    const context = useContext(SosContext);
    if (!context) {
        throw new Error('useSos must be used within SosProvider');
    }
    return context;
};

export const SosProvider = ({ children }) => {
    const [sosActive, setSosActive] = useState(false);
    const [sosTriggeredFrom, setSosTriggeredFrom] = useState(null); // 'manual', 'checkpoint', etc.
    const [checkpointInfo, setCheckpointInfo] = useState(null);
    const [countdown, setCountdown] = useState(30);
    const [showSosModal, setShowSosModal] = useState(false);

    const triggerSos = async (location, triggeredFrom = 'manual', checkpointData = null) => {
        setSosActive(true);
        setSosTriggeredFrom(triggeredFrom);
        setCheckpointInfo(checkpointData);
        setShowSosModal(true);
        setCountdown(30);
    };

    const cancelSos = () => {
        setSosActive(false);
        setShowSosModal(false);
        setSosTriggeredFrom(null);
        setCheckpointInfo(null);
        setCountdown(30);
    };

    const sendSosAlert = async (location) => {
        try {
            const contacts = await getContacts();
            const emergencyContacts = contacts.filter(c => c.phone);

            if (emergencyContacts.length === 0) {
                Alert.alert('No Contacts', 'Please add emergency contacts first.');
                return { success: false, error: 'No contacts available' };
            }

            const phoneNumbers = emergencyContacts.map(c => c.phone);

            // Create SOS message
            let message = '🚨 EMERGENCY ALERT from GuardianX\n\n';

            if (sosTriggeredFrom === 'checkpoint' && checkpointInfo) {
                message += `Missed Safety Checkpoint!\n`;
                message += `Checkpoint: ${checkpointInfo.name}\n`;
                message += `Expected arrival: ${new Date(checkpointInfo.expectedTime).toLocaleTimeString()}\n\n`;
            }

            if (location) {
                message += `Current Location:\n`;
                message += `Lat: ${location.latitude.toFixed(6)}\n`;
                message += `Lng: ${location.longitude.toFixed(6)}\n`;
                message += `Google Maps: https://maps.google.com/?q=${location.latitude},${location.longitude}\n\n`;
            }

            message += `Time: ${new Date().toLocaleString()}\n`;
            message += `Please check on me immediately!`;

            // Check if SMS is available
            const isAvailable = await SMS.isAvailableAsync();

            if (isAvailable) {
                await SMS.sendSMSAsync(phoneNumbers, message);

                Alert.alert(
                    'SOS Sent',
                    `Emergency alert sent to ${phoneNumbers.length} contact(s)`,
                    [{ text: 'OK' }]
                );

                setSosActive(false);
                setShowSosModal(false);

                return { success: true };
            } else {
                // Fallback - show message to copy
                Alert.alert(
                    'SMS Not Available',
                    `Please manually send this message:\n\n${message}`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Copy Message', onPress: () => {
                                // In a real app, use Clipboard API
                                console.log('Message:', message);
                            }
                        }
                    ]
                );
                return { success: false, error: 'SMS not available' };
            }
        } catch (error) {
            console.error('SOS send error:', error);
            Alert.alert('Error', 'Failed to send SOS alert. Please call emergency contacts manually.');
            return { success: false, error: error.message };
        }
    };

    const value = {
        sosActive,
        sosTriggeredFrom,
        checkpointInfo,
        countdown,
        showSosModal,
        setCountdown,
        setShowSosModal,
        triggerSos,
        cancelSos,
        sendSosAlert
    };

    return (
        <SosContext.Provider value={value}>
            {children}
        </SosContext.Provider>
    );
};
