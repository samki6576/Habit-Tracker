import { CalendarDay } from "@/components/calendar/calendar-day"
import { getCalendarDays } from "@/lib/calendar-utils"
import type { Habit } from "@/lib/types"

interface CalendarGridProps {
  year: number
  month: number
  habits: Habit[]
  streakMode: boolean
}

export function CalendarGrid({ year, month, habits, streakMode }: CalendarGridProps) {
  const calendarDays = getCalendarDays(year, month)
  const today = new Date()
  const isToday = (day: number) => {
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
  }

  // Days of the week
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="overflow-x-auto">
      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-1 min-w-[420px] sm:min-w-0">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 min-w-[420px] sm:min-w-0">
        {calendarDays.map((calendarDay, index) => {
          // For previous month days
          let displayMonth = month
          let displayYear = year

          if (!calendarDay.currentMonth) {
            if (index < 7) {
              // Previous month
              displayMonth = month === 0 ? 11 : month - 1
              displayYear = month === 0 ? year - 1 : year
            } else {
              // Next month
              displayMonth = month === 11 ? 0 : month + 1
              displayYear = month === 11 ? year + 1 : year
            }
          }

          return (
            <CalendarDay
              key={`${displayYear}-${displayMonth}-${calendarDay.day}`}
              day={calendarDay.day}
              year={displayYear}
              month={displayMonth}
              isCurrentMonth={calendarDay.currentMonth}
              isToday={calendarDay.currentMonth && isToday(calendarDay.day)}
              habits={habits}
              streakMode={streakMode}
            />
          )
        })}
      </div>
    </div>
  )
}
