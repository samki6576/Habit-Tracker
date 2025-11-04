"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
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
import { getSharedHabitByCode, importSharedHabit } from "@/lib/sharing-service"

interface ImportHabitDialogProps {
  onImport?: () => void
  shareCode?: string
}

export function ImportHabitDialog({ onImport, shareCode: initialShareCode }: ImportHabitDialogProps) {
  const [open, setOpen] = useState(!!initialShareCode)
  const [loading, setLoading] = useState(false)
  const [shareCode, setShareCode] = useState(initialShareCode || "")
  const { toast } = useToast()
  const router = useRouter()

  const handleImport = async () => {
    if (!shareCode) {
      toast({
        title: "Share code required",
        description: "Please enter a share code",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Get the shared habit
      const sharedHabit = await getSharedHabitByCode(shareCode)

      if (!sharedHabit) {
        throw new Error("Invalid or expired share code")
      }

      if (sharedHabit.claimed) {
        throw new Error("This habit has already been claimed")
      }

      // Import the habit
      const habit = await importSharedHabit(sharedHabit)

      if (habit) {
        toast({
          title: "Habit imported",
          description: `"${habit.title}" has been added to your habits`,
        })

        setOpen(false)
        setShareCode("")

        // Refresh the page or update the habit list
        if (onImport) {
          onImport()
        } else {
          router.push("/dashboard")
          router.refresh()
        }
      } else {
        throw new Error("Failed to import habit")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import habit",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Import Habit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Habit</DialogTitle>
          <DialogDescription>Enter a share code to import a habit</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="share-code">Share Code</Label>
              <Input
                id="share-code"
                placeholder="Enter share code (e.g., ABC12345)"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                className="font-mono text-center text-lg"
                maxLength={8}
              />
            </div>

            <Button onClick={handleImport} disabled={loading || !shareCode} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                "Import Habit"
              )}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
