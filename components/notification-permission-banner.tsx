"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  areNotificationsSupported,
  getNotificationPermission,
  requestNotificationPermission,
} from "@/lib/notification-service"
import type { NotificationPermission } from "@/lib/types"

export function NotificationPermissionBanner() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only show the banner if notifications are supported
    if (areNotificationsSupported()) {
      const currentPermission = getNotificationPermission()
      setPermission(currentPermission)

      // Only show the banner if permission is not granted or denied
      setVisible(currentPermission === "default")
    }
  }, [])

  const handleRequestPermission = async () => {
    const newPermission = await requestNotificationPermission()
    setPermission(newPermission)

    if (newPermission !== "default") {
      setVisible(false)
    }
  }

  if (!visible) {
    return null
  }

  return (
    <Alert className="mb-6 bg-blue-50 border-blue-200">
      <Bell className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-800">Enable Notifications</AlertTitle>
      <AlertDescription className="text-blue-700 flex flex-col sm:flex-row sm:items-center gap-2">
        <span>Allow notifications to get reminders for your habits</span>
        <Button size="sm" onClick={handleRequestPermission} className="sm:ml-auto">
          Enable Notifications
        </Button>
      </AlertDescription>
    </Alert>
  )
}
