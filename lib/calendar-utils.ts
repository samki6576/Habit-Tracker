import type { Habit } from "@/lib/types"

// Get days in month
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

// Get day of week (0 = Sunday, 6 = Saturday)
export function getDayOfWeek(year: number, month: number, day: number): number {
  return new Date(year, month, day).getDay()
}

// Get month name
export function getMonthName(month: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months[month]
}

// Format date as YYYY-MM-DD
export function formatDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

// Parse date string (YYYY-MM-DD)
export function parseDateString(dateString: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateString.split("-").map(Number)
  return { year, month: month - 1, day }
}

// Get calendar days for a month (including padding days from prev/next month)
export function getCalendarDays(year: number, month: number): Array<{ day: number; currentMonth: boolean }> {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfWeek = getDayOfWeek(year, month, 1)

  const days: Array<{ day: number; currentMonth: boolean }> = []

  // Add days from previous month
  const prevMonth = month === 0 ? 11 : month - 1
  const prevMonthYear = month === 0 ? year - 1 : year
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth)

  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({
      day: daysInPrevMonth - firstDayOfWeek + i + 1,
      currentMonth: false,
    })
  }

  // Add days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      currentMonth: true,
    })
  }

  // Add days from next month
  const totalDaysToShow = 42 // 6 rows of 7 days
  const remainingDays = totalDaysToShow - days.length

  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      currentMonth: false,
    })
  }

  return days
}

// Get habits completed on a specific date
export function getHabitsCompletedOnDate(habits: Habit[], dateString: string): Habit[] {
  return habits.filter((habit) => habit.doneDates.includes(dateString))
}

// Get completion status for each habit on each day of the month
export function getMonthlyCompletionData(
  habits: Habit[],
  year: number,
  month: number,
): Record<string, Record<string, boolean>> {
  const result: Record<string, Record<string, boolean>> = {}

  // Initialize result with all days in the month
  const daysInMonth = getDaysInMonth(year, month)
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = formatDateString(year, month, day)
    result[dateString] = {}

    // Initialize completion status for each habit
    habits.forEach((habit) => {
      result[dateString][habit.id] = habit.doneDates.includes(dateString)
    })
  }

  return result
}

// Get completion percentage for a specific date
export function getCompletionPercentage(habits: Habit[], dateString: string): number {
  if (!habits.length) return 0

  const completedHabits = getHabitsCompletedOnDate(habits, dateString)
  return Math.round((completedHabits.length / habits.length) * 100)
}

// Check if a habit was created on or before a specific date
export function wasHabitCreatedOnOrBefore(habit: Habit, dateString: string): boolean {
  const habitCreatedAt = typeof habit.createdAt === "string" ? new Date(habit.createdAt) : habit.createdAt

  const date = new Date(dateString)
  date.setHours(23, 59, 59, 999) // End of the day

  return habitCreatedAt <= date
}

// Get active habits for a specific date
export function getActiveHabitsForDate(habits: Habit[], dateString: string): Habit[] {
  return habits.filter((habit) => wasHabitCreatedOnOrBefore(habit, dateString))
}

// Get completion data for a specific date
export function getDateCompletionData(
  habits: Habit[],
  dateString: string,
): {
  activeHabits: Habit[]
  completedHabits: Habit[]
  completionPercentage: number
} {
  const activeHabits = getActiveHabitsForDate(habits, dateString)
  const completedHabits = getHabitsCompletedOnDate(habits, dateString)

  const completionPercentage = activeHabits.length
    ? Math.round((completedHabits.length / activeHabits.length) * 100)
    : 0

  return {
    activeHabits,
    completedHabits,
    completionPercentage,
  }
}

// Get the date for the first day of a week
export function getFirstDayOfWeek(year: number, month: number, day: number): Date {
  const date = new Date(year, month, day)
  const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday
  date.setDate(date.getDate() - dayOfWeek) // Go back to Sunday
  return date
}

// Get dates for an entire week, starting from Sunday
export function getWeekDates(startDate: Date): Date[] {
  const dates: Date[] = []
  const currentDate = new Date(startDate)

  for (let i = 0; i < 7; i++) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

// Format a date range for display (e.g., "May 5 - May 11, 2025")
export function formatDateRange(startDate: Date, endDate: Date): string {
  const startMonth = getMonthName(startDate.getMonth()).slice(0, 3)
  const endMonth = getMonthName(endDate.getMonth()).slice(0, 3)
  const startDay = startDate.getDate()
  const endDay = endDate.getDate()
  const startYear = startDate.getFullYear()
  const endYear = endDate.getFullYear()

  if (startYear !== endYear) {
    return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`
  } else if (startMonth !== endMonth) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`
  } else {
    return `${startMonth} ${startDay} - ${endDay}, ${startYear}`
  }
}

// Format date for display (e.g., "Mon 5")
export function formatDayDisplay(date: Date): string {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const dayOfWeek = dayNames[date.getDay()]
  const dayOfMonth = date.getDate()
  return `${dayOfWeek} ${dayOfMonth}`
}

// Check if a date is today
export function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}
