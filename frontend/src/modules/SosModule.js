import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSos } from '../context/SosContext';
import { useLocation } from '../context/LocationContext';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

export default function SosModule({ visible, onCancel }) {
    const { countdown, setCountdown, sendSosAlert, checkpointInfo, sosTriggeredFrom } = useSos();
    const { location } = useLocation();
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        if (visible) {
            // Start countdown
            setCountdown(30);

            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        handleAutoTrigger();
                        return 0;
                    }

                    // Vibrate on last 5 seconds
                    if (prev <= 5) {
                        Vibration.vibrate(200);
                    }

                    return prev - 1;
                });
            }, 1000);

            setTimer(interval);

            return () => {
                if (interval) {
                    clearInterval(interval);
                }
            };
        } else {
            if (timer) {
                clearInterval(timer);
            }
        }
    }, [visible]);

    const handleAutoTrigger = async () => {
        // Automatically send SOS when countdown reaches 0
        await sendSosAlert(location);
    };

    const handleImSafe = () => {
        if (timer) {
            clearInterval(timer);
        }
        setCountdown(30);
        onCancel();
    };

    const handleSendNow = async () => {
        if (timer) {
            clearInterval(timer);
        }
        await sendSosAlert(location);
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={handleImSafe}
        >
            <View style={styles.overlay}>
                <LinearGradient
                    colors={['#FF4858', '#FF6B7A', '#FFA8B0']}
                    style={styles.modalContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {/* Warning Icon */}
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>🚨</Text>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Safety Check Required!</Text>

                    {/* Reason */}
                    {sosTriggeredFrom === 'checkpoint' && checkpointInfo && (
                        <View style={styles.reasonCard}>
                            <Text style={styles.reasonTitle}>Missed Checkpoint</Text>
                            <Text style={styles.reasonText}>{checkpointInfo.name}</Text>
                            <Text style={styles.reasonTime}>
                                Expected: {new Date(checkpointInfo.expectedTime).toLocaleTimeString()}
                            </Text>
                        </View>
                    )}

                    {/* Countdown */}
                    <View style={styles.countdownContainer}>
                        <Text style={styles.countdownLabel}>Auto-sending SOS in</Text>
                        <View style={styles.countdownCircle}>
                            <Text style={styles.countdownNumber}>{countdown}</Text>
                        </View>
                        <Text style={styles.countdownUnit}>seconds</Text>
                    </View>

                    {/* Message */}
                    <Text style={styles.message}>
                        Press "I'm Safe" to cancel{'\n'}
                        or "Send SOS Now" if you need help
                    </Text>

                    {/* Action Buttons */}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.safeButton}
                            onPress={handleImSafe}
                        >
                            <Text style={styles.safeButtonText}>✓ I'm Safe</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.sosButton}
                            onPress={handleSendNow}
                        >
                            <Text style={styles.sosButtonText}>🚨 Send SOS Now</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: spacing.md,
    },
    icon: {
        fontSize: 64,
    },
    title: {
        ...typography.h1,
        fontSize: 28,
        color: colors.white,
        fontWeight: 'bold',
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    reasonCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.lg,
        width: '100%',
    },
    reasonTitle: {
        ...typography.body,
        color: colors.white,
        fontWeight: 'bold',
        marginBottom: spacing.xs,
    },
    reasonText: {
        ...typography.body,
        color: colors.white,
        fontSize: 16,
        marginBottom: spacing.xs,
    },
    reasonTime: {
        ...typography.caption,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    countdownContainer: {
        alignItems: 'center',
        marginVertical: spacing.lg,
    },
    countdownLabel: {
        ...typography.body,
        color: colors.white,
        fontSize: 16,
        marginBottom: spacing.sm,
    },
    countdownCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 4,
        borderColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: spacing.sm,
    },
    countdownNumber: {
        fontSize: 48,
        fontWeight: 'bold',
        color: colors.white,
    },
    countdownUnit: {
        ...typography.body,
        color: colors.white,
        fontSize: 14,
    },
    message: {
        ...typography.body,
        color: colors.white,
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 22,
    },
    buttonsContainer: {
        width: '100%',
        gap: spacing.md,
    },
    safeButton: {
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    safeButtonText: {
        ...typography.button,
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    sosButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.white,
    },
    sosButtonText: {
        ...typography.button,
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
