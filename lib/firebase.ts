import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBRKR4HCGOuogEmrIqBjZ1nIfRxqSB6zT8",
  authDomain: "cfa2024.firebaseapp.com",
  projectId: "cfa2024",
  storageBucket: "cfa2024.appspot.com",
  messagingSenderId: "376352856132",
  appId: "1:376352856132:web:d4684fd9827031215e8411",
  measurementId: "G-XMGL52LYJX",
  databaseURL: "https://cfa2024-default-rtdb.firebaseio.com/",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Test storage connection
console.log("Firebase Storage bucket:", storage.app.options.storageBucket)
