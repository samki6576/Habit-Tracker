"use client"

import { useEffect, useState } from "react"
import { Loader2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { HabitItem } from "@/components/habit-item"
import type { Habit } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface HabitListProps {
  habits: Habit[]
  onRefresh: () => Promise<void>
}

export function HabitList({ habits, onRefresh }: HabitListProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if we're using demo data (all habit IDs start with "demo-")
    if (habits.length > 0 && habits.every((habit) => habit.id.startsWith("demo-"))) {
      setDemoMode(true)
    } else {
      setDemoMode(false)
    }
  }, [habits])

  const handleAddHabit = () => {
    router.push("/habits/new")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Your Habits</h2>
        <div className="flex gap-2 items-center">
          <Button onClick={handleAddHabit} size="sm" className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            Add Habit
          </Button>
        </div>
      </div>

      {demoMode && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Demo Mode Active</AlertTitle>
          <AlertDescription className="text-amber-700">
            You're viewing demo data because Firestore permissions are not properly configured. Changes will be saved
            locally but not persisted to a database.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {habits.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-2">No habits yet</h3>
          <p className="text-gray-500 mb-6">Start tracking your first habit today</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={handleAddHabit}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Habit
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <HabitItem key={habit.id} habit={habit} onUpdate={onRefresh} />
          ))}
        </div>
      )}
    </div>
  )
}
