"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, MessageSquare, Users, ArrowUpRight } from "lucide-react"

export function BotPerformanceCards() {
  // These would typically come from an API in a real application
  const stats = [
    {
      title: "Aktif Botlar",
      value: "24",
      change: "+3",
      icon: <Users className="h-5 w-5 text-white" />,
      color: "from-emerald-500 to-teal-400",
    },
    {
      title: "Başlatılan Konuşmalar",
      value: "1,248",
      change: "+18%",
      icon: <MessageSquare className="h-5 w-5 text-white" />,
      color: "from-blue-500 to-indigo-400",
    },
    {
      title: "Yükseltilen Konuşmalar",
      value: "187",
      change: "+12%",
      icon: <ArrowUpRight className="h-5 w-5 text-white" />,
      color: "from-pink-500 to-rose-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-none shadow-md">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className={`bg-gradient-to-r ${stat.color} p-4 flex items-center justify-center rounded-l-lg`}>
                {stat.icon}
              </div>
              <div className="p-4 flex-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center text-xs font-medium text-green-500">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
