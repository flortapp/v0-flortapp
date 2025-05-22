"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Search, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ConversationHistoryTabProps {
  botId: string
  status: "active" | "resolved" | "all"
}

export function ConversationHistoryTab({ botId, status }: ConversationHistoryTabProps) {
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

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
            id: "conv-1",
            userId: "user-1",
            userName: "Ahmet Yılmaz",
            userAvatar: "/male-avatar.png",
            lastMessage: "Merhaba, nasılsın?",
            lastMessageTime: new Date(Date.now() - 15 * 60000).toISOString(),
            messageCount: 12,
            status: "active",
          },
          {
            id: "conv-2",
            userId: "user-2",
            userName: "Mehmet Demir",
            userAvatar: "/male-avatar.png",
            lastMessage: "Teşekkür ederim, görüşürüz!",
            lastMessageTime: new Date(Date.now() - 45 * 60000).toISOString(),
            messageCount: 8,
            status: "active",
          },
          {
            id: "conv-3",
            userId: "user-3",
            userName: "Zeynep Kaya",
            userAvatar: "/female-avatar.png",
            lastMessage: "Bu konuda daha fazla bilgi alabilir miyim?",
            lastMessageTime: new Date(Date.now() - 120 * 60000).toISOString(),
            messageCount: 15,
            status: "active",
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
  }, [botId, status])

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
          <CardTitle>Aktif Konuşmalar</CardTitle>
          <CardDescription>Botun şu anda devam eden konuşmaları</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Konuşma ara..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>Aktif konuşma bulunamadı</p>
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
                    <div className="text-xs text-muted-foreground">{formatTime(conv.lastMessageTime)}</div>
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
