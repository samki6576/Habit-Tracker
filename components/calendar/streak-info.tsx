import { FlameIcon } from "lucide-react"

import type { Habit } from "@/lib/types"
import { getCurrentStreak, getCurrentStreakStartDate } from "@/lib/streak-utils"

interface StreakInfoProps {
  habits: Habit[]
}

export function StreakInfo({ habits }: StreakInfoProps) {
  if (!habits.length) return null

  // Get habits with active streaks (streak > 0)
  const habitsWithStreaks = habits
    .map((habit) => ({
      habit,
      streak: getCurrentStreak(habit),
      startDate: getCurrentStreakStartDate(habit),
    }))
    .filter((item) => item.streak > 0)
    .sort((a, b) => b.streak - a.streak) // Sort by streak length (descending)

  if (!habitsWithStreaks.length) return null

  return (
    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 mb-4">
      <h3 className="text-lg font-medium flex items-center text-orange-700 mb-2">
        <FlameIcon className="h-5 w-5 mr-2 text-orange-500" />
        Current Streaks
      </h3>

      <div className="space-y-2">
        {habitsWithStreaks.map(({ habit, streak, startDate }) => (
          <div key={habit.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-medium text-orange-700">{habit.title}</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-orange-600 mr-2">{streak}</span>
              <span className="text-sm text-orange-700">day{streak !== 1 ? "s" : ""}</span>
            </div>
          </div>
        ))}
      </div>

      {habitsWithStreaks.length > 0 && (
        <p className="text-xs text-orange-600 mt-3">
          Note: A streak counts consecutive days where you completed a habit. It breaks if you miss a day.
        </p>
      )}
    </div>
  )
}
