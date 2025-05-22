"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { conversationService } from "@/services/conversation-service"
import { liveChatService } from "@/services/live-chat-service"
import type { Message } from "@/types/message"

interface BotRedirectionHandlerProps {
  onRedirectionComplete?: (conversationId: string) => void
  onRedirectionStart?: (userId: string, botId: string) => void
  onRedirectionError?: (error: Error) => void
}

export function BotRedirectionHandler({
  onRedirectionComplete,
  onRedirectionStart,
  onRedirectionError,
}: BotRedirectionHandlerProps) {
  const { toast } = useToast()

  useEffect(() => {
    // Listen for bot redirection events
    const handleBotRedirection = async (event: CustomEvent) => {
      const { userId, botId, messages, originalConversationId, preserveContext = true } = event.detail

      try {
        // Notify that redirection has started
        if (onRedirectionStart) {
          onRedirectionStart(userId, botId)
        }

        // 1. Create or get conversation between user and bot
        const conversation = conversationService.createConversation(userId, botId)

        // 2. Transfer relevant messages to the bot conversation if context should be preserved
        if (preserveContext) {
          // Filter messages to include:
          // - Last 5 user messages for context
          // - Any system messages that provide important context
          // - Exclude bot messages from the previous bot
          const relevantMessages = messages
            .filter(
              (msg: Message) =>
                msg.sender === "user" || (msg.sender === "system" && !msg.content.includes("yönlendirildi")),
            )
            .slice(-5) // Only transfer the last 5 relevant messages for context

          // 3. Add a system message indicating the transfer to the original conversation
          await liveChatService.sendMessage(originalConversationId, {
            sender: "system",
            content: `Bu konuşma ${botId === "random" ? "rastgele bir bot'a" : "başka bir bot'a"} yönlendirildi. Bot kısa süre içinde yanıt verecek.`,
          })

          // 4. Add a system message to the new conversation for context
          await liveChatService.sendMessage(conversation.id, {
            sender: "system",
            content: "Bu konuşma başka bir bottan yönlendirildi.",
          })

          // 5. Add the transferred messages to the bot conversation
          for (const msg of relevantMessages) {
            await liveChatService.sendMessage(conversation.id, {
              sender: msg.sender,
              content: msg.content,
              location: msg.location,
              image: msg.image,
            })
          }
        } else {
          // If not preserving context, just add a simple system message
          await liveChatService.sendMessage(originalConversationId, {
            sender: "system",
            content: "Bu konuşma başka bir bot'a yönlendirildi.",
          })
        }

        // 6. Trigger the bot's standard response
        setTimeout(async () => {
          // Get a contextual response based on the bot's personality
          const botResponse = await liveChatService.getBotResponseForRedirection(botId)

          await liveChatService.sendMessage(conversation.id, {
            sender: "bot",
            content: botResponse,
          })

          // Update conversation metadata
          conversationService.updateConversation({
            id: conversation.id,
            lastMessageAt: new Date(),
            messageCount: conversation.messageCount + 1,
            botMessageCount: conversation.botMessageCount + 1,
            hasUnreadMessages: true,
          })

          // Notify that redirection is complete
          if (onRedirectionComplete) {
            onRedirectionComplete(conversation.id)
          }
        }, 1000) // Slight delay to simulate bot thinking

        toast({
          title: "Bot'a Yönlendirildi",
          description: "Konuşma başarıyla bot'a yönlendirildi.",
          variant: "success",
        })
      } catch (error) {
        console.error("Bot redirection failed:", error)

        if (onRedirectionError && error instanceof Error) {
          onRedirectionError(error)
        }

        toast({
          title: "Yönlendirme Başarısız",
          description: "Konuşma bot'a yönlendirilemedi. Lütfen tekrar deneyin.",
          variant: "destructive",
        })
      }
    }

    // Register event listener
    window.addEventListener("botRedirection", handleBotRedirection as EventListener)

    return () => {
      window.removeEventListener("botRedirection", handleBotRedirection as EventListener)
    }
  }, [toast, onRedirectionComplete, onRedirectionStart, onRedirectionError])

  return null // This is a utility component with no UI
}
