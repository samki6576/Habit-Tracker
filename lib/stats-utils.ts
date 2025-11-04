import type { Habit } from "@/lib/types"
import { formatDate } from "@/lib/utils"

// Get dates for the last n days
export function getLastNDays(n: number): string[] {
  const dates: string[] = []
  const today = new Date()

  for (let i = 0; i < n; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.unshift(formatDate(date))
  }

  return dates
}

// Calculate completion rate for a habit
export function calculateCompletionRate(habit: Habit, days = 30): number {
  const recentDates = getLastNDays(days)
  const completedDays = habit.doneDates.filter((date) => recentDates.includes(date))

  return (completedDays.length / days) * 100
}

// Calculate overall completion rate for all habits
export function calculateOverallCompletionRate(habits: Habit[], days = 30): number {
  if (!habits.length) return 0

  const rates = habits.map((habit) => calculateCompletionRate(habit, days))
  const sum = rates.reduce((acc, rate) => acc + rate, 0)

  return sum / habits.length
}

// Find the longest streak (all-time)
export function findLongestStreak(habit: Habit): number {
  if (!habit.doneDates.length) return 0

  // Sort dates in ascending order
  const sortedDates = [...habit.doneDates].sort()

  let currentStreak = 1
  let maxStreak = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i])
    const prevDate = new Date(sortedDates[i - 1])

    // Check if dates are consecutive
    const diffTime = currentDate.getTime() - prevDate.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    if (diffDays === 1) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }

  return maxStreak
}

// Get completion data for the last n days
export function getCompletionDataForLastNDays(habit: Habit, n = 30): { date: string; completed: boolean }[] {
  const dates = getLastNDays(n)

  return dates.map((date) => ({
    date,
    completed: habit.doneDates.includes(date),
  }))
}

// Get weekly completion data
export function getWeeklyCompletionData(habits: Habit[]): { day: string; count: number; total: number }[] {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const result = daysOfWeek.map((day) => ({ day, count: 0, total: 0 }))

  // Count completions for each day of the week
  habits.forEach((habit) => {
    habit.doneDates.forEach((dateStr) => {
      const date = new Date(dateStr)
      const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday
      result[dayOfWeek].count++
    })
  })

  // Calculate totals (how many of each day have passed in the last 10 weeks)
  const today = new Date()
  const tenWeeksAgo = new Date(today)
  tenWeeksAgo.setDate(today.getDate() - 70) // 10 weeks = 70 days

  for (let d = new Date(tenWeeksAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay()
    result[dayOfWeek].total++
  }

  return result
}

// Get monthly completion data
export function getMonthlyCompletionData(habits: Habit[], months = 6): { month: string; completionRate: number }[] {
  const result: { month: string; completionRate: number }[] = []
  const today = new Date()

  for (let i = 0; i < months; i++) {
    const date = new Date(today)
    date.setMonth(today.getMonth() - i)

    const monthName = date.toLocaleString("default", { month: "short" })
    const year = date.getFullYear()
    const monthKey = `${monthName} ${year}`

    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    let totalPossible = 0
    let totalCompleted = 0

    habits.forEach((habit) => {
      // Only count days after the habit was created
      const habitCreatedAt = typeof habit.createdAt === "string" ? new Date(habit.createdAt) : habit.createdAt

      // Skip if habit was created after this month
      if (habitCreatedAt > monthEnd) return

      // Adjust start date if habit was created during this month
      const startDate = habitCreatedAt > monthStart ? habitCreatedAt : monthStart

      // Calculate days in month for this habit
      const daysInMonth = Math.min(
        (monthEnd.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1,
        monthEnd.getDate(),
      )

      totalPossible += daysInMonth

      // Count completed days in this month
      habit.doneDates.forEach((dateStr) => {
        const date = new Date(dateStr)
        if (date >= startDate && date <= monthEnd) {
          totalCompleted++
        }
      })
    })

    const completionRate = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0

    result.unshift({
      month: monthKey,
      completionRate: Math.round(completionRate),
    })
  }

  return result
}

// Get habit with the highest completion rate
export function getTopHabit(habits: Habit[]): Habit | null {
  if (!habits.length) return null

  return habits.reduce((top, habit) => {
    const topRate = calculateCompletionRate(top)
    const currentRate = calculateCompletionRate(habit)

    return currentRate > topRate ? habit : top
  }, habits[0])
}

// Get habit with the longest current streak
export function getHabitWithLongestCurrentStreak(habits: Habit[]): { habit: Habit; streak: number } | null {
  if (!habits.length) return null

  let maxStreak = 0
  let topHabit = habits[0]

  habits.forEach((habit) => {
    const streak = calculateStreak(habit.doneDates)
    if (streak > maxStreak) {
      maxStreak = streak
      topHabit = habit
    }
  })

  return { habit: topHabit, streak: maxStreak }
}

// Calculate current streak for a habit
export function calculateStreak(doneDates: string[]): number {
  if (!doneDates.length) return 0

  // Sort dates in descending order (newest first)
  const sortedDates = [...doneDates].sort().reverse()

  // Check if the most recent date is today or yesterday
  const today = formatDate(new Date())
  const yesterday = formatDate(new Date(Date.now() - 86400000))

  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0 // Streak broken if most recent date isn't today or yesterday
  }

  let streak = 1
  let currentDate = new Date(sortedDates[0])

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(currentDate)
    prevDate.setDate(prevDate.getDate() - 1)

    if (sortedDates[i] === formatDate(prevDate)) {
      streak++
      currentDate = prevDate
    } else {
      break
    }
  }

  return streak
}
