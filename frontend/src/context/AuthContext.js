import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthChange, getCurrentUser, getUserData, logoutUser } from '../services/mockAuthService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to authentication state changes
        const unsubscribe = onAuthChange(async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in
                setUser(firebaseUser);

                // Fetch additional user data from Firestore
                const result = await getUserData(firebaseUser.uid);
                if (result.success) {
                    setUserData(result.data);
                }
            } else {
                // User is signed out
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await logoutUser();
        setUser(null);
        setUserData(null);
    };

    const value = {
        user,
        userData,
        loading,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
