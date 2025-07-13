"use client"

import React, { useEffect, useState } from "react"
import { Bell, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { addDoc, collection } from "firebase/firestore"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./auth-provider"
import { db } from "@/lib/firebase"
import {
  areNotificationsSupported,
  getNotificationPermission,
  requestNotificationPermission,
} from "@/lib/notification-service"
import type { HabitFormData, Reminder } from "@/lib/types"

interface HabitFormProps {
  onHabitCreated?: () => void
}

export function HabitForm({ onHabitCreated }: HabitFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<HabitFormData>({
    title: "",
    description: "",
  })
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [reminderTime, setReminderTime] = useState("09:00")
  const [reminderDays, setReminderDays] = useState([1, 2, 3, 4, 5]) // Monday to Friday by default
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth() // get the current user

  const notificationsSupported = areNotificationsSupported()
  const notificationPermission = getNotificationPermission()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Habit title is required",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a habit.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // If enabling reminders, request permission if not already granted
      let reminder: Reminder | undefined = undefined
      if (reminderEnabled) {
        if (notificationPermission === "default") {
          const permission = await requestNotificationPermission()
          if (permission !== "granted") {
            toast({
              title: "Permission Denied",
              description: "You need to allow notifications to enable reminders.",
              variant: "destructive",
            })
            setReminderEnabled(false)
          }
        }
        if (notificationPermission === "granted" || !notificationsSupported) {
          reminder = {
            enabled: true,
            time: reminderTime,
            days: reminderDays,
          }
        }
      }

      // Only include reminder if it's defined
      const habitData: HabitFormData = {
        ...formData,
        ...(reminder ? { reminder } : {}),
      }

      await addDoc(collection(db, "users", user.uid, "habits"), {
        ...habitData,
        createdAt: new Date().toISOString(),
      })

      toast({
        title: "Success",
        description: "Habit created successfully",
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
      })
      setReminderEnabled(false)

      if (onHabitCreated) {
        onHabitCreated()
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create habit",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const toggleDay = (day: number) => {
    setReminderDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day)
      } else {
        return [...prev, day]
      }
    })
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl">Create a New Habit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Habit Name</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Drink Water, Read, Exercise"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Why is this habit important to you?"
              value={formData.description || ""}
              onChange={handleChange}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enable-reminder"
                checked={reminderEnabled}
                onCheckedChange={(checked) => setReminderEnabled(!!checked)}
                disabled={!notificationsSupported || isLoading}
              />
              <Label htmlFor="enable-reminder" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Set a reminder
              </Label>
            </div>

            {!notificationsSupported && reminderEnabled && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <p className="text-amber-800 text-sm">
                  Notifications are not supported in your browser. Please use a modern browser to enable reminders.
                </p>
              </div>
            )}

            {reminderEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="reminder-time">Reminder time</Label>
                  <Input
                    id="reminder-time"
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Repeat on</Label>
                  <div className="flex flex-wrap gap-2">
                    {dayNames.map((day, index) => (
                      <Button
                        key={day}
                        type="button"
                        variant={reminderDays.includes(index) ? "default" : "outline"}
                        className="h-9 w-9 p-0"
                        onClick={() => toggleDay(index)}
                        disabled={isLoading}
                      >
                        {day.charAt(0)}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Habit"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
