"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type { ConversationMetadata } from "@/types/conversation"

interface LiveChatUpdaterProps {
  onNewConversation: (conversation: ConversationMetadata) => void
}

export function LiveChatUpdater({ onNewConversation }: LiveChatUpdaterProps) {
  const { toast } = useToast()

  useEffect(() => {
    const handleNewConversation = (event: CustomEvent<{ conversation: ConversationMetadata }>) => {
      const conversation = event.detail.conversation

      // Notify parent component about new conversation
      onNewConversation(conversation)

      // Show a toast notification
      toast({
        title: "Yeni Konuşma",
        description: `${conversation.userId} kullanıcısı ve ${conversation.botId} bot arasında yeni konuşma başlatıldı.`,
        variant: "default",
      })
    }

    // Add event listener for conversation creation
    if (typeof window !== "undefined") {
      window.addEventListener("conversationCreated", handleNewConversation as EventListener)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("conversationCreated", handleNewConversation as EventListener)
      }
    }
  }, [onNewConversation, toast])

  // This component doesn't render anything visible
  return null
}
