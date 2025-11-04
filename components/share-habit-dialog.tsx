"use client"

import { useState } from "react"
import { Check, Copy, Loader2, Mail, Share2 } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { createShareableLink, sendHabitInvitation, shareHabit } from "@/lib/sharing-service"
import type { Habit } from "@/lib/types"

interface ShareHabitDialogProps {
  habit: Habit
}

export function ShareHabitDialog({ habit }: ShareHabitDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [shareCode, setShareCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState("")
  const [inviteSent, setInviteSent] = useState(false)
  const { toast } = useToast()


  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)

      toast({
        title: "Copied to clipboard",
        description: "Share link copied to clipboard",
      })

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const sendInvitation = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const success = await sendHabitInvitation(email, shareCode, habit.title)

      if (success) {
        setInviteSent(true)

        toast({
          title: "Invitation sent",
          description: `Invitation sent to ${email}`,
        })

        setTimeout(() => setInviteSent(false), 2000)
      } else {
        throw new Error("Failed to send invitation")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invitation",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          
        </DialogHeader>

        {!shareUrl ? (
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Create a shareable link that allows others to add this habit to their tracker.
            </p>
          
          </div>
        ) : (
          <Tabs defaultValue="link" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="link">Share Link</TabsTrigger>
              <TabsTrigger value="email">Email Invite</TabsTrigger>
            </TabsList>

            <TabsContent value="link" className="py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="share-url">Share URL</Label>
                  <div className="flex">
                    <Input id="share-url" value={shareUrl} readOnly className="rounded-r-none" />
                    <Button type="button" variant="secondary" className="rounded-l-none" onClick={copyToClipboard}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="share-code">Share Code</Label>
                  <div className="flex items-center space-x-2">
                    <Input id="share-code" value={shareCode} readOnly className="font-mono text-center text-lg" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Share this code with friends. They can enter it on the "Add Habit" page.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="email" className="py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="friend-email">Friend's Email</Label>
                  <Input
                    id="friend-email"
                    type="email"
                    placeholder="friend@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button onClick={sendInvitation} disabled={loading || !email} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : inviteSent ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Sent!
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Invitation
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground">
                  Note: In this demo, emails aren't actually sent. This is a UI demonstration.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
