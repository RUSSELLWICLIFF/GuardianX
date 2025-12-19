const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export all cloud functions
exports.sendSOSAlert = require('./functions/sendSOSAlert');
exports.sendLocationSMS = require('./functions/sendLocationSMS');
exports.onUserCreated = require('./functions/onUserCreated');
exports.onSOSCreated = require('./functions/onSOSCreated');
