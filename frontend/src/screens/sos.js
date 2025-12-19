import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SMS from 'expo-sms';
import { useAuth } from '../context/AuthContext';
import { getContacts } from '../utils/storage';
import { getCurrentLocation, formatLocationForSMS } from '../utils/location';
import Button from '../components/Button';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

export default function SosScreen({ navigation }) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      sendSOS();
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const loadContacts = async () => {
    const savedContacts = await getContacts();
    setContacts(savedContacts);
  };

  const startSOS = () => {
    if (contacts.length === 0) {
      Alert.alert(
        'No Contacts',
        'Please add emergency contacts before using SOS.',
        [
          { text: 'Add Contacts', onPress: () => navigation.navigate('Contacts') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    Alert.alert(
      '🚨 Emergency SOS',
      'This will send an emergency alert with your location to all your emergency contacts. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send SOS',
          style: 'destructive',
          onPress: () => setCountdown(3),
        },
      ]
    );
  };

  const sendSOS = async () => {
    setLoading(true);
    try {
      // Check SMS availability
      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'SMS is not available on this device');
        setCountdown(null);
        setLoading(false);
        return;
      }

      // Get current location
      let locationText = 'Location unavailable';
      try {
        const location = await getCurrentLocation();
        const mapLink = formatLocationForSMS(location);
        locationText = mapLink;
      } catch (error) {
        console.log('Could not get location:', error);
      }

      // Prepare SMS
      const recipients = contacts.map(c => c.phone);
      const message = `🚨 EMERGENCY ALERT from ${user?.name || 'GuardianX User'}!\n\nI need help! This is an emergency.\n\nMy location: ${locationText}\n\nSent via GuardianX Safety App`;

      // Send SMS
      await SMS.sendSMSAsync(recipients, message);

      setCountdown(null);
      Alert.alert(
        'SOS Sent',
        'Emergency alert has been sent to all your contacts.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error sending SOS:', error);
      Alert.alert(
        'Error',
        'Failed to send SOS. Please try again or call emergency services directly.'
      );
      setCountdown(null);
    } finally {
      setLoading(false);
    }
  };

  const cancelSOS = () => {
    setCountdown(null);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.icon}>🚨</Text>
          <Text style={styles.title}>Emergency SOS</Text>
          <Text style={styles.subtitle}>
            Send instant alert to {contacts.length} emergency contact{contacts.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {countdown !== null && (
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>{countdown > 0 ? countdown : 'Sending...'}</Text>
            <Text style={styles.countdownLabel}>
              {countdown > 0 ? 'Sending in...' : 'Please wait'}
            </Text>
            <Button
              title="Cancel"
              onPress={cancelSOS}
              variant="outline"
              style={styles.cancelButton}
            />
          </View>
        )}

        {countdown === null && (
          <>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>What happens when you press SOS?</Text>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>📱</Text>
                <Text style={styles.infoText}>
                  SMS sent to all emergency contacts
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>📍</Text>
                <Text style={styles.infoText}>
                  Your current location is shared
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>⚡</Text>
                <Text style={styles.infoText}>
                  Instant delivery (3 second countdown)
                </Text>
              </View>
            </View>

            <View style={styles.sosButtonContainer}>
              <TouchableOpacity
                style={styles.sosButton}
                onPress={startSOS}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.sosButtonText}>
                  {loading ? 'SENDING...' : 'SEND SOS'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contactsList}>
              <Text style={styles.contactsTitle}>Emergency Contacts ({contacts.length}/5)</Text>
              {contacts.length === 0 ? (
                <Text style={styles.noContacts}>
                  No contacts added yet. Add contacts to use SOS.
                </Text>
              ) : (
                contacts.map((contact, index) => (
                  <View key={index} style={styles.contactItem}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                  </View>
                ))
              )}
              <Button
                title="Manage Contacts"
                onPress={() => navigation.navigate('Contacts')}
                variant="outline"
                style={styles.manageButton}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
  },
  backButton: {
    marginBottom: spacing.md,
  },
  backText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  countdownContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  countdownText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: colors.danger,
  },
  countdownLabel: {
    ...typography.h3,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  cancelButton: {
    minWidth: 150,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  infoTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: spacing.md,
    width: 32,
  },
  infoText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  sosButtonContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  sosButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
  },
  contactsList: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  contactsTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  noContacts: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  contactItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  contactPhone: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  manageButton: {
    marginTop: spacing.md,
  },
});
