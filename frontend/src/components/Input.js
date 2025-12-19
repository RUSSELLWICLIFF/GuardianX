import React, { useState } from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

export default function Input({
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    secureTextEntry = false,
    error = '',
    style,
}) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.inputFocused,
                    error && styles.inputError
                ]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                placeholderTextColor={colors.textLight}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    label: {
        ...typography.small,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    input: {
        ...typography.body,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        backgroundColor: colors.white,
        color: colors.text,
    },
    inputFocused: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    inputError: {
        borderColor: colors.danger,
    },
    errorText: {
        ...typography.small,
        color: colors.danger,
        marginTop: spacing.xs,
    },
});

