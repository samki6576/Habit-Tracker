"use client"

import { useState } from "react"
import { Bell, BellOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  areNotificationsSupported,
  getNotificationPermission,
  requestNotificationPermission,
  saveReminderSettings,
} from "@/lib/notification-service"
import type { Habit, Reminder } from "@/lib/types"

interface ReminderSettingsProps {
  habit: Habit
  onUpdate: () => void
}

export function ReminderSettings({ habit, onUpdate }: ReminderSettingsProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reminder, setReminder] = useState<Reminder>(
    habit.reminder || {
      enabled: false,
      time: "09:00",
      days: [1, 2, 3, 4, 5], // Monday to Friday by default
    },
  )
  const { toast } = useToast()

  const notificationsSupported = areNotificationsSupported()
  const notificationPermission = getNotificationPermission()

  const handleSave = async () => {
    setLoading(true)

    try {
      // If enabling reminders, request permission if not already granted
      if (reminder.enabled && notificationPermission === "default") {
        const permission = await requestNotificationPermission()
        if (permission !== "granted") {
          toast({
            title: "Permission Denied",
            description: "You need to allow notifications to enable reminders.",
            variant: "destructive",
          })
          setReminder((prev) => ({ ...prev, enabled: false }))
          return
        }
      }

      const success = await saveReminderSettings(habit.id, reminder.enabled ? reminder : null)

      if (success) {
        toast({
          title: reminder.enabled ? "Reminder Set" : "Reminder Disabled",
          description: reminder.enabled
            ? "You'll be notified at the scheduled time"
            : "Notifications have been turned off for this habit",
        })
        setOpen(false)
        onUpdate()
      } else {
        throw new Error("Failed to save reminder settings")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save reminder settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleDay = (day: number) => {
    setReminder((prev) => {
      const newDays = prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day]
      return { ...prev, days: newDays }
    })
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          {habit.reminder?.enabled ? (
            <>
              <Bell className="h-4 w-4 mr-2" />
              Reminder On
            </>
          ) : (
            <>
              <BellOff className="h-4 w-4 mr-2" />
              Set Reminder
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reminder Settings</DialogTitle>
          <DialogDescription>Set up reminders for "{habit.title}"</DialogDescription>
        </DialogHeader>

        {!notificationsSupported && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
            <p className="text-amber-800 text-sm">
              Notifications are not supported in your browser. Please use a modern browser to enable reminders.
            </p>
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable-reminder"
              checked={reminder.enabled}
              onCheckedChange={(checked) => setReminder((prev) => ({ ...prev, enabled: !!checked }))}
              disabled={!notificationsSupported || loading}
            />
            <Label htmlFor="enable-reminder">Enable daily reminder</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-time">Reminder time</Label>
            <Input
              id="reminder-time"
              type="time"
              value={reminder.time}
              onChange={(e) => setReminder((prev) => ({ ...prev, time: e.target.value }))}
              disabled={!reminder.enabled || loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Repeat on</Label>
            <div className="flex flex-wrap gap-2">
              {dayNames.map((day, index) => (
                <Button
                  key={day}
                  type="button"
                  variant={reminder.days.includes(index) ? "default" : "outline"}
                  className="h-9 w-9 p-0"
                  onClick={() => toggleDay(index)}
                  disabled={!reminder.enabled || loading}
                >
                  {day.charAt(0)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
