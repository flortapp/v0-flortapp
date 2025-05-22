"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Clock, ArrowRight } from "lucide-react"

interface RedirectionRecord {
  id: string
  timestamp: Date
  userId: string
  userName: string
  sourceBotId: string
  sourceBotName: string
  targetBotId: string
  targetBotName: string
  status: "success" | "failed"
  duration: number // in seconds
}

interface RedirectionHistoryProps {
  userId?: string
  limit?: number
}

export function RedirectionHistory({ userId, limit = 5 }: RedirectionHistoryProps) {
  const [redirections, setRedirections] = useState<RedirectionRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    const fetchRedirectionHistory = async () => {
      setIsLoading(true)

      try {
        // Mock data
        const mockData: RedirectionRecord[] = [
          {
            id: "1",
            timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
            userId: "123",
            userName: "John Doe",
            sourceBotId: "bot1",
            sourceBotName: "Support Bot",
            targetBotId: "bot2",
            targetBotName: "Sales Bot",
            status: "success",
            duration: 3,
          },
          {
            id: "2",
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
            userId: "123",
            userName: "John Doe",
            sourceBotId: "bot2",
            sourceBotName: "Sales Bot",
            targetBotId: "bot3",
            targetBotName: "Technical Bot",
            status: "failed",
            duration: 5,
          },
          {
            id: "3",
            timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
            userId: "456",
            userName: "Jane Smith",
            sourceBotId: "bot1",
            sourceBotName: "Support Bot",
            targetBotId: "bot3",
            targetBotName: "Technical Bot",
            status: "success",
            duration: 2,
          },
        ]

        // Filter by userId if provided
        const filteredData = userId ? mockData.filter((record) => record.userId === userId) : mockData

        // Limit the number of records
        const limitedData = filteredData.slice(0, limit)

        setRedirections(limitedData)
      } catch (error) {
        console.error("Failed to fetch redirection history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRedirectionHistory()
  }, [userId, limit])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Bot Yönlendirme Geçmişi
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        ) : redirections.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Yönlendirme geçmişi bulunamadı.</p>
        ) : (
          <div className="space-y-3">
            {redirections.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{record.userName}</span>
                    <span className="text-xs text-gray-500">{formatTime(record.timestamp)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                    <Bot className="h-3 w-3 text-blue-500" />
                    <span className="text-xs">{record.sourceBotName}</span>
                  </div>

                  <ArrowRight className="h-4 w-4 text-gray-400" />

                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                    <Bot className="h-3 w-3 text-green-500" />
                    <span className="text-xs">{record.targetBotName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={record.status === "success" ? "success" : "destructive"}>
                    {record.status === "success" ? "Başarılı" : "Başarısız"}
                  </Badge>
                  <span className="text-xs text-gray-500">{record.duration}s</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
