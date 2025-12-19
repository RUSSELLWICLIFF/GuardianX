import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { getContacts } from '../utils/storage';
import { colors, shadows } from '../styles/theme';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [contactsCount, setContactsCount] = useState(0);

  useEffect(() => {
    loadContactsCount();
  }, []);

  const loadContactsCount = async () => {
    try {
      const contacts = await getContacts();
      setContactsCount(contacts.length);
    } catch (error) {
      setContactsCount(0);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.brandPrimary} />

      {/* Curved Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greetingText}>Hello,</Text>
            <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileInitials}>
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Safety Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active Protection</Text>
          </View>
          <Text style={styles.statusSubtext}>Reviewing route & safety status</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>

        {/* EMERGENCY SOS HERO BUTTON */}
        <TouchableOpacity
          style={styles.heroSosButton}
          onPress={() => navigation.navigate('SOS')}
          activeOpacity={0.9}
        >
          <View style={styles.sosInnerCircle}>
            <Text style={styles.sosEmoji}>🚨</Text>
            <Text style={styles.sosTitle}>SOS</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.sosLabel}>Tap for Emergency Help</Text>

        {/* Quick Actions Grid */}
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => navigation.navigate('Contacts')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.cardEmoji}>👥</Text>
            </View>
            <Text style={styles.gridTitle}>Contacts</Text>
            <Text style={styles.gridSub}>{contactsCount} Active</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => navigation.navigate('RouteTracking')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.cardEmoji}>📍</Text>
            </View>
            <Text style={styles.gridTitle}>Track Me</Text>
            <Text style={styles.gridSub}>Live Location</Text>
          </TouchableOpacity>
        </View>

        {/* Safety Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>Daily Safety Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>🔋 Keep your phone charged above 20%</Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>👥 Share your live location when traveling alone</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: colors.brandPrimary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 50,
    paddingBottom: 30, // Space for the overlapping card
    paddingHorizontal: 25,
    ...shadows.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  greetingText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  userName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileInitials: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CD964',
    marginRight: 8,
  },
  statusText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statusSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 25,
    alignItems: 'center',
  },
  heroSosButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
    shadowColor: colors.brandPrimary,
    shadowOpacity: 0.3,
    elevation: 10,
    marginBottom: 15,
    marginTop: 10,
  },
  sosInnerCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFE0E9',
  },
  sosEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  sosTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sosLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 40,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  gridCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: '48%',
    ...shadows.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardEmoji: {
    fontSize: 20,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  gridSub: {
    fontSize: 12,
    color: '#999',
  },
  tipsContainer: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  tipCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.xs,
  },
  tipText: {
    color: '#555',
    fontSize: 14,
  },
});
