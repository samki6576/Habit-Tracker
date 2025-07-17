"use client"

import { useEffect, useState } from "react"
import { CalendarDays, FlameIcon, Rows } from "lucide-react"

import { CalendarGrid } from "@/components/calendar/calendar-grid"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { HabitFilter } from "@/components/calendar/habit-filter"
import { StreakInfo } from "@/components/calendar/streak-info"
import { WeeklyView } from "@/components/calendar/enhanced-weekly-view"
import { Button } from "@/components/ui/button"
import type { Habit } from "@/lib/types"

interface CalendarViewProps {
  habits: Habit[]
}

type ViewType = "monthly" | "weekly"

export function CalendarView({ habits }: CalendarViewProps) {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth())
  const [day, setDay] = useState(new Date().getDate())
  const [selectedHabits, setSelectedHabits] = useState<string[]>([])
  const [streakMode, setStreakMode] = useState(false)
  const [viewType, setViewType] = useState<ViewType>("monthly")

  // Initialize selected habits with all habit IDs
  useEffect(() => {
    setSelectedHabits(habits.map((habit) => habit.id))
  }, [habits])

  const handlePrevMonth = () => {
    if (viewType === "monthly") {
      if (month === 0) {
        setMonth(11)
        setYear(year - 1)
      } else {
        setMonth(month - 1)
      }
    } else {
      // Weekly view - go back one week
      const currentDate = new Date(year, month, day)
      currentDate.setDate(currentDate.getDate() - 7)
      setYear(currentDate.getFullYear())
      setMonth(currentDate.getMonth())
      setDay(currentDate.getDate())
    }
  }

  const handleNextMonth = () => {
    if (viewType === "monthly") {
      if (month === 11) {
        setMonth(0)
        setYear(year + 1)
      } else {
        setMonth(month + 1)
      }
    } else {
      // Weekly view - go forward one week
      const currentDate = new Date(year, month, day)
      currentDate.setDate(currentDate.getDate() + 7)
      setYear(currentDate.getFullYear())
      setMonth(currentDate.getMonth())
      setDay(currentDate.getDate())
    }
  }

  const handleToday = () => {
    const today = new Date()
    setYear(today.getFullYear())
    setMonth(today.getMonth())
    setDay(today.getDate())
  }

  const handleSelectAll = () => {
    setSelectedHabits(habits.map((habit) => habit.id))
  }

  const handleSelectNone = () => {
    setSelectedHabits([])
  }

  const handleToggleHabit = (habitId: string) => {
    setSelectedHabits((prev) => (prev.includes(habitId) ? prev.filter((id) => id !== habitId) : [...prev, habitId]))
  }

  const toggleStreakMode = () => {
    setStreakMode(!streakMode)
  }

  const toggleViewType = () => {
    setViewType(viewType === "monthly" ? "weekly" : "monthly")
  }

  // Filter habits based on selection
  const filteredHabits = habits.filter((habit) => selectedHabits.includes(habit.id))

  return (
    <div className="space-y-4">
      <StreakInfo habits={filteredHabits} />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap gap-2">
        <CalendarHeader
          year={year}
          month={month}
          day={day}
          viewType={viewType}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
        />

        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
          <Button variant="outline" size="sm" onClick={toggleViewType} className="h-8">
            {viewType === "monthly" ? (
              <>
                <Rows className="h-4 w-4 mr-2" />
                Weekly View
              </>
            ) : (
              <>
                <CalendarDays className="h-4 w-4 mr-2" />
                Monthly View
              </>
            )}
          </Button>

          <Button variant={streakMode ? "default" : "outline"} size="sm" onClick={toggleStreakMode} className="h-8">
            <FlameIcon className="h-4 w-4 mr-2" />
            {streakMode ? "Streaks: ON" : "Streaks: OFF"}
          </Button>

          <HabitFilter
            habits={habits}
            selectedHabits={selectedHabits}
            onSelectAll={handleSelectAll}
            onSelectNone={handleSelectNone}
            onToggleHabit={handleToggleHabit}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {viewType === "monthly" ? (
          <CalendarGrid year={year} month={month} habits={filteredHabits} streakMode={streakMode} />
        ) : (
          <WeeklyView year={year} month={month} day={day} habits={filteredHabits} streakMode={streakMode} />
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 rounded-sm mr-1"></div>
            <span>100% Complete</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-50 rounded-sm mr-1"></div>
            <span>50-99% Complete</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-50 rounded-sm mr-1"></div>
            <span>1-49% Complete</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-black-50 rounded-sm mr-1"></div>
            <span>Today</span>
          </div>
          {streakMode && (
            <div className="flex items-center">
              <div className="border-2 border-orange-300 w-3 h-3 rounded-sm mr-1"></div>
              <span>Active Streak</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
