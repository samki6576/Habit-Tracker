"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { format, startOfWeek, addDays } from "date-fns"
import type { Event } from "./event"
import type { Habit } from "@/lib/types"

interface WeeklyViewProps {
  year: number
  month: number
  day: number
  habits: Habit[]
  streakMode: boolean
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ year, month, day, habits, streakMode }) => {
  const selectedDate = new Date(year, month, day)
  const [week, setWeek] = useState<Date[]>([])

  useEffect(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 })
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(start, i))
    setWeek(weekDays)
  }, [selectedDate])

  const getEventsForDay = (day: Date): Event[] => {
    // For now, return empty array since we're not using events
    // This can be enhanced later to show habit completion data
    return []
  }

  return (
    <div className="weekly-view">
      <div className="days-header">
        {week.map((day) => (
          <div key={day.toISOString()} className="day-header">
            {format(day, "EEE dd")}
          </div>
        ))}
      </div>
      <div className="days-container">
        {week.map((day) => (
          <div key={day.toISOString()} className="day-column">
            {getEventsForDay(day).map((event) => (
              <div
                key={event.id}
                className="event"
                style={{
                  backgroundColor: event.color,
                  color: "white",
                  padding: "5px",
                  margin: "2px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {event.title}
              </div>
            ))}
          </div>
        ))}
      </div>
      <style jsx>{`
        .weekly-view {
          display: flex;
          flex-direction: column;
          height: 400px;
          border: 1px solid #ccc;
        }

        .days-header {
          display: flex;
          justify-content: space-around;
          padding: 10px;
          border-bottom: 1px solid #ccc;
        }

        .day-header {
          text-align: center;
          flex: 1;
        }

        .days-container {
          display: flex;
          flex: 1;
        }

        .day-column {
          flex: 1;
          padding: 5px;
          overflow-y: auto;
          border-right: 1px solid #eee;
        }

        .day-column:last-child {
          border-right: none;
        }

        .event {
          background-color: #3498db;
          color: white;
          padding: 5px;
          margin: 2px;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

export default WeeklyView
