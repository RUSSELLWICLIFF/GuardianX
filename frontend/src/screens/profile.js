import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { colors, shadows } from '../styles/theme';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useAuth();
    const [name, setName] = useState(user?.displayName || 'User');
    const [phone, setPhone] = useState('123-456-7890'); // Placeholder for now

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: () => logout()
            },
        ]);
    };

    const handleSave = () => {
        Alert.alert('Success', 'Profile updated successfully!');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.brandPrimary} />

            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Profile</Text>
                    <View style={{ width: 50 }} />
                </View>

                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                        {name ? name.charAt(0).toUpperCase() : 'U'}
                    </Text>
                </View>
            </View>

            {/* Content Section */}
            <ScrollView style={styles.content}>
                <View style={styles.formSection}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                        />
                    </View>

                    <Text style={styles.label}>Email Address</Text>
                    <View style={[styles.inputWrapper, styles.disabledInput]}>
                        <TextInput
                            style={styles.input}
                            value={user?.email}
                            editable={false}
                            placeholder="Email"
                        />
                    </View>

                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter phone number"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Log Out</Text>
                    </TouchableOpacity>
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
        height: 200,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingTop: 40,
        alignItems: 'center',
        ...shadows.md,
    },
    headerContent: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
        marginBottom: -50, // Pull it down to overlap
        ...shadows.md,
    },
    avatarText: {
        fontSize: 40,
        color: colors.brandPrimary,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingTop: 60, // Space for the avatar overlap
    },
    formSection: {
        padding: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        marginLeft: 4,
        fontWeight: '600',
    },
    inputWrapper: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        height: 50,
        marginBottom: 20,
        justifyContent: 'center',
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    disabledInput: {
        backgroundColor: '#F1F3F5',
    },
    input: {
        fontSize: 16,
        color: '#333',
    },
    saveButton: {
        backgroundColor: colors.brandPrimary,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
        ...shadows.sm,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#FFF',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DC3545',
    },
    logoutButtonText: {
        color: '#DC3545',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
