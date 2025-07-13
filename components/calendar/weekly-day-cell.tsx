"use client"

import { Check, FlameIcon } from "lucide-react"

import type { Habit } from "@/lib/types"
import { isToday } from "@/lib/calendar-utils"
import { getStreakLengthAtDate, isDateInActiveStreak } from "@/lib/streak-utils"

interface WeeklyDayCellProps {
  date: Date
  habit: Habit
  isCompleted: boolean
  isActive: boolean
  streakMode: boolean
}

export function WeeklyDayCell({ date, habit, isCompleted, isActive, streakMode }: WeeklyDayCellProps) {
  const dateStr = date.toISOString().split("T")[0]
  const streakLength = isCompleted ? getStreakLengthAtDate(habit, dateStr) : 0
  const isInActiveStreak = streakMode && isDateInActiveStreak(habit, dateStr)
  const currentDay = isToday(date)

  // Determine styles based on completion and streak status
  let bgColor = currentDay ? "bg-black-50" : ""
  if (isCompleted) {
    bgColor = currentDay ? "bg-black-50" : "bg-green-50"
  }

  const borderClass = isInActiveStreak ? "ring-2 ring-inset ring-orange-300" : ""

  return (
    <div className={`p-3 border-r border-gray-200 last:border-r-0 min-h-[80px] relative ${bgColor} ${borderClass}`}>
      {isActive ? (
        <div className="flex items-center h-full">
          {isCompleted ? (
            <div className="flex items-center text-green-700">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              <span className="text-sm font-medium">Completed</span>

              {streakMode && streakLength > 1 && (
                <div className="ml-2 flex items-center">
                  <span className="text-xs font-bold text-orange-600 mr-1">{streakLength}</span>
                  <FlameIcon className="h-3 w-3 text-orange-500" />
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-400">Not completed</span>
          )}
        </div>
      ) : (
        <span className="text-xs text-gray-400">Not active</span>
      )}
    </div>
  )
}
