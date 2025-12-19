import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows, opacity } from '../styles/theme';

export default function Button({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    size = 'default',
}) {
    const buttonStyles = [
        styles.button,
        size === 'small' && styles.buttonSmall,
        size === 'large' && styles.buttonLarge,
        variant === 'primary' && styles.primary,
        variant === 'danger' && styles.danger,
        variant === 'outline' && styles.outline,
        variant === 'secondary' && styles.secondary,
        variant === 'success' && styles.success,
        (disabled || loading) && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        size === 'small' && styles.textSmall,
        size === 'large' && styles.textLarge,
        variant === 'outline' && styles.outlineText,
        variant === 'secondary' && styles.secondaryText,
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={opacity.pressed}
        >
            <Text style={textStyles}>
                {loading ? 'Loading...' : title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
        ...shadows.sm,
    },
    buttonSmall: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        minWidth: 80,
    },
    buttonLarge: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        minWidth: 160,
    },
    primary: {
        backgroundColor: colors.primary,
    },
    danger: {
        backgroundColor: colors.danger,
    },
    secondary: {
        backgroundColor: colors.secondary,
    },
    success: {
        backgroundColor: colors.success,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    disabled: {
        opacity: opacity.disabled,
    },
    text: {
        ...typography.button,
        color: colors.white,
    },
    textSmall: {
        fontSize: 14,
    },
    textLarge: {
        fontSize: 18,
    },
    outlineText: {
        color: colors.primary,
    },
    secondaryText: {
        color: colors.white,
    },
});


