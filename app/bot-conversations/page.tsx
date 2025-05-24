"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { mockApi } from "@/services/api-mock"
import { Loader2, MessageSquare } from "lucide-react"

interface BotStats {
  id: string
  name: string
  avatar: string
  activeConversations: number
  totalMessages: number
}

export default function BotConversationsPage() {
  const router = useRouter()
  const [bots, setBots] = useState<BotStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBots = async () => {
      try {
        setLoading(true)
        // Fetch bots
        const botsResponse = await mockApi.bots.getAll()
        const botsData = botsResponse.data

        // Fetch conversations for each bot
        const conversationsResponse = await mockApi.conversations.getAll()
        const conversations = conversationsResponse.data

        // Calculate stats for each bot
        const botsWithStats = botsData.map((bot) => {
          const botConversations = conversations.filter((conv) => conv.botId === bot.id)
          const activeConversations = botConversations.filter((conv) => conv.status === "active").length
          const totalMessages = botConversations.reduce((sum, conv) => sum + conv.messageCount, 0)

          return {
            id: bot.id,
            name: bot.name,
            avatar: bot.avatar,
            activeConversations,
            totalMessages,
          }
        })

        setBots(botsWithStats)
      } catch (err) {
        console.error("Error fetching bots:", err)
        setError("Botlar yüklenirken bir hata oluştu.")
      } finally {
        setLoading(false)
      }
    }

    fetchBots()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Botlar yükleniyor...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-primary">
            Yeniden Dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Bot Konuşmaları</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((bot) => (
          <Card
            key={bot.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/bot-conversations/${bot.id}`)}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={bot.avatar} alt={bot.name} />
                <AvatarFallback>{bot.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-xl">{bot.name}</CardTitle>
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
        ))}
      </div>
    </div>
  )
} 