"use client"

import { useState, useEffect } from "react"
import { UserLiveChatInterface } from "./user-live-chat-interface"
import { UserLiveChatHeader } from "./user-live-chat-header"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { liveChatService } from "@/services/live-chat-service"
import { botMessageService } from "@/services/bot-message-service"
import type { Message } from "@/types/message"
import type { Bot } from "@/types/bot"

export function UserLiveChatContent() {
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null)
  const [typingIndicator, setTypingIndicator] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const conversationId = searchParams.get("conversationId")
  const context = searchParams.get("context")
  const isVip = searchParams.get("isVip") === "true"

  // Fetch conversation and select a random bot
  useEffect(() => {
    const fetchConversationAndSelectBot = async () => {
      try {
        setLoading(true)

        // 1. Get a random active bot
        const bot = await liveChatService.getRandomActiveBot()
        if (!bot) {
          toast({
            title: "Hata",
            description: "Şu anda aktif destek temsilcisi bulunmamaktadır. Lütfen daha sonra tekrar deneyin.",
            variant: "destructive",
          })
          router.push("/user/transactions")
          return
        }

        setSelectedBot(bot)

        // 2. Initialize messages array with system welcome message
        let initialMessages: Message[] = [
          {
            id: "system-welcome",
            sender: "system",
            content: isVip
              ? "VIP Canlı destek hattına hoş geldiniz. Öncelikli olarak size yardımcı olacağız."
              : "Canlı destek hattına hoş geldiniz. Size nasıl yardımcı olabiliriz?",
            time: new Date().toLocaleString("tr-TR"),
            read: true,
          },
        ]

        // 3. Fetch conversation history if conversationId is provided
        if (conversationId) {
          const history = await liveChatService.getConversationHistory(conversationId)
          initialMessages = [...initialMessages, ...history]
        }

        // 4. Add context message if provided
        if (context) {
          initialMessages.push({
            id: "context-transfer",
            sender: "system",
            content: `Önceki konu: ${context}`,
            time: new Date().toLocaleString("tr-TR"),
            read: true,
          })
        }

        // 5. Add bot greeting from bot message service
        const greetingMessage = await botMessageService.getRandomMessage(bot.id, "greeting")
        initialMessages.push({
          id: Date.now().toString(),
          sender: "bot",
          content: greetingMessage || `Merhaba, ben ${bot.name}. Size nasıl yardımcı olabilirim?`,
          time: new Date().toLocaleString("tr-TR"),
          read: true,
        })

        setMessages(initialMessages)

        // 6. If there's a conversationId, transfer it to the live chat system
        if (conversationId) {
          // Create a new conversation ID for the live chat
          const newConversationId = await liveChatService.transferConversation(conversationId, bot.id)

          // Log the transfer for debugging
          console.log(`Conversation transferred: ${conversationId} -> ${newConversationId}`)

          // Store the new conversation ID in session storage for persistence
          if (typeof window !== "undefined") {
            sessionStorage.setItem("currentLiveChatConversation", newConversationId)
          }
        } else {
          // Create a new conversation
          const userId = typeof window !== "undefined" ? sessionStorage.getItem("userId") || "anonymous" : "anonymous"
          const newConversationId = await liveChatService.createConversation(userId, bot.id, isVip)

          // Store the new conversation ID in session storage
          if (typeof window !== "undefined") {
            sessionStorage.setItem("currentLiveChatConversation", newConversationId)
          }
        }
      } catch (error) {
        console.error("Error setting up live chat:", error)
        toast({
          title: "Hata",
          description: "Canlı destek başlatılırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
          variant: "destructive",
        })
        router.push("/user/transactions")
      } finally {
        setLoading(false)
      }
    }

    fetchConversationAndSelectBot()
  }, [conversationId, context, isVip, toast, router])

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !selectedBot) return

    // Create new user message
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content,
      time: new Date().toLocaleString("tr-TR"),
      read: false,
    }

    // Add message to chat
    setMessages((prev) => [...prev, newMessage])

    // Show typing indicator
    setTypingIndicator(true)

    try {
      // Simulate bot response after a delay
      setTimeout(async () => {
        // Get a random message from the bot's chat message pool
        let responseContent = await botMessageService.getRandomMessage(selectedBot.id, "chat")

        // If no message is found in the pool, use a default response
        if (!responseContent) {
          responseContent = "Mesajınız için teşekkürler. Yardımcı olmak için buradayım."
        }

        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          content: responseContent,
          time: new Date().toLocaleString("tr-TR"),
          read: false,
        }

        setTypingIndicator(false)
        setMessages((prev) => [...prev, botResponse])
      }, 1500)
    } catch (error) {
      setTypingIndicator(false)
      toast({
        title: "Hata",
        description: "Mesajınız gönderilemedi. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-[#fa2674]" />
        <p className="mt-4 text-lg">Canlı destek başlatılıyor...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <UserLiveChatHeader
        botName={selectedBot?.name || "Destek"}
        isVip={isVip}
        onClose={() => router.push("/user/transactions")}
      />

      <Card className="flex-1 overflow-hidden p-0 border-[#2b2c46]">
        <UserLiveChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          botAvatar={selectedBot?.avatar || ""}
          botName={selectedBot?.name || "Destek"}
          isTyping={typingIndicator}
        />
      </Card>
    </div>
  )
}
