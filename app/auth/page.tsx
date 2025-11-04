"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { AlertCircle } from "lucide-react"

import { AuthForm } from "@/components/auth-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { auth } from "@/lib/firebase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AuthPage() {
  const [error, setError] = useState<string | null>(null)
  const [firebaseError, setFirebaseError] = useState<boolean>(!auth)

  const handleSignIn = async (email: string, password: string) => {
    if (!auth) {
      setFirebaseError(true)
      throw new Error("Firebase authentication is not initialized")
    }

    try {
      setError(null)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
        throw error
      }
      throw new Error("Failed to sign in")
    }
  }

  const handleSignUp = async (email: string, password: string) => {
    if (!auth) {
      setFirebaseError(true)
      throw new Error("Firebase authentication is not initialized")
    }

    try {
      setError(null)
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
        throw error
      }
      throw new Error("Failed to create account")
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-shadow">Habit Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400">Track your daily habits and build consistency</p>
        </div>

        {firebaseError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Firebase Error</AlertTitle>
            <AlertDescription>
              Firebase authentication could not be initialized. Please check your Firebase configuration.
            </AlertDescription>
          </Alert>
        )}

        {error && !firebaseError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!firebaseError && <AuthForm onSignIn={handleSignIn} onSignUp={handleSignUp} />}

        {firebaseError && (
          <div className="p-6 border rounded-lg">
            <h2 className="text-lg font-medium">Demo Mode</h2>
            <p className="mt-2 text-sm text-gray-500">
              Firebase is not properly configured. In a real application, you would need to set up your Firebase project
              and add the configuration to your environment variables.
            </p>
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
              <p className="font-mono">NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key</p>
              <p className="font-mono">NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com</p>
              <p className="font-mono">NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id</p>
              <p className="font-mono">...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
