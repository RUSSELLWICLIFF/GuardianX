// Color scheme and design tokens
export const colors = {
    // Primary colors with richer tones
    primary: '#FF4858',
    primaryDark: '#E63946',
    primaryLight: '#FF6B7A',

    // Secondary colors
    secondary: '#457B9D',
    secondaryDark: '#2C5F7E',
    secondaryLight: '#5A9BC7',

    // Gradients for modern look
    gradientStart: '#FF4858',
    gradientEnd: '#FF6B7A',
    gradientSecondaryStart: '#457B9D',
    gradientSecondaryEnd: '#5A9BC7',

    // Background colors
    background: '#F8F9FA',
    backgroundDark: '#E9ECEF',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',

    // Text colors
    text: '#212529',
    textSecondary: '#6C757D',
    textLight: '#ADB5BD',

    // Border and divider
    border: '#DEE2E6',
    divider: '#E9ECEF',

    // Semantic colors
    success: '#28A745',
    successLight: '#D4EDDA',
    warning: '#FFC107',
    warningLight: '#FFF3CD',
    danger: '#DC3545',
    dangerLight: '#F8D7DA',
    info: '#17A2B8',
    infoLight: '#D1ECF1',

    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',
    gray: {
        50: '#F8F9FA',
        100: '#F1F3F5',
        200: '#E9ECEF',
        300: '#DEE2E6',
        400: '#CED4DA',
        500: '#ADB5BD',
        600: '#6C757D',
        700: '#495057',
        800: '#343A40',
        900: '#212529',
    },
};

// Typography
export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 32,
        letterSpacing: -0.3,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
        letterSpacing: -0.2,
    },
    h4: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 24,
    },
    body: {
        fontSize: 16,
        fontWeight: 'normal',
        lineHeight: 24,
    },
    bodyLarge: {
        fontSize: 18,
        fontWeight: 'normal',
        lineHeight: 28,
    },
    small: {
        fontSize: 14,
        fontWeight: 'normal',
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        fontWeight: 'normal',
        lineHeight: 16,
    },
    button: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
        letterSpacing: 0.5,
    },
};

// Spacing
export const spacing = {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
};

// Border radius
export const borderRadius = {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
};

// Shadows - enhanced for depth
export const shadows = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    xs: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 12,
        elevation: 8,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
    },
};

// Animation timings
export const animations = {
    fast: 150,
    normal: 300,
    slow: 500,
};

// Opacity values
export const opacity = {
    disabled: 0.5,
    hover: 0.8,
    pressed: 0.6,
    overlay: 0.4,
};

