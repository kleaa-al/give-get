-- Simple Firebase Storage Rules (for testing)
-- Copy these to Firebase Console > Storage > Rules

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow all authenticated users to read and write
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
