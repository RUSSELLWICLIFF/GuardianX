const functions = require('firebase-functions');
const twilio = require('twilio');

/**
 * Cloud Function to send location via SMS
 * Useful for sharing location without triggering full SOS
 */
exports.sendLocationSMS = functions.https.onCall(async (data, context) => {
    // Verify authentication
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'User must be authenticated'
        );
    }

    const { phoneNumber, location, userName } = data;

    try {
        // Initialize Twilio
        const accountSid = functions.config().twilio.account_sid;
        const authToken = functions.config().twilio.auth_token;
        const twilioNumber = functions.config().twilio.phone_number;

        const client = twilio(accountSid, authToken);

        // Create location URL
        const locationUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

        const message = `
📍 Location shared by ${userName || 'GuardianX User'}

Current location:
${locationUrl}

Sent via GuardianX
    `.trim();

        // Send SMS
        await client.messages.create({
            body: message,
            from: twilioNumber,
            to: phoneNumber
        });

        return {
            success: true,
            message: 'Location sent successfully'
        };

    } catch (error) {
        console.error('Error sending location SMS:', error);
        throw new functions.https.HttpsError(
            'internal',
            'Failed to send location: ' + error.message
        );
    }
});
