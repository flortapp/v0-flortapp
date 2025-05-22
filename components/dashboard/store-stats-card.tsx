import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react"
import { FaApple, FaAndroid } from "react-icons/fa"

interface StoreStatsCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: "apple" | "android" | "dollar"
}

export function StoreStatsCard({ title, value, change, trend, icon }: StoreStatsCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "apple":
        return <FaApple className="h-5 w-5" />
      case "android":
        return <FaAndroid className="h-5 w-5" />
      case "dollar":
        return <DollarSign className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-primary/10 p-2 text-primary">{getIcon()}</div>
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{value}</span>
            <div
              className={`flex items-center text-xs font-medium ${trend === "up" ? "text-green-500" : "text-red-500"}`}
            >
              {trend === "up" ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
              {change}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
