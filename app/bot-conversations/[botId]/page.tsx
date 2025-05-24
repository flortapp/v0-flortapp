"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { BotConversationsList } from "@/components/bot-management/bot-conversations-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { mockApi } from "@/services/api-mock"
import { Loader2 } from "lucide-react"

interface BotDetails {
  id: string
  name: string
  avatar: string
  description: string
  activeConversations: number
  totalMessages: number
}

export default function BotConversationsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [bot, setBot] = useState<BotDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBotDetails = async () => {
      try {
        setLoading(true)
        // Fetch bot details
        const botResponse = await mockApi.bots.getById(params.botId as string)
        const botData = botResponse.data

        // Fetch conversations for this bot
        const conversationsResponse = await mockApi.conversations.getAll()
        const conversations = conversationsResponse.data.filter((conv) => conv.botId === params.botId)

        // Calculate stats
        const activeConversations = conversations.filter((conv) => conv.status === "active").length
        const totalMessages = conversations.reduce((sum, conv) => sum + conv.messageCount, 0)

        setBot({
          id: botData.id,
          name: botData.name,
          avatar: botData.avatar,
          description: botData.description,
          activeConversations,
          totalMessages,
        })
      } catch (err) {
        console.error("Error fetching bot details:", err)
        setError("Bot detayları yüklenirken bir hata oluştu.")
      } finally {
        setLoading(false)
      }
    }

    if (params.botId) {
      fetchBotDetails()
    }
  }, [params.botId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Bot detayları yükleniyor...</span>
      </div>
    )
  }

  if (error || !bot) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Bot bulunamadı."}</p>
          <Button onClick={() => router.push("/bot-conversations")}>Geri Dön</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.push("/bot-conversations")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Bot Konuşmaları</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={bot.avatar} alt={bot.name} />
            <AvatarFallback>{bot.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl">{bot.name}</CardTitle>
            <p className="text-muted-foreground mt-1">{bot.description}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="font-semibold">{bot.activeConversations}</span>
              </div>
              <span className="text-sm text-muted-foreground">aktif konuşma</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="font-semibold">{bot.totalMessages}</span>
              </div>
              <span className="text-sm text-muted-foreground">toplam mesaj</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <BotConversationsList botId={bot.id} />
    </div>
  )
} 