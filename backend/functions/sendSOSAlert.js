const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');

/**
 * Cloud Function to send SOS alert via SMS
 * Triggered by HTTP request from the mobile app
 */
exports.sendSOSAlert = functions.https.onCall(async (data, context) => {
    // Verify user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'User must be authenticated to send SOS alert'
        );
    }

    const { contacts, location, message } = data;
    const userId = context.auth.uid;

    try {
        // Get user details from Firestore
        const userDoc = await admin.firestore()
            .collection('users')
            .doc(userId)
            .get();

        const userData = userDoc.data();
        const userName = userData?.name || 'GuardianX User';

        // Initialize Twilio client
        const accountSid = functions.config().twilio.account_sid;
        const authToken = functions.config().twilio.auth_token;
        const twilioNumber = functions.config().twilio.phone_number;

        const client = twilio(accountSid, authToken);

        // Prepare SMS message
        const locationUrl = location
            ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
            : 'Location unavailable';

        const smsMessage = `
🚨 EMERGENCY ALERT from ${userName}

${message || 'I need immediate help!'}

My current location:
${locationUrl}

This is an automated SOS alert from GuardianX.
    `.trim();

        // Send SMS to all contacts
        const smsPromises = contacts.map(contact => {
            return client.messages.create({
                body: smsMessage,
                from: twilioNumber,
                to: contact.phone
            });
        });

        await Promise.all(smsPromises);

        // Log SOS alert in Firestore
        await admin.firestore().collection('sosAlerts').add({
            userId,
            userName,
            location: location ? new admin.firestore.GeoPoint(location.latitude, location.longitude) : null,
            message: message || 'Emergency!',
            contacts: contacts.map(c => ({ name: c.name, phone: c.phone })),
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'sent'
        });

        return {
            success: true,
            message: `SOS alert sent to ${contacts.length} contact(s)`,
            sentCount: contacts.length
        };

    } catch (error) {
        console.error('Error sending SOS alert:', error);
        throw new functions.https.HttpsError(
            'internal',
            'Failed to send SOS alert: ' + error.message
        );
    }
});
