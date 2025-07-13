"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"

import { HabitForm } from "@/components/habit-form"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/components/auth-provider"
import { getUserHabits } from "@/lib/habit-service"

export default function NewHabitPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [habits, setHabits] = useState<any[]>([])

  const handleHabitCreated = () => {
    // This will be called after a habit is successfully created
    // The router.push("/dashboard") in HabitForm will handle navigation
  }

  useEffect(() => {
    if (!user) return
    getUserHabits().then((habits) => {
      setHabits(habits)
    })
  }, [user])

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <a href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </a>
        </Button>
      </div>

      <div className="mt-8">
        <HabitForm onHabitCreated={handleHabitCreated} />
      </div>
      <Toaster />
    </div>
  )
}
