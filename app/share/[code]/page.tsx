"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { AlertCircle, ArrowLeft, Check, Loader2 } from "lucide-react"

import { auth } from "@/lib/firebase"
import { getSharedHabitByCode, importSharedHabit } from "@/lib/sharing-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { SharedHabit } from "@/lib/types"

export default function SharePage({ params }: { params: { code: string } }) {
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [sharedHabit, setSharedHabit] = useState<SharedHabit | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [imported, setImported] = useState(false)
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
        // Redirect to auth page with return URL
        router.push(`/auth?returnUrl=/share/${params.code}`)
        return
      }

      // Fetch shared habit
      fetchSharedHabit()
    })

    return () => unsubscribe()
  }, [params.code, router])

  const fetchSharedHabit = async () => {
    try {
      setError(null)
      const habit = await getSharedHabitByCode(params.code)

      if (!habit) {
        setError("Invalid or expired share code")
      } else {
        setSharedHabit(habit)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch shared habit")
      console.error("Error fetching shared habit:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    if (!sharedHabit) return

    try {
      setImporting(true)
      const habit = await importSharedHabit(sharedHabit)

      if (habit) {
        setImported(true)
        toast({
          title: "Habit imported",
          description: `"${habit.title}" has been added to your habits`,
        })
      } else {
        throw new Error("Failed to import habit")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import habit",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
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
    <div className="container py-8 max-w-md">
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/dashboard")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : sharedHabit ? (
        <Card>
          <CardHeader>
            <CardTitle>Shared Habit</CardTitle>
            <CardDescription>{sharedHabit.sharedBy} has shared a habit with you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">{sharedHabit.title}</h3>
              {sharedHabit.description && (
                <p className="text-sm text-muted-foreground mt-1">{sharedHabit.description}</p>
              )}
            </div>

            {sharedHabit.category && (
              <div className="bg-blue-50 text-blue-700 text-sm rounded p-2">Category: {sharedHabit.category}</div>
            )}
          </CardContent>
          <CardFooter>
            {imported ? (
              <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
                <Check className="h-4 w-4 mr-2" />
                Added to Your Habits
              </Button>
            ) : (
              <Button onClick={handleImport} disabled={importing} className="w-full">
                {importing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  "Add to My Habits"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : null}
    </div>
  )
}
