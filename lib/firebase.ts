// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
// We'll use a fallback configuration for preview/development
const firebaseConfig = {
  apiKey: "AIzaSyAXAtVpeBWpCLJIL2cHAX-xbIFyCY9kF2E",
  authDomain: "track-3447a.firebaseapp.com",
  projectId: "track-3447a",
  storageBucket: "track-3447a.firebasestorage.app",
  messagingSenderId: "63403525240",
  appId: "1:63403525240:web:f8736056791bfbe195198d"
};


// Initialize Firebase only if it hasn't been initialized yet
let app
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig)
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
