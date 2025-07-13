"use client"

import { useState } from "react"
import { Check, Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ReminderSettings } from "@/components/reminder-settings"
import { useToast } from "@/hooks/use-toast"
import { deleteHabit, markHabitAsDone, unmarkHabitAsDone } from "@/lib/habit-service"
import { formatTimeForDisplay, getShortDayName } from "@/lib/notification-service"
import type { Habit } from "@/lib/types"
import { calculateStreak, getTodayDate } from "@/lib/utils"

interface HabitItemProps {
  habit: Habit
  onUpdate: () => void
}

export function HabitItem({ habit, onUpdate }: HabitItemProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const today = getTodayDate()
  const isDoneToday = habit.doneDates.includes(today)
  const streak = calculateStreak(habit.doneDates)

  const handleToggleDone = async () => {
    try {
      setIsLoading(true)

      let success
      if (isDoneToday) {
        success = await unmarkHabitAsDone(habit.id)
      } else {
        success = await markHabitAsDone(habit.id)
      }

      if (success) {
        toast({
          title: isDoneToday ? "Habit unmarked" : "Habit completed",
          description: isDoneToday
            ? "You've unmarked this habit for today"
            : "Great job! You've completed this habit for today",
        })
        onUpdate()
      } else {
        throw new Error("Failed to update habit")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update habit",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this habit?")) return

    try {
      setIsDeleting(true)
      const success = await deleteHabit(habit.id)

      if (success) {
        toast({
          title: "Habit deleted",
          description: "The habit has been deleted successfully",
        })
        onUpdate()
      } else {
        throw new Error("Failed to delete habit")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete habit",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="w-full glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>{habit.title}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting || isLoading}
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            <span className="sr-only">Delete</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {habit.description && <p className="text-sm text-gray-500 mb-3">{habit.description}</p>}

        {habit.reminder?.enabled && (
          <div className="bg-black-50 text-black-700 text-xs rounded p-2 mb-3 flex items-center">
            <span className="font-medium">Reminder:</span>
            <span className="ml-1">
              {formatTimeForDisplay(habit.reminder.time)} on{" "}
              {habit.reminder.days.map((day) => getShortDayName(day)).join(", ")}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium">
              Current streak:{" "}
              <span className="text-teal-600">
                {streak} day{streak !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Total: {habit.doneDates.length} day{habit.doneDates.length !== 1 ? "s" : ""}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          onClick={handleToggleDone}
          disabled={isLoading}
          variant={isDoneToday ? "outline" : "default"}
          className={`w-full ${isDoneToday ? "border-teal-500 text-teal-700" : ""}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : isDoneToday ? (
            <>
              <Check className="mr-2 h-4 w-4 text-teal-500" />
              Completed Today
            </>
          ) : (
            "Mark as Complete"
          )}
        </Button>

        <ReminderSettings habit={habit} onUpdate={onUpdate} />
      </CardFooter>
    </Card>
  )
}
