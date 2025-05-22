"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { botMessageService, type MessageType } from "@/services/bot-message-service"

interface BotMessagesTabProps {
  botId: string
  botName: string
  botAvatar: string
}

export function BotMessagesTab({ botId, botName, botAvatar }: BotMessagesTabProps) {
  const [messages, setMessages] = useState<Record<MessageType, string[]>>({
    greeting: [],
    chat: [],
    zeroJeton: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true)
      try {
        const allMessages = await botMessageService.getAllBotMessages(botId)
        setMessages(allMessages)
      } catch (error) {
        console.error("Mesajlar yüklenirken hata oluştu:", error)
      } finally {
        setLoading(false)
      }
    }

    if (botId) {
      loadMessages()
    }
  }, [botId])

  const renderMessageList = (messageList: string[]) => {
    if (loading) {
      return Array(3)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        ))
    }

    if (messageList.length === 0) {
      return (
        <div className="text-center p-4 border border-dashed rounded-lg">
          <p className="text-muted-foreground">Bu kategoride mesaj bulunmuyor</p>
        </div>
      )
    }

    return messageList.map((message, index) => (
      <div key={index} className="flex items-start gap-3">
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={botAvatar || "/placeholder.svg"} alt={botName} />
          <AvatarFallback>{botName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="bg-[#2b2c46] text-white rounded-lg p-3 flex-1">
          <p className="text-sm">{message}</p>
        </div>
      </div>
    ))
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="greeting">
        <TabsList className="w-full">
          <TabsTrigger value="greeting" className="flex-1">
            Karşılama Mesajları
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex-1">
            Sohbet Mesajları
          </TabsTrigger>
          <TabsTrigger value="zeroJeton" className="flex-1">
            Jeton Bitti Mesajları
          </TabsTrigger>
        </TabsList>

        <TabsContent value="greeting">
          <Card>
            <CardContent className="space-y-4 pt-6">{renderMessageList(messages.greeting)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardContent className="space-y-4 pt-6">{renderMessageList(messages.chat)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zeroJeton">
          <Card>
            <CardContent className="space-y-4 pt-6">{renderMessageList(messages.zeroJeton)}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
