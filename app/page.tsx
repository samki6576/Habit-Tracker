"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { AlertCircle, ArrowLeft, Calendar, Link2, Loader2, Trash2, Users } from "lucide-react"

import { auth } from "@/lib/firebase"
import { deleteSharedHabit, getHabitsSharedByUser } from "@/lib/sharing-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { SharedHabit } from "@/lib/types"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [sharedHabits, setSharedHabits] = useState<SharedHabit[]>([])
  const [error, setError] = useState<string | null>(null)
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

      // Fetch shared habits
      fetchSharedHabits()
    })

    return () => unsubscribe()
  }, [router])

  const fetchSharedHabits = async () => {
    try {
      setError(null)
      const habits = await getHabitsSharedByUser()
      setSharedHabits(habits)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch shared habits")
      console.error("Error fetching shared habits:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shared habit?")) return

    try {
      const success = await deleteSharedHabit(id)

      if (success) {
        toast({
          title: "Shared habit deleted",
          description: "The shared habit has been deleted",
        })
        fetchSharedHabits()
      } else {
        throw new Error("Failed to delete shared habit")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete shared habit",
        variant: "destructive",
      })
    }
  }

  const copyShareLink = async (shareCode: string) => {
    try {
      const baseUrl = window.location.origin
      const shareUrl = `${baseUrl}/share/${shareCode}`
      await navigator.clipboard.writeText(shareUrl)

      toast({
        title: "Copied to clipboard",
        description: "Share link copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
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

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Shared Habits</h1>
          <p className="mt-2 text-gray-500">Habits you've shared with others</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {sharedHabits.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No shared habits</h3>
          <p className="text-gray-500 mb-6">You haven't shared any habits yet</p>
          <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sharedHabits.map((habit) => (
            <Card key={habit.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex justify-between items-center">
                  <span>{habit.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(habit.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Share Code: <span className="font-mono">{habit.shareCode}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {habit.description && <p className="text-sm text-gray-500 mb-3">{habit.description}</p>}

                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Shared on {new Date(habit.sharedAt).toLocaleDateString()}
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Expires on {new Date(habit.expiresAt).toLocaleDateString()}
                </div>

                {habit.claimed && (
                  <div className="mt-3 bg-green-50 text-green-700 text-sm rounded p-2">This habit has been claimed</div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => copyShareLink(habit.shareCode)}>
                  <Link2 className="h-4 w-4 mr-2" />
                  Copy Share Link
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
