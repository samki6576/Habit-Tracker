export interface Habit {
  id: string
  title: string
  description?: string
  createdAt: Date | string
  doneDates: string[] // Array of dates in YYYY-MM-DD format
  reminder?: Reminder
  category?: string
  sharedBy?: string // Email of the user who shared this habit
  sharedAt?: Date | string // When the habit was shared
}

export interface HabitFormData {
  title: string
  description?: string
  reminder?: Reminder
  category?: string
}

export interface Reminder {
  enabled: boolean
  time: string // 24-hour format: "HH:MM"
  days: number[] // 0-6 (Sunday-Saturday)
  lastNotified?: string // ISO date string
}

export type NotificationPermission = "default" | "granted" | "denied"

export interface SharedHabit {
  id: string
  habitId: string
  title: string
  description?: string
  category?: string
  sharedBy: string // Email of the user who shared
  sharedAt: Date | string
  shareCode: string
  expiresAt: Date | string
  claimed?: boolean
}

export interface Friend {
  id: string
  email: string
  addedAt: Date | string
}
