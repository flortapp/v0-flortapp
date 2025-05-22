import type {
  ConversationMetadata,
  ConversationStatus,
  ConversationSummary,
  EscalationReason,
  ConversationPriority,
} from "@/types/conversation"

// In a real app, this would interact with an API
export class ConversationService {
  private conversations: Map<string, ConversationMetadata> = new Map()
  private redirectionHistory: Map<string, string[]> = new Map() // Tracks redirection history: originalId -> [redirectedIds]

  // Get conversation by ID
  getConversation(id: string): ConversationMetadata | undefined {
    const conversation = this.conversations.get(id)
    if (!conversation) {
      console.warn(
        `Conversation with ID ${id} not found. Available IDs: ${Array.from(this.conversations.keys()).join(", ")}`,
      )
    }
    return conversation
  }

  // Get conversation by user and bot IDs
  getConversationByUserAndBot(userId: string, botId: string): ConversationMetadata | undefined {
    const conversationId = `${userId}-${botId}`
    return this.conversations.get(conversationId)
  }

  // Get all conversations
  getAllConversations(): ConversationMetadata[] {
    return Array.from(this.conversations.values())
  }

  // Get conversations by status
  getConversationsByStatus(status: ConversationStatus): ConversationMetadata[] {
    return Array.from(this.conversations.values()).filter((conv) => conv.status === status)
  }

  // Get conversations by bot ID
  getConversationsByBot(botId: string): ConversationMetadata[] {
    return Array.from(this.conversations.values()).filter((conv) => conv.botId === botId)
  }

  // Add this method to ConversationService class
  notifyConversationCreated(conversation: ConversationMetadata): void {
    // Create a custom event that components can listen for
    if (typeof window !== "undefined") {
      const event = new CustomEvent("conversationCreated", {
        detail: { conversation },
      })
      window.dispatchEvent(event)
    }
  }

  // Add a method to check if a conversation exists
  hasConversation(id: string): boolean {
    return this.conversations.has(id)
  }

  // Create or update conversation
  updateConversation(conversation: Partial<ConversationMetadata> & { id: string }): ConversationMetadata {
    const existing = this.conversations.get(conversation.id)
    const isNew = !existing

    // Ensure all required fields are present for new conversations
    const updated: ConversationMetadata = {
      id: conversation.id,
      userId: conversation.userId || existing?.userId || "unknown",
      botId: conversation.botId || existing?.botId || "unknown",
      status: conversation.status || existing?.status || "active",
      createdAt: conversation.createdAt || existing?.createdAt || new Date(),
      updatedAt: new Date(),
      lastMessageAt: conversation.lastMessageAt || existing?.lastMessageAt || new Date(),
      messageCount: conversation.messageCount ?? existing?.messageCount ?? 0,
      userMessageCount: conversation.userMessageCount ?? existing?.userMessageCount ?? 0,
      botMessageCount: conversation.botMessageCount ?? existing?.botMessageCount ?? 0,
      hasUnreadMessages: conversation.hasUnreadMessages ?? existing?.hasUnreadMessages ?? false,
      isPinned: conversation.isPinned ?? existing?.isPinned ?? false,
      isArchived: conversation.isArchived ?? existing?.isArchived ?? false,
      isVipUser: conversation.isVipUser ?? existing?.isVipUser ?? false,
      userCredits: conversation.userCredits ?? existing?.userCredits ?? 0,
      ...conversation,
    }

    this.conversations.set(conversation.id, updated)

    // If this is a new conversation, notify listeners
    if (isNew) {
      this.notifyConversationCreated(updated)
    }

    return updated
  }

  // Escalate a conversation
  escalateConversation(
    conversationId: string,
    escalatedBy: string,
    reason: EscalationReason,
    priority: ConversationPriority = "medium",
  ): ConversationMetadata | undefined {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) return undefined

    const updated: ConversationMetadata = {
      ...conversation,
      status: "escalated",
      escalatedAt: new Date(),
      escalatedBy,
      escalationReason: reason,
      priority,
      updatedAt: new Date(),
    }

