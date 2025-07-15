import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface WeeklyHeatmapProps {
  data: { day: string; count: number; total: number }[]
}

export function WeeklyHeatmap({ data }: WeeklyHeatmapProps) {
  // Abbreviate day names
  const dayAbbreviations: Record<string, string> = {
    Sunday: "Sun",
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Weekly Pattern</CardTitle>
        <CardDescription>Which days you're most consistent</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end h-32 overflow-x-auto sm:overflow-x-visible px-1 sm:px-0">
          {data.map((item) => {
            // Calculate completion percentage
            const percentage = item.total > 0 ? (item.count / item.total) * 100 : 0

            // Determine color intensity based on percentage
            let bgColor = "bg-gray-100"
            if (percentage > 0) {
              if (percentage < 25) bgColor = "bg-teal-100"
              else if (percentage < 50) bgColor = "bg-teal-200"
              else if (percentage < 75) bgColor = "bg-teal-300"
              else bgColor = "bg-teal-500"
            }

            // Calculate bar height (min 10%, max 100%)
            const height = Math.max(10, Math.min(100, percentage))

            return (
              <div key={item.day} className="flex flex-col items-center w-full">
                <div className="w-full flex justify-center mb-1">
                  <div
                    className={`w-5/6 ${bgColor} rounded-sm`}
                    style={{ height: `${height}%` }}
                    title={`${Math.round(percentage)}% completion on ${item.day}s`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{dayAbbreviations[item.day]}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
