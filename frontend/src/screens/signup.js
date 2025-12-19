import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, StatusBar, TextInput, TouchableOpacity, Image } from 'react-native';
import { registerUser } from '../services/mockAuthService';
import { colors } from '../styles/theme';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!phone.trim()) newErrors.phone = 'Phone is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const result = await registerUser(email.trim(), password, name.trim(), phone.trim());
      if (result.success) {
        Alert.alert('Success', 'Account created successfully!', [{ text: 'OK' }]);
      } else {
        Alert.alert('Registration Failed', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Top Section (White) */}
      {/* Top Section (White) */}
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.brandTitle}>GuardianX</Text>
        <Text style={styles.headerSubtitle}>Create your account</Text>
      </View>

      {/* Bottom Section (Pink) */}
      <View style={styles.bottomSection}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

            <View style={styles.formContainer}>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={styles.input}
                  placeholder="FULL NAME *"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="EMAIL *"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>📱</Text>
                <TextInput
                  style={styles.input}
                  placeholder="PHONE NUMBER *"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="PASSWORD *"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="CONFIRM PASSWORD *"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.signupButtonText}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialIcon}>G</Text>
                  <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialIcon}>f</Text>
                  <Text style={styles.socialText}>Facebook</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  topSection: {
    flex: 0.25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#C2185B',
    marginBottom: 5,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  bottomSection: {
    flex: 0.8, // Increased height for form
    backgroundColor: '#C2185B',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    marginBottom: 12, // Reduced margin to fit content
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
    fontSize: 16,
    color: '#FFF',
  },
  input: {
    flex: 1,
    color: '#FFF',
    height: '100%',
    fontSize: 14,
  },
  signupButton: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  signupButtonText: {
    color: '#C2185B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dividerText: {
    color: '#FFF',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  socialButton: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45, // Slightly taller
    borderRadius: 25, // Full pill shape
    backgroundColor: '#FFF', // Solid White
    elevation: 2, // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  socialText: {
    color: '#C2185B', // Deep Pink text
    fontSize: 14,
    fontWeight: 'bold',
  },
  socialIcon: {
    color: '#C2185B',
    fontSize: 18,
    fontWeight: '900',
    marginRight: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  loginLink: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
