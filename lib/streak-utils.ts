import type { Habit } from "@/lib/types"
import { formatDateString } from "@/lib/calendar-utils"

// Check if a date is part of an active streak for a habit
export function isDateInActiveStreak(habit: Habit, dateString: string): boolean {
  // Get today's date
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayString = formatDateString(today.getFullYear(), today.getMonth(), today.getDate())

  // If the date is in the future, it can't be part of an active streak
  if (new Date(dateString) > today) {
    return false
  }

  // If the date is today, check if it's completed
  if (dateString === todayString) {
    return habit.doneDates.includes(dateString)
  }

  // Check if the date is completed
  if (!habit.doneDates.includes(dateString)) {
    return false
  }

  // Check if the next day is completed or is today
  const dateObj = new Date(dateString)
  const nextDate = new Date(dateObj)
  nextDate.setDate(nextDate.getDate() + 1)
  const nextDateString = formatDateString(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate())

  return nextDate <= today && (habit.doneDates.includes(nextDateString) || nextDateString === todayString)
}

// Calculate streak length at a given date
export function getStreakLengthAtDate(habit: Habit, dateString: string): number {
  if (!habit.doneDates.includes(dateString)) {
    return 0
  }

  let currentDate = new Date(dateString)
  let streak = 1

  // Count backwards
  while (true) {
    const prevDate = new Date(currentDate)
    prevDate.setDate(prevDate.getDate() - 1)
    const prevDateString = formatDateString(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate())

    if (habit.doneDates.includes(prevDateString)) {
      streak++
      currentDate = prevDate
    } else {
      break
    }
  }

  return streak
}

// Determine if a streak is ongoing on a specific date
export function isStreakOngoing(habit: Habit, dateString: string): boolean {
  // If the date isn't completed, there's no streak
  if (!habit.doneDates.includes(dateString)) {
    return false
  }

  // Check if the next day is completed too
  const date = new Date(dateString)
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + 1)
  const nextDateString = formatDateString(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate())

  // The streak is ongoing if the next day is also completed
  return habit.doneDates.includes(nextDateString)
}

// Get the longest streak for a habit up to a specific date
export function getLongestStreakUpToDate(habit: Habit, dateString: string): number {
  // Filter doneDates that are on or before the specified date
  const relevantDates = habit.doneDates.filter((date) => date <= dateString)

  if (relevantDates.length === 0) {
    return 0
  }

  // Sort dates in ascending order
  const sortedDates = [...relevantDates].sort()

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

// Find streak days in a month
export function findStreakDaysInMonth(habit: Habit, year: number, month: number): string[] {
  const result: string[] = []
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Check each day in the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = formatDateString(year, month, day)

    // If this day is part of a streak (completed and next day is also completed)
    if (habit.doneDates.includes(dateString) && isStreakOngoing(habit, dateString)) {
      result.push(dateString)
    }
  }

  return result
}

// Calculate the current active streak as of today
export function getCurrentStreak(habit: Habit): number {
  const today = new Date()
  const todayString = formatDateString(today.getFullYear(), today.getMonth(), today.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayString = formatDateString(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())

  // Check if today or yesterday is completed
  const lastCompletedIsRecent = habit.doneDates.includes(todayString) || habit.doneDates.includes(yesterdayString)
  if (!lastCompletedIsRecent) {
    return 0
  }

  // Find the starting date for the streak (today or yesterday)
  const streakDate = habit.doneDates.includes(todayString) ? todayString : yesterdayString
  return getStreakLengthAtDate(habit, streakDate)
}

// Find the start date of the current streak
export function getCurrentStreakStartDate(habit: Habit): string | null {
  const streak = getCurrentStreak(habit)
  if (streak === 0) {
    return null
  }

  const today = new Date()
  const todayString = formatDateString(today.getFullYear(), today.getMonth(), today.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayString = formatDateString(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())

  // Determine the most recent completed date (today or yesterday)
  const lastCompletedDate = habit.doneDates.includes(todayString) ? todayString : yesterdayString

  // Calculate the start date by going back (streak - 1) days from the last completed date
  const lastDate = new Date(lastCompletedDate)
  const startDate = new Date(lastDate)
  startDate.setDate(lastDate.getDate() - (streak - 1))

  return formatDateString(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
}
