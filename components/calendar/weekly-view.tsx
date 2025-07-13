"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { format, startOfWeek, addDays, isWithinInterval, parseISO } from "date-fns"
import { useCalendar } from "./CalenderContext";
import type { Event } from "./event"

interface WeeklyViewProps {
  onEventClick: (event: Event) => void
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ onEventClick }) => {
  const { selectedDate, events } = useCalendar()
  const [week, setWeek] = useState<Date[]>([])

  useEffect(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 })
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(start, i))
    setWeek(weekDays)
  }, [selectedDate])

  const getEventsForDay = (day: Date): Event[] => {
    return events.filter((event: Event) => {
      const eventStart: Date = parseISO(event.start)
      const eventEnd: Date = parseISO(event.end)
      return isWithinInterval(day, { start: eventStart, end: eventEnd })
    })
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
                onClick={() => onEventClick(event)}
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
