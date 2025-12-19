const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Firestore trigger when a new user is created
 * Sets up initial user document structure
 */
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
    const { uid, email, displayName, photoURL } = user;

    try {
        // Create user document in Firestore
        await admin.firestore().collection('users').doc(uid).set({
            email,
            name: displayName || '',
            photoURL: photoURL || '',
            phone: '',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            accountStatus: 'active'
        });

        console.log(`User document created for ${email} (${uid})`);

        // Initialize empty contacts subcollection (optional)
        // The subcollection will be created when the first contact is added

        return { success: true };
    } catch (error) {
        console.error('Error creating user document:', error);
        return { success: false, error: error.message };
    }
});
