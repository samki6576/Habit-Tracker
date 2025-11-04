import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define your Event type (adjust fields as needed)
export interface Event {
  id: string;
  title: string;
  start: string; // ISO string
  end: string;   // ISO string
  color?: string;
}

interface CalendarContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  removeEvent: (id: string) => void;
  updateEvent: (event: Event) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);

  // Example: Load events from localStorage or backend here
  useEffect(() => {
    // Optionally fetch from backend or localStorage
    // setEvents(fetchedEvents);
  }, []);

  const addEvent = (event: Event) => setEvents(prev => [...prev, event]);
  const removeEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));
  const updateEvent = (event: Event) =>
    setEvents(prev => prev.map(e => (e.id === event.id ? event : e)));

  return (
    <CalendarContext.Provider value={{ events, addEvent, removeEvent, updateEvent }}>
      {children}
    </CalendarContext.Provider>
  );
};

export function useCalendar() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("useCalendar must be used within a CalendarProvider");
  return ctx;
}