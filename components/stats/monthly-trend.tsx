import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MonthlyTrendProps {
  data: { month: string; completionRate: number }[]
}

export function MonthlyTrend({ data }: MonthlyTrendProps) {
  // Find the maximum value for scaling
  const maxRate = Math.max(...data.map((item) => item.completionRate), 100)

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">Monthly Trend</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Your habit completion over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48 sm:h-64 flex items-end space-x-1 sm:space-x-2 overflow-x-auto px-1 sm:px-0">
          {data.map((item) => {
            // Calculate bar height as percentage of max (minimum 5% for visibility)
            const heightPercentage = Math.max(5, (item.completionRate / maxRate) * 100)

            return (
              <div key={item.month} className="flex-1 flex flex-col items-center">
                <div className="w-full flex justify-center h-[90%] items-end">
                  <div
                    className="w-4/5 bg-teal-500 rounded-t-sm transition-all duration-300"
                    style={{ height: `${heightPercentage}%` }}
                    title={`${item.completionRate}% completion in ${item.month}`}
                  />
                </div>
                <div className="mt-1 sm:mt-2 text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                  {item.month}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
