"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatDateRange, getFirstDayOfWeek, getMonthName, getWeekDates } from "@/lib/calendar-utils"

interface CalendarHeaderProps {
  year: number
  month: number
  day: number
  viewType: "monthly" | "weekly"
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
}

export function CalendarHeader({ year, month, day, viewType, onPrevMonth, onNextMonth, onToday }: CalendarHeaderProps) {
  const monthName = getMonthName(month)

  // Generate week date range for weekly view
  const weekStartDate = getFirstDayOfWeek(year, month, day)
  const weekDates = getWeekDates(weekStartDate)
  const weekEndDate = weekDates[6]
  const weekDateRange = formatDateRange(weekStartDate, weekEndDate)

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold">{viewType === "monthly" ? `${monthName} ${year}` : weekDateRange}</h2>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>
        <div className="flex">
          <Button variant="outline" size="icon" onClick={onPrevMonth} className="rounded-r-none">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous {viewType === "monthly" ? "month" : "week"}</span>
          </Button>
          <Button variant="outline" size="icon" onClick={onNextMonth} className="rounded-l-none">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next {viewType === "monthly" ? "month" : "week"}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
