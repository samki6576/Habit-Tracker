"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, type User } from "firebase/auth"
import { AlertCircle, BarChart3, Calendar, Loader2 } from "lucide-react"

import { auth } from "@/lib/firebase"
import { getUserHabits } from "@/lib/habit-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { HabitList } from "@/components/habit-list"
import { LoadingPage } from "@/components/loading-page"
import { NotificationChecker } from "@/components/notification-checker"
import { NotificationPermissionBanner } from "@/components/notification-permission-banner"
import { ThemeToggle } from "@/components/theme-toggle"
import { Toaster } from "@/components/ui/toaster"
import type { Habit } from "@/lib/types"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [habits, setHabits] = useState<Habit[]>([])
  const [firebaseError, setFirebaseError] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const fetchHabits = useCallback(async () => {
    try {
      const userHabits = await getUserHabits()
      setHabits(userHabits)
    } catch (error) {
      console.error("Error fetching habits:", error)
      // Even if there's an error, the habit service will fall back to demo mode
      const userHabits = await getUserHabits()
      setHabits(userHabits)
    }
  }, [])

  // Initialize Firebase error state
  useEffect(() => {
    setFirebaseError(!auth)
  }, [])

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
        fetchHabits()
      }
    })

    return () => unsubscribe()
  }, [router, fetchHabits])

  useEffect(() => {
    if (!user) return
    fetchHabits()
  }, [user, fetchHabits])

  if (loading) {
    return <LoadingPage message="Loading..." />
  }

  if (firebaseError) {
    return (
      <div className="container max-w-md mx-auto py-12">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Firebase Error</AlertTitle>
          <AlertDescription>
            Firebase services could not be initialized. Please check your configuration.
          </AlertDescription>
        </Alert>

        <Button onClick={() => router.push("/auth")} className="w-full">
          Return to Auth Page
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-4 px-4 sm:py-8 sm:px-6 relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-gray-500 text-sm sm:text-base">Track your daily habits and build consistency</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex items-center flex-1 sm:flex-none" onClick={() => router.push("/calendar")}>
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Calendar</span>
            </Button>

            <Button variant="outline" size="sm" className="flex items-center flex-1 sm:flex-none" onClick={() => router.push("/stats")}>
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Stats</span>
            </Button>
          </div>

          <ThemeToggle />
          
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
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