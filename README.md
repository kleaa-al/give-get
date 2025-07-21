# Give & Get - React Native App

A community-driven mobile app for sharing and requesting items, built with React Native and Firebase.

## Features

- **Authentication**: User registration and login with Firebase Auth
- **Post Items**: Share items you don't need anymore
- **Request Items**: Ask for items you need from the community
- **Real-time Updates**: Live updates using Firestore
- **Image Upload**: Upload photos using device camera or gallery
- **Profile Management**: Edit profile information and view your posts
- **Search & Filter**: Find items by description or location

## Tech Stack

- **React Native** - Mobile app framework
- **Firebase Auth** - User authentication
- **Firestore** - Real-time database
- **Firebase Storage** - Image storage
- **React Navigation** - Navigation library
- **React Native Vector Icons** - Icon library
- **React Native Image Picker** - Image selection

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- Firebase project

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd give-and-get-react-native
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **iOS Setup**
   \`\`\`bash
   cd ios && pod install && cd ..
   \`\`\`

4. **Firebase Configuration**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Enable Storage
   - Download configuration files:
     - `google-services.json` for Android → `android/app/`
     - `GoogleService-Info.plist` for iOS → `ios/GiveAndGetApp/`

5. **Update Firebase Config**
   - Update the Firebase configuration in the downloaded files
   - Make sure package names match your app

### Running the App

**Android:**
\`\`\`bash
npx react-native run-android
\`\`\`

**iOS:**
\`\`\`bash
npx react-native run-ios
\`\`\`

## Firebase Security Rules

### Firestore Rules
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /requests/{requestId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
\`\`\`

### Storage Rules
\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
\`\`\`

## Project Structure

\`\`\`
src/
├── components/          # Reusable components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── config/            # Firebase and other configs
└── assets/            # Images and other assets
\`\`\`

## Key Features Implementation

### Authentication Flow
- Welcome screen with login/register options
- Firebase Auth integration
- Automatic login state management

### Post Management
- Create posts with images and descriptions
- Real-time updates using Firestore listeners
- Search and filter functionality

### Profile System
- User profile creation and editing
- View user's own posts and requests
- Profile photo support

### Navigation
- Tab-based navigation for main screens
- Stack navigation for detailed flows
- Proper back button handling

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   \`\`\`bash
   npx react-native start --reset-cache
   \`\`\`

2. **Android build issues**
   \`\`\`bash
   cd android && ./gradlew clean && cd ..
   \`\`\`

3. **iOS build issues**
   \`\`\`bash
   cd ios && pod install && cd ..
   \`\`\`

4. **Firebase connection issues**
   - Verify configuration files are in correct locations
   - Check package names match Firebase project settings
   - Ensure Firebase services are enabled

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
