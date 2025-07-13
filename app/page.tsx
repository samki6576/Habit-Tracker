"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"

import { auth } from "@/lib/firebase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { LoadingPage } from "@/components/loading-page"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [firebaseError, setFirebaseError] = useState<boolean>(!auth)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      setFirebaseError(true)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth")
        return
      }

      // Redirect to dashboard
      router.push("/dashboard")
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return <LoadingPage message="Initializing..." />
  }

  if (firebaseError) {
    return (
      <div className="container max-w-md mx-auto py-12">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Firebase Error</AlertTitle>
          <AlertDescription>
            Firebase authentication could not be initialized. Please check your Firebase configuration.
          </AlertDescription>
        </Alert>

        <Button onClick={() => router.push("/auth")} className="w-full">
          Return to Auth Page
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Habit Tracker</h1>
        <p className="text-gray-500 mb-6">Redirecting to dashboard...</p>
        <Button onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
