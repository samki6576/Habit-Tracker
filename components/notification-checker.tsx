"use client"

import { useEffect } from "react"

import { checkAndSendNotifications } from "@/lib/notification-service"
import type { Habit } from "@/lib/types"

interface NotificationCheckerProps {
  habits: Habit[]
}

export function NotificationChecker({ habits }: NotificationCheckerProps) {
  useEffect(() => {
    // Check for notifications when the component mounts
    checkAndSendNotifications(habits)

    // Set up an interval to check for notifications every minute
    const intervalId = setInterval(() => {
      checkAndSendNotifications(habits)
    }, 60000) // 60000 ms = 1 minute

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [habits])

  // This component doesn't render anything
  return null
}
