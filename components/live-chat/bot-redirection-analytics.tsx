"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface BotRedirectionStats {
  botName: string
  redirectionsIn: number
  redirectionsOut: number
  successRate: number
}

export function BotRedirectionAnalytics() {
  const [stats, setStats] = useState<BotRedirectionStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    const fetchRedirectionStats = async () => {
      setIsLoading(true)

      try {
        // Mock data
        const mockData: BotRedirectionStats[] = [
          {
            botName: "Support Bot",
            redirectionsIn: 24,
            redirectionsOut: 45,
            successRate: 92,
          },
          {
            botName: "Sales Bot",
            redirectionsIn: 36,
            redirectionsOut: 18,
            successRate: 88,
          },
          {
            botName: "Technical Bot",
            redirectionsIn: 42,
            redirectionsOut: 12,
            successRate: 95,
          },
          {
            botName: "Billing Bot",
            redirectionsIn: 15,
            redirectionsOut: 30,
            successRate: 90,
          },
        ]

        setStats(mockData)
      } catch (error) {
        console.error("Failed to fetch redirection stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRedirectionStats()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bot Yönlendirme Analizi</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <ChartContainer
            config={{
              redirectionsIn: {
                label: "Gelen Yönlendirmeler",
                color: "hsl(var(--chart-1))",
              },
              redirectionsOut: {
                label: "Giden Yönlendirmeler",
                color: "hsl(var(--chart-2))",
              },
              successRate: {
                label: "Başarı Oranı (%)",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="botName" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="redirectionsIn"
                  name="Gelen Yönlendirmeler"
                  fill="var(--color-redirectionsIn)"
                />
                <Bar
                  yAxisId="left"
                  dataKey="redirectionsOut"
                  name="Giden Yönlendirmeler"
                  fill="var(--color-redirectionsOut)"
                />
                <Bar yAxisId="right" dataKey="successRate" name="Başarı Oranı (%)" fill="var(--color-successRate)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
