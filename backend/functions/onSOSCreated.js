const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Firestore trigger when a new SOS alert is created
 * Can be used for logging, analytics, or additional notifications
 */
exports.onSOSCreated = functions.firestore
    .document('sosAlerts/{alertId}')
    .onCreate(async (snap, context) => {
        const alert = snap.data();
        const alertId = context.params.alertId;

        try {
            console.log('New SOS Alert Created:', {
                alertId,
                userId: alert.userId,
                timestamp: alert.timestamp,
                location: alert.location
            });

            // Update user's last SOS alert timestamp
            if (alert.userId) {
                await admin.firestore()
                    .collection('users')
                    .doc(alert.userId)
                    .update({
                        lastSOSAlert: admin.firestore.FieldValue.serverTimestamp(),
                        sosAlertCount: admin.firestore.FieldValue.increment(1)
                    });
            }

            // Here you could add additional logic:
            // - Send push notifications to emergency contacts
            // - Alert emergency services if configured
            // - Log to external monitoring system
            // - Trigger analytics events

            return { success: true };
        } catch (error) {
            console.error('Error processing SOS alert:', error);
            return { success: false, error: error.message };
        }
    });
