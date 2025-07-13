"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"

import { auth } from "@/lib/firebase"
import { getUserHabits } from "@/lib/habit-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { StatsDashboard } from "@/components/stats-dashboard"
import type { Habit } from "@/lib/types"

export default function StatsPage() {
  const [loading, setLoading] = useState(true)
  const [habits, setHabits] = useState<Habit[]>([])
  const [firebaseError, setFirebaseError] = useState<boolean>(!auth)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      setFirebaseError(true)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false)
        router.push("/auth")
        return
      }

      // Fetch habits
      fetchHabits()
    })

    return () => unsubscribe()
  }, [router])

  const fetchHabits = async () => {
    try {
      setError(null)
      const userHabits = await getUserHabits()
      setHabits(userHabits)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch habits")
      console.error("Error fetching habits:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
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
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/dashboard")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <StatsDashboard habits={habits} loading={loading} />
    </div>
  )
}
