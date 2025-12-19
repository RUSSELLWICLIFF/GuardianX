# GuardianX - React Native Frontend

GuardianX safety app frontend built with React Native and Expo, connected to Firebase backend.

## Features

- 🔐 Firebase Authentication (Email/Password)
- 📱 Emergency SOS with SMS alerts
- 📍 Real-time location tracking
- 👥 Emergency contacts management
- 🔥 Firebase Cloud Firestore database
- ⚡ Firebase Cloud Functions integration

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Firebase

**Update** `src/config/firebase.config.js` with your Firebase project credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your GuardianX project
3. Go to Project Settings > General
4. Scroll to "Your apps" section
5. Click on the Web app (or create one)
6. Copy the configuration values

Replace the placeholders in `firebase.config.js`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Run the App

```bash
npm start
```

Then:
- Press `a` for Android
- Press `i` for iOS
- Scan QR code with Expo Go app

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.js
│   │   ├── Input.js
│   │   └── ContactCard.js
│   ├── config/              # Firebase configuration
│   │   └── firebase.config.js
│   ├── context/             # React Context
│   │   └── AuthContext.js
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.js
│   ├── screens/             # App screens
│   │   ├── login.js
│   │   ├── signup.js
│   │   ├── home.js
│   │   ├── contact.js
│   │   └── sos.js
│   ├── services/            # Firebase services
│   │   ├── authService.js
│   │   ├── firestoreService.js
│   │   └── functionsService.js
│   ├── styles/              # Theme & styling
│   │   └── theme.js
│   └── utils/               # Utilities
│       ├── location.js
│       └── storage.js
├── assets/                  # Images & icons
├── App.js                   # App entry point
└── package.json             # Dependencies

## Firebase Services

### Authentication Service
- `registerUser(email, password, name, phone)` - Register new user
- `loginUser(email, password)` - Login existing user
- `logoutUser()` - Sign out
- `getUserData(userId)` - Get user data from Firestore

### Firestore Service
- `getContacts(userId)` - Get all contacts
- `addContact(userId, contactData)` - Add new contact
- `updateContact(userId, contactId, contactData)` - Update contact
- `deleteContact(userId, contactId)` - Delete contact
- `subscribeToContacts(userId, callback)` - Real-time contact sync

### Cloud Functions Service
- `sendSOSAlert(contacts, location, message)` - Send emergency SMS alerts
- `sendLocationSMS(phoneNumber, location, userName)` - Share location via SMS

## Environment

- React Native: 0.81.5
- React: 19.1.0
- Expo: ~54.0.0
- Firebase: ^10.7.1

## Troubleshooting

**Firebase not connecting:**
- Verify `firebase.config.js` has correct credentials
- Check Firebase Console that Email/Password auth is enabled
- Ensure Firestore database is created

**Build errors:**
- Clear cache: `expo start -c`
- Reinstall: `rm -rf node_modules && npm install`

**Authentication not working:**
- Check Firebase Console > Authentication > Sign-in method
- Ensure Email/Password is enabled
- Check network connection

## Next Steps

1. Configure your Firebase project credentials
2. Enable Email/Password authentication in Firebase Console
3. Create Firestore database
4. Deploy backend Cloud Functions
5. Run the app and test registration/login

For backend setup, see `../backend/README.md`
