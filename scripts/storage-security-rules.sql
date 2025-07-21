-- Firebase Storage Security Rules
-- Copy these rules to your Firebase Console > Storage > Rules

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload images
    match /posts/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /profiles/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
