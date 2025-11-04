import { Trophy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Habit } from "@/lib/types"
import { calculateCompletionRate } from "@/lib/stats-utils"

interface TopHabitCardProps {
  habit: Habit | null
}

export function TopHabitCard({ habit }: TopHabitCardProps) {
  if (!habit) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Top Habit</CardTitle>
          <CardDescription>Your most consistent habit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-20 text-muted-foreground">No habits tracked yet</div>
        </CardContent>
      </Card>
    )
  }

  const completionRate = calculateCompletionRate(habit)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">Top Habit</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Your most consistent habit</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="mr-2 sm:mr-4 bg-yellow-100 p-2 rounded-full">
            <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-medium text-sm sm:text-base">{habit.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{Math.round(completionRate)}% completion rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
