import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { getContacts } from '../../utils/storage';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [contactsCount, setContactsCount] = useState(0);

  useEffect(() => {
    loadContactsCount();
  }, []);

  const loadContactsCount = async () => {
    try {
      const contacts = await getContacts();
      setContactsCount(contacts.length);
    } catch (error) {
      console.error('Error:', error);
      setContactsCount(0);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user?.name || 'User'}</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Emergency Contacts</Text>
          <Text style={styles.cardValue}>{contactsCount}/5</Text>
        </View>

        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => navigation.navigate('SOS')}
        >
          <Text style={styles.sosText}>🚨 Emergency SOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactsButton}
          onPress={() => navigation.navigate('Contacts')}
        >
          <Text style={styles.contactsText}>👥 Manage Contacts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.routeButton}
          onPress={() => navigation.navigate('RouteTracking')}
        >
          <Text style={styles.routeText}>📍 Track My Route</Text>
        </TouchableOpacity>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>Safety Tips</Text>
          <Text style={styles.tip}>• Keep phone charged</Text>
          <Text style={styles.tip}>• Update contacts regularly</Text>
          <Text style={styles.tip}>• Enable location services</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FF4858',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  logoutBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF4858',
  },
  sosButton: {
    backgroundColor: '#FF4858',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  sosText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contactsButton: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FF4858',
  },
  contactsText: {
    color: '#FF4858',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  routeButton: {
    backgroundColor: '#4A90E2',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  routeText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tips: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  tip: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});
