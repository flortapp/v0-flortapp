"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, TrendingUp, MessageSquare, Clock } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker"

interface BotPerformanceTabProps {
  botId: string
}

export function BotPerformanceTab({ botId }: BotPerformanceTabProps) {
  const [loading, setLoading] = useState(true)
  const [performanceData, setPerformanceData] = useState<any>(null)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })

  useEffect(() => {
    // Simulate fetching performance data
    const fetchPerformanceData = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        setPerformanceData({
          totalConversations: 124,
          activeConversations: 3,
          resolvedConversations: 121,
          totalMessages: 1872,
          averageMessagesPerConversation: 15.1,
          averageResponseTime: "45 saniye",
          userSatisfactionRate: 92,
          topUserInteractions: [
            { userId: "user-1", userName: "Ahmet Yılmaz", conversationCount: 12 },
            { userId: "user-5", userName: "Ayşe Demir", conversationCount: 8 },
            { userId: "user-3", userName: "Zeynep Kaya", conversationCount: 7 },
          ],
          dailyStats: [
            { date: "2023-05-01", conversations: 18, messages: 267 },
            { date: "2023-05-02", conversations: 15, messages: 223 },
            { date: "2023-05-03", conversations: 21, messages: 312 },
            { date: "2023-05-04", conversations: 17, messages: 254 },
            { date: "2023-05-05", conversations: 19, messages: 285 },
            { date: "2023-05-06", conversations: 14, messages: 208 },
            { date: "2023-05-07", conversations: 20, messages: 323 },
          ],
        })
      } catch (error) {
        console.error("Error fetching performance data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (botId) {
      fetchPerformanceData()
    }
  }, [botId, dateRange])

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <DateRangePicker date={dateRange} setDate={setDateRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Konuşma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{performanceData.totalConversations}</div>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Mesaj</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{performanceData.totalMessages}</div>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ortalama Mesaj/Konuşma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{performanceData.averageMessagesPerConversation}</div>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ortalama Yanıt Süresi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{performanceData.averageResponseTime}</div>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kullanıcı Memnuniyeti</CardTitle>
            <CardDescription>Kullanıcı geri bildirimlerine dayalı memnuniyet oranı</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="relative h-40 w-40">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">{performanceData.userSatisfactionRate}%</span>
              </div>
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                  className="text-muted stroke-current"
                  strokeWidth="10"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-pink-500 stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${performanceData.userSatisfactionRate * 2.51} 251`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>En Çok Etkileşimde Bulunan Kullanıcılar</CardTitle>
            <CardDescription>Bot ile en çok konuşan kullanıcılar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.topUserInteractions.map((user: any, index: number) => (
                <div key={user.userId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">{index + 1}</div>
                    <div>{user.userName}</div>
                  </div>
                  <div className="font-medium">{user.conversationCount} konuşma</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Günlük İstatistikler</CardTitle>
          <CardDescription>Son 7 günün konuşma ve mesaj istatistikleri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            {/* In a real app, this would be a chart component */}
            <div className="flex h-full items-end gap-2">
              {performanceData.dailyStats.map((day: any) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-pink-500 rounded-t"
                    style={{ height: `${(day.conversations / 25) * 100}%` }}
                  ></div>
                  <div className="text-xs mt-2 text-muted-foreground">
                    {new Date(day.date).toLocaleDateString("tr-TR", { weekday: "short" })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
