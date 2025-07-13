// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
// Use environment variables with fallback for development
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAXAtVpeBWpCLJIL2cHAX-xbIFyCY9kF2E",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "track-3447a.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "track-3447a",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "track-3447a.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "63403525240",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:63403525240:web:f8736056791bfbe195198d"
};

// Initialize Firebase only if it hasn't been initialized yet
let app
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig)
    console.log("Firebase initialized successfully")
  } catch (error) {
    console.error("Firebase initialization error:", error)
    // In a real app, you might want to show a UI for manual configuration
  }
} else {
  app = getApps()[0]
}

// Initialize Firebase Authentication and Firestore
export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null

// Export the app instance for other uses
export { app }
