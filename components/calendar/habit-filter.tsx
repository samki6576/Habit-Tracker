"use client"

import { Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Habit } from "@/lib/types"

interface HabitFilterProps {
  habits: Habit[]
  selectedHabits: string[]
  onSelectAll: () => void
  onSelectNone: () => void
  onToggleHabit: (habitId: string) => void
}

export function HabitFilter({ habits, selectedHabits, onSelectAll, onSelectNone, onToggleHabit }: HabitFilterProps) {
  const allSelected = selectedHabits.length === habits.length
  const someSelected = selectedHabits.length > 0 && selectedHabits.length < habits.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Filter className="h-4 w-4 mr-2" />
          Filter Habits
          {selectedHabits.length > 0 && selectedHabits.length < habits.length && (
            <span className="ml-1 text-xs bg-blue-100 text-blue-700 rounded-full px-1.5">{selectedHabits.length}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filter Habits</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="max-h-[300px] overflow-y-auto">
          {habits.map((habit) => (
            <DropdownMenuCheckboxItem
              key={habit.id}
              checked={selectedHabits.includes(habit.id)}
              onCheckedChange={() => onToggleHabit(habit.id)}
            >
              {habit.title}
            </DropdownMenuCheckboxItem>
          ))}
        </div>

        {habits.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2 flex justify-between">
              <Button variant="outline" size="sm" className="text-xs h-7" onClick={onSelectAll} disabled={allSelected}>
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={onSelectNone}
                disabled={selectedHabits.length === 0}
              >
                Clear All
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
