import { conversationService } from "./conversation-service"
import { toast } from "@/hooks/use-toast"
import type { ConversationMetadata } from "@/types/conversation"

// Define conversation location types
export type ConversationLocationType = "live_chat" | "bot" | "archived"

// Define transition event types
export type TransitionEventType = "to_live_chat" | "to_bot" | "archived"

// Interface for transition events
export interface ConversationTransitionEvent {
  conversationId: string
  fromType: ConversationLocationType
  toType: ConversationLocationType
  timestamp: Date
  initiatedBy: string
  reason?: string
  preserveContext: boolean
}

// Interface for transition history
export interface TransitionHistoryEntry {
  event: ConversationTransitionEvent
  success: boolean
  error?: string
}

class ConversationTransitionService {
  private transitionHistory: Map<string, TransitionHistoryEntry[]> = new Map()
  private activeTransitions: Map<string, boolean> = new Map()
  private locationMap: Map<string, ConversationLocationType> = new Map()

  constructor() {
    // Initialize event listeners
    if (typeof window !== "undefined") {
      window.addEventListener("conversationTransition", this.handleTransitionEvent as EventListener)
    }
  }

  // Get the current location of a conversation
  getConversationLocation(conversationId: string): ConversationLocationType {
    return this.locationMap.get(conversationId) || "bot" // Default to bot if not set
  }

  // Set the location of a conversation
  setConversationLocation(conversationId: string, location: ConversationLocationType): void {
    this.locationMap.set(conversationId, location)
  }

  // Check if a conversation is currently being transitioned
  isInTransition(conversationId: string): boolean {
    return this.activeTransitions.get(conversationId) || false
  }

  // Get transition history for a conversation
  getTransitionHistory(conversationId: string): TransitionHistoryEntry[] {
    return this.transitionHistory.get(conversationId) || []
  }

  // Handle transition events
  private handleTransitionEvent = (event: CustomEvent<ConversationTransitionEvent>): void => {
    const transitionData = event.detail
    this.transitionConversation(
      transitionData.conversationId,
      transitionData.fromType,
      transitionData.toType,
      transitionData.initiatedBy,
      transitionData.reason,
      transitionData.preserveContext,
    )
  }

  // Transition a conversation between live chat and bot
  async transitionConversation(
    conversationId: string,
    fromType: ConversationLocationType,
    toType: ConversationLocationType,
    initiatedBy: string,
    reason?: string,
    preserveContext = true,
  ): Promise<boolean> {
    try {
      // Mark conversation as in transition
      this.activeTransitions.set(conversationId, true)

      // Create transition event
      const transitionEvent: ConversationTransitionEvent = {
        conversationId,
        fromType,
        toType,
        timestamp: new Date(),
        initiatedBy,
        reason,
        preserveContext,
      }

      // Dispatch pre-transition event
      this.dispatchTransitionStartEvent(transitionEvent)

      // Get conversation data
      const conversation = conversationService.getConversation(conversationId)
      if (!conversation) {
        console.error(`Conversation with ID ${conversationId} not found in conversation service`)

        // Check if we need to create a placeholder conversation
        if (fromType === "bot" && toType === "live_chat") {
          // Create a placeholder conversation for transition
          const placeholderConversation = {
            id: conversationId,
            userId: "unknown",
            botId: "unknown",
            status: "active",
            createdAt: new Date(),
            updatedAt: new Date(),
            lastMessageAt: new Date(),
            messageCount: 0,
            userMessageCount: 0,
            botMessageCount: 0,
            hasUnreadMessages: false,
            isPinned: false,
            isArchived: false,
            isVipUser: false,
            userCredits: 0,
          }

          // Register the placeholder conversation
          conversationService.updateConversation(placeholderConversation)

          console.log(`Created placeholder conversation for ID ${conversationId}`)

          // Now try to get the conversation again
          const createdConversation = conversationService.getConversation(conversationId)
          if (!createdConversation) {
            throw new Error(`Failed to create placeholder conversation for ID ${conversationId}`)
          }

          // Continue with the created conversation
          return this.completeTransition(createdConversation, transitionEvent, toType, fromType)
        } else {
          throw new Error(`Conversation with ID ${conversationId} not found`)
        }
      }

      // Complete the transition with the found conversation
      return this.completeTransition(conversation, transitionEvent, toType, fromType)
    } catch (error) {
      console.error("Conversation transition failed:", error)

      // Create transition event for failed transition
      const transitionEvent: ConversationTransitionEvent = {
        conversationId,
        fromType,
        toType,
        timestamp: new Date(),
        initiatedBy,
        reason,
        preserveContext,
      }

      // Record failed transition in history
      this.recordTransition(transitionEvent, false, error instanceof Error ? error.message : String(error))

      // Dispatch transition error event
      this.dispatchTransitionErrorEvent(transitionEvent, error instanceof Error ? error : new Error(String(error)))

      return false
    } finally {
      // Mark conversation as no longer in transition
      this.activeTransitions.set(conversationId, false)
    }
  }

