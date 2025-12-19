import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { getContacts, saveContacts } from '../../utils/storage';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ContactCard from '../../components/ContactCard';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';

const MAX_CONTACTS = 5;

export default function ContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const savedContacts = await getContacts();
    setContacts(savedContacts);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone.replace(/[-()\s]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddContact = () => {
    if (contacts.length >= MAX_CONTACTS) {
      Alert.alert('Limit Reached', `You can only add up to ${MAX_CONTACTS} emergency contacts.`);
      return;
    }
    setEditingContact(null);
    setName('');
    setPhone('');
    setErrors({});
    setModalVisible(true);
  };

  const handleEditContact = (contact, index) => {
    setEditingContact(index);
    setName(contact.name);
    setPhone(contact.phone);
    setErrors({});
    setModalVisible(true);
  };

  const handleSaveContact = async () => {
    if (!validateForm()) return;

    const newContact = {
      name: name.trim(),
      phone: phone.trim(),
    };

    let updatedContacts;
    if (editingContact !== null) {
      updatedContacts = [...contacts];
      updatedContacts[editingContact] = newContact;
    } else {
      updatedContacts = [...contacts, newContact];
    }

    const success = await saveContacts(updatedContacts);
    if (success) {
      setContacts(updatedContacts);
      setModalVisible(false);
      setName('');
      setPhone('');
      setEditingContact(null);
    } else {
      Alert.alert('Error', 'Failed to save contact. Please try again.');
    }
  };

  const handleDeleteContact = (index) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedContacts = contacts.filter((_, i) => i !== index);
            const success = await saveContacts(updatedContacts);
            if (success) {
              setContacts(updatedContacts);
            } else {
              Alert.alert('Error', 'Failed to delete contact.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Emergency Contacts</Text>
        <Text style={styles.subtitle}>
          {contacts.length}/{MAX_CONTACTS} contacts added
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {contacts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>No Contacts Yet</Text>
            <Text style={styles.emptyText}>
              Add emergency contacts to receive your SOS alerts
            </Text>
          </View>
        ) : (
          <View style={styles.contactsList}>
            {contacts.map((contact, index) => (
              <ContactCard
                key={index}
                contact={contact}
                onEdit={() => handleEditContact(contact, index)}
                onDelete={() => handleDeleteContact(index)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={`Add Contact (${contacts.length}/${MAX_CONTACTS})`}
          onPress={handleAddContact}
          disabled={contacts.length >= MAX_CONTACTS}
          style={styles.addButton}
        />
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingContact !== null ? 'Edit Contact' : 'Add Contact'}
            </Text>

            <Input
              label="Name"
              placeholder="Enter contact name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              error={errors.name}
            />

            <Input
              label="Phone Number"
              placeholder="Enter phone number"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              keyboardType="phone-pad"
              error={errors.phone}
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Save"
                onPress={handleSaveContact}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    ...shadows.sm,
  },
  backText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 250,
  },
  contactsList: {
    paddingBottom: spacing.lg,
  },
  footer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    ...shadows.md,
  },
  addButton: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});
