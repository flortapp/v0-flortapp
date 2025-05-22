import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"

interface BotStatisticsProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  description: string
}

export function BotStatistics({ title, value, change, trend, description }: BotStatisticsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-1.5">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{value}</span>
            <div
              className={`flex items-center text-xs font-medium ${trend === "up" ? "text-green-500" : "text-red-500"}`}
            >
              {trend === "up" ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
              {change}
            </div>
          </div>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}
