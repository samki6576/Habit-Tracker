import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface CompletionRateCardProps {
  title: string
  rate: number
  description?: string
}

export function CompletionRateCard({ title, rate, description }: CompletionRateCardProps) {
  // Round to nearest integer
  const roundedRate = Math.round(rate)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">{roundedRate}%</span>
          <span className="text-sm text-muted-foreground">Last 30 days</span>
        </div>
        <Progress value={roundedRate} className="h-2" />
      </CardContent>
    </Card>
  )
}