  // Add this helper method to complete the transition
  private completeTransition(
    conversation: ConversationMetadata,
    transitionEvent: ConversationTransitionEvent,
    toType: ConversationLocationType,
    fromType: ConversationLocationType,
  ): boolean {
    // Update conversation metadata to reflect the transition
    const updatedConversation = this.updateConversationForTransition(conversation, toType)

    // Update the conversation location
    this.setConversationLocation(transitionEvent.conversationId, toType)

    // Record successful transition in history
    this.recordTransition(transitionEvent, true)

    // Dispatch post-transition event
    this.dispatchTransitionCompleteEvent(transitionEvent, updatedConversation)

    // Show toast notification
    this.showTransitionNotification(fromType, toType, conversation)

    return true
  }

  // Update conversation metadata for transition
  private updateConversationForTransition(
    conversation: ConversationMetadata,
    toType: ConversationLocationType,
  ): ConversationMetadata {
    // Create updated conversation object
    const updatedConversation: ConversationMetadata = {
      ...conversation,
      updatedAt: new Date(),
      lastMessageAt: new Date(),
    }

    // Update status based on destination
    if (toType === "live_chat") {
      updatedConversation.status = "escalated"
      updatedConversation.escalatedAt = new Date()
      updatedConversation.escalatedBy = "system"
      updatedConversation.escalationReason = "transferred_to_live_chat"
    } else if (toType === "bot") {
      updatedConversation.status = "active"
      // Reset escalation fields if they exist
      delete updatedConversation.escalatedAt
      delete updatedConversation.escalatedBy
      delete updatedConversation.escalationReason
    }

    // Add transition metadata
    if (!updatedConversation.metadata) {
      updatedConversation.metadata = {}
    }

    if (!updatedConversation.metadata.transitions) {
      updatedConversation.metadata.transitions = []
    }

    updatedConversation.metadata.transitions.push({
      toType,
      timestamp: new Date(),
      currentLocation: toType,
    })

    // Update the conversation in the service
    return conversationService.updateConversation(updatedConversation)
  }

  // Record a transition in the history
  private recordTransition(event: ConversationTransitionEvent, success: boolean, error?: string): void {
    const historyEntry: TransitionHistoryEntry = {
      event,
      success,
      error,
    }

    if (!this.transitionHistory.has(event.conversationId)) {
      this.transitionHistory.set(event.conversationId, [])
    }

    this.transitionHistory.get(event.conversationId)?.push(historyEntry)
  }

  // Dispatch transition start event
  private dispatchTransitionStartEvent(event: ConversationTransitionEvent): void {
    if (typeof window !== "undefined") {
      const customEvent = new CustomEvent("conversationTransitionStart", {
        detail: event,
      })
      window.dispatchEvent(customEvent)
    }
  }

  // Dispatch transition complete event
  private dispatchTransitionCompleteEvent(
    event: ConversationTransitionEvent,
    updatedConversation: ConversationMetadata,
  ): void {
    if (typeof window !== "undefined") {
      const customEvent = new CustomEvent("conversationTransitionComplete", {
        detail: {
          event,
          conversation: updatedConversation,
        },
      })
      window.dispatchEvent(customEvent)
    }
  }

  // Dispatch transition error event
  private dispatchTransitionErrorEvent(event: ConversationTransitionEvent, error: Error): void {
    if (typeof window !== "undefined") {
      const customEvent = new CustomEvent("conversationTransitionError", {
        detail: {
          event,
          error,
        },
      })
      window.dispatchEvent(customEvent)
    }
  }

  // Show toast notification for transition
  private showTransitionNotification(
    fromType: ConversationLocationType,
    toType: ConversationLocationType,
    conversation: ConversationMetadata,
  ): void {
    const userName = `User ${conversation.userId}`
    const botName = `Bot ${conversation.botId}`

    if (fromType === "bot" && toType === "live_chat") {
      toast({
        title: "Konuşma Canlı Sohbete Aktarıldı",
        description: `${userName} ve ${botName} arasındaki konuşma canlı sohbete aktarıldı.`,
        variant: "success",
      })
    } else if (fromType === "live_chat" && toType === "bot") {
      toast({
        title: "Konuşma Bot'a Aktarıldı",
        description: `${userName} ile konuşma ${botName}'a aktarıldı.`,
        variant: "success",
      })
    }
  }

  // Initiate a transition to live chat
  transitionToLiveChat(
    conversationId: string,
    initiatedBy: string,
    reason?: string,
    preserveContext = true,
  ): Promise<boolean> {
    const currentLocation = this.getConversationLocation(conversationId)
    return this.transitionConversation(
      conversationId,
      currentLocation,
      "live_chat",
      initiatedBy,
      reason,
      preserveContext,
    )
  }

  // Initiate a transition to bot
  transitionToBot(
    conversationId: string,
    initiatedBy: string,
    reason?: string,
    preserveContext = true,
  ): Promise<boolean> {
    const currentLocation = this.getConversationLocation(conversationId)
    return this.transitionConversation(conversationId, currentLocation, "bot", initiatedBy, reason, preserveContext)
  }
}

// Create a singleton instance
export const conversationTransitionService = new ConversationTransitionService()
