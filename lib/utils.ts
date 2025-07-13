import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
  return formatDate(new Date())
}

// Calculate streak for a habit
export function calculateStreak(doneDates: string[]): number {
  if (!doneDates.length) return 0

  // Sort dates in ascending order
  const sortedDates = [...doneDates].sort()

  // Get the most recent date
  const lastDate = new Date(sortedDates[sortedDates.length - 1])

  // Check if the most recent date is today or yesterday
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const isRecentActive = formatDate(lastDate) === formatDate(today) || formatDate(lastDate) === formatDate(yesterday)

  if (!isRecentActive) return 0

  // Count consecutive days
  let streak = 1
  const currentDate = new Date(lastDate)

  while (streak < doneDates.length) {
    currentDate.setDate(currentDate.getDate() - 1)
    const prevDateStr = formatDate(currentDate)

    if (doneDates.includes(prevDateStr)) {
      streak++
    } else {
      break
    }
  }

  return streak
}
