"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, User } from "lucide-react"
import { conversationService } from "@/services/conversation-service"
import { liveChatService } from "@/services/live-chat-service"
import type { ConversationMetadata } from "@/types/conversation"
import type { Message } from "@/types/message"

export function BotConversationsMonitor() {
  const [botConversations, setBotConversations] = useState<
    Array<{
      conversation: ConversationMetadata
      messages: Message[]
      botName: string
      botAvatar: string
      userName: string
      userAvatar: string
    }>
  >([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial load of bot conversations
    const loadBotConversations = async () => {
      try {
        setLoading(true)

        // Get all conversations
        const allConversations = conversationService.getAllConversations()

        // Filter for active bot conversations
        const botConvs = allConversations.filter((conv) => conv.status === "active" && !conv.isArchived)

        // Fetch details for each conversation
        const conversationsWithDetails = await Promise.all(
          botConvs.map(async (conv) => {
            // Get messages for this conversation
            const messages = await liveChatService.getConversationHistory(conv.id)

            // Get bot details (in a real app, this would come from a service)
            const botDetails = {
              name: `Bot ${conv.botId}`,
              avatar: `/abstract-geometric-shapes.png?height=40&width=40&query=bot-${conv.botId}`,
            }

            // Get user details (in a real app, this would come from a service)
            const userDetails = {
              name: `User ${conv.userId}`,
              avatar: `/abstract-geometric-shapes.png?height=40&width=40&query=user-${conv.userId}`,
            }

            return {
              conversation: conv,
              messages,
              botName: botDetails.name,
              botAvatar: botDetails.avatar,
              userName: userDetails.name,
              userAvatar: userDetails.avatar,
            }
          }),
        )

        setBotConversations(conversationsWithDetails)
      } catch (error) {
        console.error("Error loading bot conversations:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBotConversations()

    // Listen for bot redirection events
    const handleBotRedirection = () => {
      // Reload conversations after a short delay to allow processing
      setTimeout(loadBotConversations, 1500)
    }

    window.addEventListener("botRedirection", handleBotRedirection)

    // Also listen for new conversation events
    const handleConversationCreated = () => {
      loadBotConversations()
    }

    window.addEventListener("conversationCreated", handleConversationCreated as EventListener)

    return () => {
      window.removeEventListener("botRedirection", handleBotRedirection)
      window.removeEventListener("conversationCreated", handleConversationCreated as EventListener)
    }
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bot Konuşmaları</CardTitle>
          <CardDescription>Yükleniyor...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (botConversations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bot Konuşmaları</CardTitle>
          <CardDescription>Aktif bot konuşması bulunmamaktadır.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Bot Konuşmaları</h2>

      {botConversations.map((item) => (
        <Card key={item.conversation.id} className="overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={item.botAvatar || "/placeholder.svg"} alt={item.botName} />
                  <AvatarFallback>{item.botName.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{item.botName}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{item.conversation.messageCount} mesaj</span>
                    </div>
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{item.userName}</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Aktif
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="max-h-[300px] overflow-y-auto p-4">
              {item.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "bot" && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src={item.botAvatar || "/placeholder.svg"} alt={item.botName} />
                      <AvatarFallback>{item.botName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-blue-100 text-blue-800"
                        : message.sender === "system"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70 text-right">{message.time}</p>
                  </div>

                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 ml-2 mt-1">
                      <AvatarImage src={item.userAvatar || "/placeholder.svg"} alt={item.userName} />
                      <AvatarFallback>{item.userName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
