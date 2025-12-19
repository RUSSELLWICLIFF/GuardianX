# GuardianX Backend - Firebase Cloud Functions

Firebase Cloud Functions backend for the GuardianX safety application.

## Features

- 🔐 **Authentication Triggers**: Auto-create user documents on registration
- 📱 **SMS Integration**: Send SOS alerts via Twilio
- 📍 **Location Sharing**: Share GPS location via SMS
- 🚨 **SOS Alerts**: Log and process emergency alerts
- 🔒 **Security Rules**: Firestore rules for data protection

## Setup

### Prerequisites

1. Node.js 18 or higher
2. Firebase CLI: `npm install -g firebase-tools`
3. Twilio account for SMS functionality

### Installation

```bash
cd backend
npm install
```

### Configuration

1. **Initialize Firebase** (if not already done):
   ```bash
   firebase login
   firebase init
   ```

2. **Set Twilio Environment Variables**:
   ```bash
   firebase functions:config:set twilio.account_sid="YOUR_ACCOUNT_SID"
   firebase functions:config:set twilio.auth_token="YOUR_AUTH_TOKEN"
   firebase functions:config:set twilio.phone_number="+1234567890"
   ```

3. **For local development**, create `.runtimeconfig.json`:
   ```json
   {
     "twilio": {
       "account_sid": "YOUR_ACCOUNT_SID",
       "auth_token": "YOUR_AUTH_TOKEN",
       "phone_number": "+1234567890"
     }
   }
   ```

## Cloud Functions

### HTTP Callable Functions

#### `sendSOSAlert`
Sends emergency SMS to contacts with location.

**Usage from frontend:**
```javascript
const result = await functions().httpsCallable('sendSOSAlert')({
  contacts: [{ name: 'John', phone: '+1234567890' }],
  location: { latitude: 37.7749, longitude: -122.4194 },
  message: 'Emergency! I need help!'
});
```

#### `sendLocationSMS`
Share location via SMS without full SOS.

**Usage:**
```javascript
await functions().httpsCallable('sendLocationSMS')({
  phoneNumber: '+1234567890',
  location: { latitude: 37.7749, longitude: -122.4194 },
  userName: 'John Doe'
});
```

### Firestore Triggers

#### `onUserCreated`
Automatically creates user document when new user signs up.

#### `onSOSCreated`
Processes SOS alerts, updates user statistics.

## Development

### Run Emulators Locally
```bash
npm run serve
```

This starts:
- Functions emulator on port 5001
- Firestore emulator on port 8080
- Auth emulator on port 9099
- Emulator UI on port 4000

### View Logs
```bash
npm run logs
```

## Deployment

### Deploy All Functions
```bash
npm run deploy
```

### Deploy Specific Function
```bash
firebase deploy --only functions:sendSOSAlert
```

### Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

## Firestore Security Rules

Rules ensure:
- Users can only access their own data
- Contacts are private to each user
- SOS alerts are logged but can't be deleted
- All operations require authentication

## Database Structure

```
users/
  {userId}/
    - email, name, phone, createdAt
    - contacts/ (subcollection)
      {contactId}/
        - name, phone, relationship

sosAlerts/
  {alertId}/
    - userId, location, message, timestamp, status, contacts[]
```

## Environment Variables

Required for production:
- `twilio.account_sid`
- `twilio.auth_token`
- `twilio.phone_number`

## Troubleshooting

**Problem**: Functions not deploying
- Check Firebase project is selected: `firebase use --add`
- Verify billing is enabled (Blaze plan required for external APIs)

**Problem**: SMS not sending
- Verify Twilio credentials are correct
- Check Twilio phone number is SMS-enabled
- Ensure recipient numbers are verified (sandbox mode)

## Cost Considerations

- Firebase Functions: Pay per invocation (free tier: 2M invocations/month)
- Firestore: Pay per read/write (free tier: 50K reads, 20K writes/day)
- Twilio SMS: ~$0.0075 per SMS (verify current pricing)

## Support

For issues, check Firebase Console logs and Twilio logs.
