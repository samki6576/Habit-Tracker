"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { AlertCircle, BarChart3, Calendar, Loader2 } from "lucide-react"

import { auth } from "@/lib/firebase"
import { getUserHabits } from "@/lib/habit-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { HabitList } from "@/components/habit-list"
import { NotificationChecker } from "@/components/notification-checker"
import { NotificationPermissionBanner } from "@/components/notification-permission-banner"
import { Toaster } from "@/components/ui/toaster"
import type { Habit } from "@/lib/types"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [habits, setHabits] = useState<Habit[]>([])
  const [firebaseError, setFirebaseError] = useState<boolean>(!auth)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const fetchHabits = async () => {
    try {
      const userHabits = await getUserHabits()
      setHabits(userHabits)
    } catch (error) {
      console.error("Error fetching habits:", error)
    }
  }

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      setFirebaseError(true)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false)
      setUser(user)
      if (!user) {
        router.push("/auth")
      } else {
        // Fetch habits when user is authenticated
        fetchHabits()
      }
    })

    return () => unsubscribe()
  }, [router])

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-gray-500">Track your daily habits and build consistency</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="flex items-center" onClick={() => router.push("/calendar")}>
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>

          <Button variant="outline" className="flex items-center" onClick={() => router.push("/stats")}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Stats
          </Button>

          {/* Disable or remove the Shared button below */}
          {/* 
          <Button variant="outline" className="flex items-center" onClick={() => router.push("/shared")}>
            <Share2 className="h-4 w-4 mr-2" />
            Shared
          </Button>
          */}

          {user && (
            <div className="flex items-center">
              <div className="mr-4 text-right">
                <p className="text-sm font-medium">{user.email}</p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm text-gray-500"
                  onClick={() => {
                    auth?.signOut()
                    router.push("/auth")
                  }}
                >
                  Sign Out
                </Button>
              </div>
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          )}
        </div>
      </div>

      <NotificationPermissionBanner />
      <NotificationChecker habits={habits} />

      <HabitList habits={habits} onRefresh={fetchHabits} />
      <Toaster />
    </div>
  )
}
