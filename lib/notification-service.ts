import { doc, updateDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import type { Habit, Reminder } from "@/lib/types"
import { formatDate } from "@/lib/utils"

// Check if notifications are supported
export function areNotificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!areNotificationsSupported()) {
    return "denied"
  }

  try {
    const permission = await Notification.requestPermission()
    return permission
  } catch (error) {
    console.error("Error requesting notification permission:", error)
    return "denied"
  }
}

// Get current notification permission
export function getNotificationPermission(): NotificationPermission {
  if (!areNotificationsSupported()) {
    return "denied"
  }
  return Notification.permission
}

// Save reminder settings for a habit
export async function saveReminderSettings(habitId: string, reminder: Reminder | null): Promise<boolean> {
  if (!auth?.currentUser || !db) {
    // In demo mode, update the habit in memory
    if (habitId.startsWith("demo-") && typeof window !== 'undefined') {
      const demoHabits = window.localStorage.getItem("demoHabits")
      if (demoHabits) {
        const habits = JSON.parse(demoHabits)
        const habitIndex = habits.findIndex((h: Habit) => h.id === habitId)
        if (habitIndex !== -1) {
          habits[habitIndex].reminder = reminder
          window.localStorage.setItem("demoHabits", JSON.stringify(habits))
          return true
        }
      }
    }
    return false
  }

  try {
    const habitRef = doc(db, "habits", habitId)
    await updateDoc(habitRef, { reminder: reminder || null })
    return true
  } catch (error) {
    console.error("Error saving reminder settings:", error)
    return false
  }
}

// Check if a reminder should be sent now
export function shouldSendReminder(reminder: Reminder): boolean {
  if (!reminder.enabled) return false

  const now = new Date()
  const currentDay = now.getDay()

  // Check if today is in the reminder days
  if (!reminder.days.includes(currentDay)) return false

  // Parse reminder time
  const [reminderHours, reminderMinutes] = reminder.time.split(":").map(Number)

  // Get current time
  const currentHours = now.getHours()
  const currentMinutes = now.getMinutes()

  // Check if it's time to send the reminder (within a 5-minute window)
  if (currentHours === reminderHours && Math.abs(currentMinutes - reminderMinutes) <= 5) {
    // Check if we've already notified today
    if (reminder.lastNotified) {
      const lastNotifiedDate = new Date(reminder.lastNotified)
      if (formatDate(lastNotifiedDate) === formatDate(now)) {
        return false
      }
    }
    return true
  }

  return false
}

// Send a notification for a habit
export function sendNotification(habit: Habit): boolean {
  if (!areNotificationsSupported() || Notification.permission !== "granted") {
    return false
  }

  try {
    const notification = new Notification(`Reminder: ${habit.title}`, {
      body: habit.description || "Time to complete your habit!",
      icon: "/favicon.ico",
      badge: "/favicon.ico",
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    // Update the lastNotified timestamp
    if (habit.reminder) {
      habit.reminder.lastNotified = new Date().toISOString()
      saveReminderSettings(habit.id, habit.reminder)
    }

    return true
  } catch (error) {
    console.error("Error sending notification:", error)
    return false
  }
}

// Check all habits and send notifications if needed
export async function checkAndSendNotifications(habits: Habit[]): Promise<void> {
  if (!areNotificationsSupported() || Notification.permission !== "granted") {
    return
  }

  const today = formatDate(new Date())

  habits.forEach((habit) => {
    if (habit.reminder && shouldSendReminder(habit.reminder)) {
      // Don't send notification if habit is already completed today
      if (habit.doneDates.includes(today)) return

      sendNotification(habit)
    }
  })
}

// Format time string (HH:MM) to AM/PM format
export function formatTimeForDisplay(time: string): string {
  const [hours, minutes] = time.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
}

// Get day name from day number
export function getDayName(day: number): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[day]
}

// Get short day name from day number
export function getShortDayName(day: number): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return days[day]
}
