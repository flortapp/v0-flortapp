"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { Bot } from "@/types/bot"
import type { Conversation } from "@/types/conversation"
import { mockApi } from "@/services/api-mock"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BotMessagesTab } from "@/components/bot-management/bot-messages-tab"
import { BotSettingsTab } from "@/components/bot-management/bot-settings-tab"
import { ConversationHistoryTab } from "@/components/bot-management/conversation-history-tab"
import { BotPerformanceTab } from "@/components/bot-management/bot-performance-tab"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

export default function BotDetailPage() {
  const params = useParams()
  const botId = params.id as string

  const [bot, setBot] = useState<Bot | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBotData = async () => {
      try {
        const botData = await mockApi.bots.getById(botId)
        setBot(botData)

        const conversationsData = await mockApi.conversations.getByBotId(botId)
        setConversations(conversationsData)
      } catch (error) {
        console.error("Error fetching bot data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBotData()
  }, [botId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!bot) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Bot bulunamadı</h1>
        <Link href="/bot-list">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Bot Listesine Dön
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/bot-list">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Bot Detayları</h1>
        </div>
        <Link href={`/edit-bot/${botId}`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Düzenle
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Profil Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={bot.avatar || "/placeholder.svg"} alt={bot.name} />
                <AvatarFallback>{bot.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{bot.name}</h2>
                <p className="text-muted-foreground">
                  {bot.age} yaşında, {bot.gender === "female" ? "Kadın" : "Erkek"}
                </p>
                <Badge variant={bot.status === "active" ? "success" : "destructive"} className="mt-2">
                  {bot.status === "active" ? "Aktif" : "Pasif"}
                </Badge>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Konum</h3>
                <p>{bot.location || "Belirtilmemiş"}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Oluşturulma Tarihi</h3>
                <p>{new Date(bot.createdAt).toLocaleDateString("tr-TR")}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">İlgi Alanları</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {bot.interests.map((interest, index) => (
                    <Badge key={index} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Biyografi</h3>
                <p className="text-sm">{bot.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="conversations">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="conversations">Konuşmalar</TabsTrigger>
              <TabsTrigger value="messages">Mesajlar</TabsTrigger>
              <TabsTrigger value="performance">Performans</TabsTrigger>
              <TabsTrigger value="settings">Ayarlar</TabsTrigger>
            </TabsList>
            <TabsContent value="conversations">
              <ConversationHistoryTab botId={botId} conversations={conversations} />
            </TabsContent>
            <TabsContent value="messages">
              <BotMessagesTab botId={botId} />
            </TabsContent>
            <TabsContent value="performance">
              <BotPerformanceTab botId={botId} />
            </TabsContent>
            <TabsContent value="settings">
              <BotSettingsTab bot={bot} onUpdate={(updatedBot) => setBot(updatedBot)} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
