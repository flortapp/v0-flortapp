"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Search, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DateRangePicker } from "@/components/ui/date-range-picker"

interface ResolvedConversationsTabProps {
  botId: string
}

export function ResolvedConversationsTab({ botId }: ResolvedConversationsTabProps) {
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  useEffect(() => {
    // Simulate fetching conversation data
    const fetchConversations = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        setConversations([
          {
            id: "conv-4",
            userId: "user-4",
            userName: "Ali Yıldız",
            userAvatar: "/male-avatar.png",
            lastMessage: "Teşekkürler, yardımcı oldunuz!",
            lastMessageTime: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
            messageCount: 18,
            status: "resolved",
            resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
          },
          {
            id: "conv-5",
            userId: "user-5",
            userName: "Ayşe Demir",
            userAvatar: "/female-avatar.png",
            lastMessage: "Anladım, teşekkür ederim.",
            lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(),
            messageCount: 12,
            status: "resolved",
            resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(),
          },
          {
            id: "conv-6",
            userId: "user-6",
            userName: "Mustafa Kara",
            userAvatar: "/male-avatar.png",
            lastMessage: "Görüşmek üzere!",
            lastMessageTime: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(),
            messageCount: 9,
            status: "resolved",
            resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(),
          },
        ])
      } catch (error) {
        console.error("Error fetching conversations:", error)
      } finally {
        setLoading(false)
      }
    }

    if (botId) {
      fetchConversations()
    }
  }, [botId])

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const filteredConversations = conversations.filter((conv) => {
    // Filter by search query
    const matchesSearch =
      conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by date range
    let matchesDateRange = true
    if (dateRange.from && dateRange.to) {
      const convDate = new Date(conv.resolvedAt)
      matchesDateRange = convDate >= dateRange.from && convDate <= dateRange.to
    }

    return matchesSearch && matchesDateRange
  })

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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Çözülmüş Konuşmalar</CardTitle>
          <CardDescription>Botun tamamlanmış konuşmaları</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Konuşma ara..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <DateRangePicker date={dateRange} setDate={setDateRange} />
            </div>
          </div>

          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>Çözülmüş konuşma bulunamadı</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={conv.userAvatar || "/placeholder.svg"} alt={conv.userName} />
                      <AvatarFallback>{conv.userName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{conv.userName}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">{conv.lastMessage}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-xs text-muted-foreground">{formatDate(conv.resolvedAt)}</div>
                    <Badge variant="secondary" className="text-xs">
                      {conv.messageCount} mesaj
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
