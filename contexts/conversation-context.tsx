"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { ConversationMetadata, ConversationPriority } from "@/types/conversation"
import { conversationService } from "@/services/conversation-service"
import type { ConversationStatus } from "@/types/conversation"

interface ConversationContextType {
  conversations: ConversationMetadata[]
  escalatedConversations: ConversationMetadata[]
  pendingEscalations: ConversationMetadata[]
  getConversation: (id: string) => ConversationMetadata | undefined
  getConversationByUserAndBot: (userId: string, botId: string) => ConversationMetadata | undefined
  updateConversation: (conversation: Partial<ConversationMetadata> & { id: string }) => void
  escalateConversation: (id: string, reason: string, priority?: ConversationPriority) => void
  assignConversation: (id: string, adminId: string) => void
  resolveConversation: (id: string, note?: string) => void
  togglePinStatus: (id: string) => void
  markAsRead: (id: string) => void
  createConversation: (userId: string, botId: string, initialStatus?: ConversationStatus) => ConversationMetadata
  transferConversation: (fromConversationId: string, toUserId: string, toBotId: string, context?: string) => void
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<ConversationMetadata[]>([])
  const [escalatedConversations, setEscalatedConversations] = useState<ConversationMetadata[]>([])
  const [pendingEscalations, setPendingEscalations] = useState<ConversationMetadata[]>([])

  // Load initial conversations
  useEffect(() => {
    const allConversations = conversationService.getAllConversations()
    setConversations(allConversations)
    setEscalatedConversations(allConversations.filter((conv) => conv.status === "escalated"))
    setPendingEscalations(allConversations.filter((conv) => conv.status === "pending"))
  }, [])

  // Add this inside the ConversationProvider component
  // Listen for new conversation events
  useEffect(() => {
    const handleNewConversation = (event: CustomEvent<{ conversation: ConversationMetadata }>) => {
      const newConversation = event.detail.conversation

      // Update the conversations state if not already included
      setConversations((prev) => {
        if (prev.some((conv) => conv.id === newConversation.id)) {
          return prev
        }
        return [...prev, newConversation]
      })

      // Update filtered lists
      updateFilteredLists()
    }

    // Add event listener
    if (typeof window !== "undefined") {
      window.addEventListener("conversationCreated", handleNewConversation as EventListener)

      // Clean up
      return () => {
        window.removeEventListener("conversationCreated", handleNewConversation as EventListener)
      }
    }
  }, [])

  // Get a conversation by ID
  const getConversation = (id: string) => {
    return conversationService.getConversation(id)
  }

  // Get a conversation by user and bot IDs
  const getConversationByUserAndBot = (userId: string, botId: string) => {
    return conversationService.getConversationByUserAndBot(userId, botId)
  }

  // Update a conversation
  const updateConversation = (conversation: Partial<ConversationMetadata> & { id: string }) => {
    const updated = conversationService.updateConversation(conversation)

    // Update state
    setConversations((prev) => prev.map((conv) => (conv.id === updated.id ? updated : conv)))

    // Update filtered lists
    updateFilteredLists()
  }

  // Escalate a conversation
  const escalateConversation = (id: string, reason: string, priority: ConversationPriority = "medium") => {
    const updated = conversationService.escalateConversation(
      id,
      "admin", // In a real app, use the current admin's ID
      reason as any,
      priority,
    )

    if (updated) {
      // Update state
      setConversations((prev) => prev.map((conv) => (conv.id === updated.id ? updated : conv)))

      // Update filtered lists
      updateFilteredLists()
    }
  }

  // Assign a conversation
  const assignConversation = (id: string, adminId: string) => {
    const updated = conversationService.assignConversation(id, adminId)

    if (updated) {
      // Update state
      setConversations((prev) => prev.map((conv) => (conv.id === updated.id ? updated : conv)))
    }
  }

  // Resolve a conversation
  const resolveConversation = (id: string, note?: string) => {
    const updated = conversationService.resolveConversation(
      id,
      "admin", // In a real app, use the current admin's ID
      note,
    )

    if (updated) {
      // Update state
      setConversations((prev) => prev.map((conv) => (conv.id === updated.id ? updated : conv)))

      // Update filtered lists
      updateFilteredLists()
    }
  }

  // Toggle pin status
  const togglePinStatus = (id: string) => {
    const updated = conversationService.togglePinStatus(id)

    if (updated) {
      // Update state
      setConversations((prev) => prev.map((conv) => (conv.id === updated.id ? updated : conv)))
    }
  }

  // Mark as read
  const markAsRead = (id: string) => {
    const updated = conversationService.markAsRead(id)

    if (updated) {
      // Update state
      setConversations((prev) => prev.map((conv) => (conv.id === updated.id ? updated : conv)))
    }
  }

  // Create a new conversation
  const createConversation = (userId: string, botId: string, initialStatus: ConversationStatus = "active") => {
    const newConversation = conversationService.createConversation(userId, botId, initialStatus)

    // Update state
    setConversations((prev) => {
      if (prev.some((conv) => conv.id === newConversation.id)) {
        return prev
      }
      return [...prev, newConversation]
    })

    // Update filtered lists
    updateFilteredLists()

    return newConversation
  }

  // Transfer a conversation
  const transferConversation = (fromConversationId: string, toUserId: string, toBotId: string, context?: string) => {
    const { fromConversation, toConversation } = conversationService.transferConversation(
      fromConversationId,
      toUserId,
      toBotId,
      context,
    )

    // Update state for both conversations
    setConversations((prev) => {
      const updated = prev.filter((conv) => conv.id !== fromConversationId && conv.id !== toConversation.id)

      if (fromConversation) {
        updated.push(fromConversation)
      }

      updated.push(toConversation)
      return updated
    })

    // Update filtered lists
    updateFilteredLists()
  }

  // Update filtered lists
  const updateFilteredLists = () => {
    const allConversations = conversationService.getAllConversations()
    setEscalatedConversations(allConversations.filter((conv) => conv.status === "escalated"))
    setPendingEscalations(allConversations.filter((conv) => conv.status === "pending"))
  }

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        escalatedConversations,
        pendingEscalations,
        getConversation,
        getConversationByUserAndBot,
        updateConversation,
        escalateConversation,
        assignConversation,
        resolveConversation,
        togglePinStatus,
        markAsRead,
        createConversation,
        transferConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  )
}

export function useConversation() {
  const context = useContext(ConversationContext)
  if (context === undefined) {
    throw new Error("useConversation must be used within a ConversationProvider")
  }
  return context
}
