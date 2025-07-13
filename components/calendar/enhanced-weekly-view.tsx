"use client"

import { Check, FlameIcon } from "lucide-react"

import {
  formatDateString,
  formatDayDisplay,
  getDateCompletionData,
  getFirstDayOfWeek,
  getWeekDates,
  isToday,
} from "@/lib/calendar-utils"
import { getStreakLengthAtDate, isDateInActiveStreak } from "@/lib/streak-utils"
import type { Habit } from "@/lib/types"

interface WeeklyViewProps {
  year: number
  month: number
  day: number
  habits: Habit[]
  streakMode: boolean
}

export function WeeklyView({ year, month, day, habits, streakMode }: WeeklyViewProps) {
  // Generate dates for the week
  const startDate = getFirstDayOfWeek(year, month, day)
  const weekDates = getWeekDates(startDate)

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Week header with day names */}
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="py-2 px-4 font-medium text-sm border-r border-gray-200">Habit</div>
        {weekDates.map((date) => {
          const isCurrentDay = isToday(date)
          return (
            <div
              key={date.toISOString()}
              className={`py-2 text-center font-medium text-sm border-r border-gray-200 last:border-r-0
                ${isCurrentDay ? "bg-blue-50 text-blue-700" : ""}`}
            >
              {formatDayDisplay(date)}
            </div>
          )
        })}
      </div>

      {/* Habits grid */}
      <div className="divide-y divide-gray-200">
        {habits.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No habits selected. Use the filter to select habits to display.
          </div>
        ) : (
          habits.map((habit) => (
            <div key={habit.id} className="grid grid-cols-8 hover:bg-gray-50">
              {/* Habit name column */}
              <div className="p-3 border-r border-gray-200 font-medium truncate">{habit.title}</div>

              {/* Days of the week */}
              {weekDates.map((date) => {
                const dateStr = formatDateString(date.getFullYear(), date.getMonth(), date.getDate())
                const { activeHabits } = getDateCompletionData([habit], dateStr)
                const isActive = activeHabits.length > 0
                const isCompleted = habit.doneDates.includes(dateStr)
                const streakLength = isCompleted ? getStreakLengthAtDate(habit, dateStr) : 0
                const isInActiveStreak = streakMode && isDateInActiveStreak(habit, dateStr)
                const isCurrentDay = isToday(date)

                // Determine styles based on completion and streak status
                let bgColor = isCurrentDay ? "bg-blue-50" : ""
                if (isCompleted) {
                  bgColor = isCurrentDay ? "bg-blue-50" : "bg-green-50"
                }

                const borderClass = isInActiveStreak ? "ring-2 ring-inset ring-orange-300" : ""

                return (
                  <div
                    key={dateStr}
                    className={`p-3 border-r border-gray-200 last:border-r-0 min-h-[80px] relative ${bgColor} ${borderClass}`}
                  >
                    {isActive ? (
                      <div className="flex items-center justify-center h-full">
                        {isCompleted ? (
                          <div className="flex items-center text-green-700">
                            <Check className="h-5 w-5 text-green-500" />

                            {streakMode && streakLength > 1 && (
                              <div className="ml-1 flex items-center">
                                <span className="text-xs font-bold text-orange-600 mr-0.5">{streakLength}</span>
                                <FlameIcon className="h-3 w-3 text-orange-500" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="h-5 w-5 rounded-full border-2 border-gray-300"></span>
                        )}
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-full">
                        <span className="text-xs text-gray-400">N/A</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
