// Mock Authentication Service
// Simulates Firebase Auth for testing/demo purposes

// Mock user data storage in memory
let currentUser = null;
let listeners = [];

const notifyListeners = () => {
    listeners.forEach(listener => listener(currentUser));
};

/**
 * Register a new user with email and password
 */
export const registerUser = async (email, password, name, phone) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockUser = {
                uid: 'mock-user-' + Date.now(),
                email: email,
                displayName: name,
                photoURL: null,
                emailVerified: true
            };

            currentUser = mockUser;
            notifyListeners();

            resolve({ success: true, user: mockUser });
        }, 1000);
    });
};

/**
 * Sign in existing user
 */
export const loginUser = async (email, password) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate success for any non-empty input
            if (email && password) {
                const mockUser = {
                    uid: 'mock-user-123',
                    email: email,
                    displayName: 'Demo User',
                    photoURL: null,
                    emailVerified: true
                };

                currentUser = mockUser;
                notifyListeners();

                resolve({ success: true, user: mockUser });
            } else {
                resolve({ success: false, error: 'Invalid email or password' });
            }
        }, 1000);
    });
};

/**
 * Sign out current user
 */
export const logoutUser = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            currentUser = null;
            notifyListeners();
            resolve({ success: true });
        }, 500);
    });
};

/**
 * Get current user data (Simulated Firestore)
 */
export const getUserData = async (userId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (currentUser) {
                resolve({
                    success: true,
                    data: {
                        email: currentUser.email,
                        name: currentUser.displayName,
                        phone: '123-456-7890',
                        createdAt: new Date().toISOString()
                    }
                });
            } else {
                resolve({ success: false, error: 'User not found' });
            }
        }, 500);
    });
};

/**
 * Listen to authentication state changes
 */
export const onAuthChange = (callback) => {
    listeners.push(callback);
    // Immediate callback with current state
    callback(currentUser);

    // Return unsubscribe function
    return () => {
        listeners = listeners.filter(l => l !== callback);
    };
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => {
    return currentUser;
};
