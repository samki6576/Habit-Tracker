"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import { CompletionRateCard } from "@/components/stats/completion-rate-card"
import { MonthlyTrend } from "@/components/stats/monthly-trend"
import { StreakCard } from "@/components/stats/streak-card"
import { TopHabitCard } from "@/components/stats/top-habit-card"
import { WeeklyHeatmap } from "@/components/stats/weekly-heatmap"
import {
  calculateOverallCompletionRate,
  findLongestStreak,
  getHabitWithLongestCurrentStreak,
  getMonthlyCompletionData,
  getTopHabit,
  getWeeklyCompletionData,
} from "@/lib/stats-utils"
import type { Habit } from "@/lib/types"

interface StatsDashboardProps {
  habits: Habit[]
  loading?: boolean
}

export function StatsDashboard({ habits, loading = false }: StatsDashboardProps) {
  const [stats, setStats] = useState({
    overallCompletionRate: 0,
    weeklyData: [] as { day: string; count: number; total: number }[],
    monthlyData: [] as { month: string; completionRate: number }[],
    topHabit: null as Habit | null,
    longestStreakHabit: null as { habit: Habit; streak: number } | null,
  })

  useEffect(() => {
    if (habits.length === 0) return

    // Calculate all stats
    const overallCompletionRate = calculateOverallCompletionRate(habits)
    const weeklyData = getWeeklyCompletionData(habits)
    const monthlyData = getMonthlyCompletionData(habits)
    const topHabit = getTopHabit(habits)
    const longestStreakHabit = getHabitWithLongestCurrentStreak(habits)

    setStats({
      overallCompletionRate,
      weeklyData,
      monthlyData,
      topHabit,
      longestStreakHabit,
    })
  }, [habits])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium mb-2">No habits to analyze</h3>
        <p className="text-gray-500">Start tracking habits to see detailed statistics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CompletionRateCard
          title="Overall Completion"
          rate={stats.overallCompletionRate}
          description="Average across all habits"
        />

        <StreakCard
          currentStreak={stats.longestStreakHabit?.streak || 0}
          longestStreak={Math.max(stats.longestStreakHabit?.streak || 0, ...habits.map((h) => findLongestStreak(h)))}
        />

        <TopHabitCard habit={stats.topHabit} />

        <WeeklyHeatmap data={stats.weeklyData} />

        <MonthlyTrend data={stats.monthlyData} />
      </div>
    </div>
  )
}
