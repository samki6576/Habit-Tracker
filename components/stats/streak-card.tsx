import { Award, Flame } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StreakCardProps {
  currentStreak: number
  longestStreak: number
  title?: string
}

export function StreakCard({ currentStreak, longestStreak, title = "Streak" }: StreakCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-1">
              <Flame className="h-4 w-4 mr-1 text-orange-500" />
              <span className="text-xs sm:text-sm text-muted-foreground">Current</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold">{currentStreak}</span>
            <span className="text-xs text-muted-foreground">days</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center mb-1">
              <Award className="h-4 w-4 mr-1 text-yellow-500" />
              <span className="text-xs sm:text-sm text-muted-foreground">Best</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold">{longestStreak}</span>
            <span className="text-xs text-muted-foreground">days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
