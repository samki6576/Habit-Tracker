"use client"

import { useState } from "react"
import { Check, FlameIcon } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Habit } from "@/lib/types"
import { formatDateString, getDateCompletionData } from "@/lib/calendar-utils"
import { getStreakLengthAtDate, isDateInActiveStreak, isStreakOngoing } from "@/lib/streak-utils"

interface CalendarDayProps {
  day: number
  year: number
  month: number
  isCurrentMonth: boolean
  isToday: boolean
  habits: Habit[]
  streakMode: boolean
}

export function CalendarDay({ day, year, month, isCurrentMonth, isToday, habits, streakMode }: CalendarDayProps) {
  const [open, setOpen] = useState(false)

  const dateString = formatDateString(year, month, day)
  const { activeHabits, completedHabits, completionPercentage } = getDateCompletionData(habits, dateString)

  // Determine background color based on completion percentage
  let bgColor = "bg-white"
  let textColor = isCurrentMonth ? "text-gray-900" : "text-gray-400"

  if (isCurrentMonth && activeHabits.length > 0) {
    if (completionPercentage === 100) {
      bgColor = "bg-green-100"
    } else if (completionPercentage >= 50) {
      bgColor = "bg-green-50"
    } else if (completionPercentage > 0) {
      bgColor = "bg-yellow-50"
    }
  }

  if (isToday) {
    bgColor = "bg-blue-50"
    textColor = "text-blue-700"
  }

  // Count streaks for the day
  const streaks = completedHabits
    .map((habit) => {
      const streakLength = getStreakLengthAtDate(habit, dateString)
      const isOngoing = isStreakOngoing(habit, dateString)
      const isActive = isDateInActiveStreak(habit, dateString)
      return { habit, streakLength, isOngoing, isActive }
    })
    .filter(({ streakLength }) => streakLength > 1)

  // Show streak badges
  const hasStreaks = streaks.length > 0
  const maxStreak = hasStreaks ? Math.max(...streaks.map((s) => s.streakLength)) : 0
  const ongoingStreaks = streaks.filter((s) => s.isOngoing)
  const activeStreaks = streaks.filter((s) => s.isActive)

  // Don't show popover for days with no active habits
  const showPopover = isCurrentMonth && activeHabits.length > 0

  const renderStreakIndicator = () => {
    if (!hasStreaks || !streakMode) return null

    // Show flame icon for any streak
    return (
      <div className="absolute bottom-1 right-1">
        <div className="flex items-center">
          <span className="text-xs font-bold mr-0.5">{maxStreak}</span>
          <FlameIcon className="h-3 w-3 text-orange-500" />
        </div>
      </div>
    )
  }

  const dayContent = (
    <div
      className={`relative h-full min-h-[80px] p-1 ${bgColor} ${
        isCurrentMonth ? "hover:bg-gray-50" : "opacity-50"
      } transition-colors rounded-md border ${isToday ? "border-blue-300" : "border-gray-200"} ${
        streakMode && activeStreaks.length > 0 ? "ring-2 ring-orange-300" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <span className={`text-sm font-medium ${textColor}`}>{day}</span>
        {isCurrentMonth && activeHabits.length > 0 && (
          <span className="text-xs font-medium bg-gray-100 rounded-full px-1.5 py-0.5">
            {completedHabits.length}/{activeHabits.length}
          </span>
        )}
      </div>

      {isCurrentMonth && completedHabits.length > 0 && (
        <div className="mt-1">
          {completedHabits.slice(0, 2).map((habit) => {
            const streakInfo = streaks.find((s) => s.habit.id === habit.id)
            return (
              <div key={habit.id} className="flex items-center text-xs text-green-700 truncate">
                <Check className="h-3 w-3 mr-1 text-green-500" />
                <span className="truncate">{habit.title}</span>
                {streakMode && streakInfo && streakInfo.streakLength > 1 && (
                  <span className="ml-1 text-xs text-orange-500 font-bold">{streakInfo.streakLength}</span>
                )}
              </div>
            )
          })}
          {completedHabits.length > 2 && (
            <div className="text-xs text-gray-500 mt-1">+{completedHabits.length - 2} more</div>
          )}
        </div>
      )}

      {renderStreakIndicator()}
    </div>
  )

  if (!showPopover) {
    return dayContent
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-full text-left" onClick={() => setOpen(true)}>
          {dayContent}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">
              {new Date(year, month, day).toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <span className="text-sm font-medium bg-gray-100 rounded-full px-2 py-1">{completionPercentage}%</span>
          </div>

          <div className="space-y-2">
            {activeHabits.map((habit) => {
              const isCompleted = completedHabits.some((h) => h.id === habit.id)
              const streak = isCompleted ? getStreakLengthAtDate(habit, dateString) : 0
              const showStreak = streak > 1

              return (
                <div
                  key={habit.id}
                  className={`flex items-center p-2 rounded ${
                    isCompleted ? "bg-green-50 text-green-700" : "bg-gray-50"
                  }`}
                >
                  <div
                    className={`mr-2 h-4 w-4 rounded-full flex items-center justify-center ${
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    {isCompleted && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className="font-medium">{habit.title}</span>

                  {showStreak && (
                    <div className="ml-auto flex items-center">
                      <span className="text-xs font-bold mr-1">{streak}</span>
                      <FlameIcon className="h-3 w-3 text-orange-500" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
