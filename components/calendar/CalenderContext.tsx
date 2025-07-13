import { createContext, useContext } from "react";

export const CalendarContext = createContext<any>(null);

export function useCalendar() {
  return useContext(CalendarContext);
}