    this.conversations.set(conversationId, updated)
    return updated
  }

  // Assign a conversation to an admin
  assignConversation(conversationId: string, adminId: string): ConversationMetadata | undefined {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) return undefined

    const updated: ConversationMetadata = {
      ...conversation,
      assignedTo: adminId,
      assignedAt: new Date(),
      updatedAt: new Date(),
    }

    this.conversations.set(conversationId, updated)
    return updated
  }

  // Resolve a conversation
  resolveConversation(conversationId: string, resolvedBy: string, note?: string): ConversationMetadata | undefined {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) return undefined

    const updated: ConversationMetadata = {
      ...conversation,
      status: "resolved",
      resolvedAt: new Date(),
      resolvedBy,
      resolutionNote: note,
      updatedAt: new Date(),
    }

    this.conversations.set(conversationId, updated)
    return updated
  }

  // Toggle pin status
  togglePinStatus(conversationId: string): ConversationMetadata | undefined {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) return undefined

    const updated: ConversationMetadata = {
      ...conversation,
      isPinned: !conversation.isPinned,
      updatedAt: new Date(),
    }

    this.conversations.set(conversationId, updated)
    return updated
  }

  // Mark conversation as read
  markAsRead(conversationId: string): ConversationMetadata | undefined {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) return undefined

    const updated: ConversationMetadata = {
      ...conversation,
      hasUnreadMessages: false,
      updatedAt: new Date(),
    }

    this.conversations.set(conversationId, updated)
    return updated
  }

  // Get conversation summaries (for UI display)
  getConversationSummaries(): ConversationSummary[] {
    return Array.from(this.conversations.values()).map((conv) => ({
      id: conv.id,
      userId: conv.userId,
      userName: "User Name", // In a real app, fetch from user service
      userAvatar: `/abstract-geometric-shapes.png?height=40&width=40&query=user-${conv.userId}`,
      botId: conv.botId,
      botName: "Bot Name", // In a real app, fetch from bot service
      botAvatar: `/abstract-geometric-shapes.png?height=40&width=40&query=bot-${conv.botId}`,
      status: conv.status,
      lastMessage: "Last message...", // In a real app, fetch from message service
      lastMessageAt: conv.lastMessageAt,
      messageCount: conv.messageCount,
      priority: conv.priority,
      hasUnreadMessages: conv.hasUnreadMessages,
      isPinned: conv.isPinned,
      isVipUser: conv.isVipUser,
      userCredits: conv.userCredits,
    }))
  }

  // Create a new conversation
  createConversation(
    userId: string,
    botId: string,
    initialStatus: ConversationStatus = "active",
  ): ConversationMetadata {
    const conversationId = `${userId}-${botId}`
    const existing = this.conversations.get(conversationId)

    if (existing) {
      return existing
    }

    const newConversation: ConversationMetadata = {
      id: conversationId,
      userId,
      botId,
      status: initialStatus,
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

    this.conversations.set(conversationId, newConversation)

    // Notify about the new conversation
    this.notifyConversationCreated(newConversation)

    return newConversation
  }

  // Enhanced transfer conversation method with redirection tracking
  transferConversation(
    fromConversationId: string,
    toUserId: string,
    toBotId: string,
    context?: string,
    preserveUserStatus = true,
  ): { fromConversation: ConversationMetadata | undefined; toConversation: ConversationMetadata } {
    const fromConversation = this.conversations.get(fromConversationId)
    const toConversationId = `${toUserId}-${toBotId}`

    // Create or get the target conversation
    let toConversation = this.conversations.get(toConversationId)

    if (!toConversation) {
      toConversation = this.createConversation(toUserId, toBotId)

      // Copy user status if applicable and requested
      if (fromConversation && preserveUserStatus) {
        toConversation.isVipUser = fromConversation.isVipUser
        toConversation.userCredits = fromConversation.userCredits
      }
    }

    // Update the target conversation
    toConversation.updatedAt = new Date()
    toConversation.lastMessageAt = new Date()
    toConversation.messageCount += 1 // For the system transfer message

    // Update the source conversation if it exists
    if (fromConversation) {
      fromConversation.updatedAt = new Date()
      fromConversation.lastMessageAt = new Date()
      fromConversation.messageCount += 1 // For the system transfer message

      // Add metadata about the redirection
      if (!fromConversation.metadata) {
        fromConversation.metadata = {}
      }

      if (!fromConversation.metadata.redirections) {
        fromConversation.metadata.redirections = []
      }

      // Add this redirection to the metadata
      fromConversation.metadata.redirections.push({
        targetConversationId: toConversationId,
        redirectedAt: new Date(),
        context: context || "Admin initiated redirection",
      })
    }

    // Track redirection history
    if (!this.redirectionHistory.has(fromConversationId)) {
      this.redirectionHistory.set(fromConversationId, [])
    }
    this.redirectionHistory.get(fromConversationId)?.push(toConversationId)

    // Add reference to the source conversation in the target
    if (!toConversation.metadata) {
      toConversation.metadata = {}
    }

    toConversation.metadata.redirectedFrom = fromConversationId
    toConversation.metadata.redirectedAt = new Date()
    toConversation.metadata.redirectionContext = context

    this.conversations.set(toConversationId, toConversation)

    return {
      fromConversation,
      toConversation,
    }
  }

  // Get the source conversation for a redirected conversation
  getRedirectionSource(conversationId: string): ConversationMetadata | undefined {
    const conversation = this.conversations.get(conversationId)
    if (!conversation || !conversation.metadata?.redirectedFrom) {
      return undefined
    }

    return this.conversations.get(conversation.metadata.redirectedFrom)
  }

  // Get all related conversations (source and redirected)
  getRelatedConversations(conversationId: string): ConversationMetadata[] {
    const result: ConversationMetadata[] = []
    const conversation = this.conversations.get(conversationId)

    if (!conversation) return result

    // Add the current conversation
    result.push(conversation)

    // Add the source conversation if this is a redirected conversation
    const source = this.getRedirectionSource(conversationId)
    if (source) {
      result.push(source)
    }

    // Add all conversations this one was redirected to
    const redirected = this.getRedirectionHistory(conversationId)
    for (const redirId of redirected) {
      const redirConv = this.conversations.get(redirId)
      if (redirConv) {
        result.push(redirConv)
      }
    }

    return result
  }
}

// Create a singleton instance
export const conversationService = new ConversationService()
