export type ConversationStatus = "active" | "pending" | "resolved" | "transferred"
export type ConversationPriority = "low" | "medium" | "high"

export interface Message {
  id: string
  conversationId: string
  content: string
  sender: "user" | "bot" | "admin"
  timestamp: string
  metadata?: {
    isRead?: boolean
    attachments?: string[]
  }
}

export interface Conversation {
  id: string
  userId: string
  botId: string
  status: ConversationStatus
  priority: ConversationPriority
  createdAt: string
  updatedAt: string
  lastMessageAt: string
  transferredAt?: string
  messages: Message[]
  metadata?: {
    tags?: string[]
    notes?: string
  }
}

export interface ConversationMetadata {
  id: string
  userId: string
  botId: string
  status: ConversationStatus
  priority: ConversationPriority
  createdAt: string
  updatedAt: string
  lastMessageAt: string
  transferredAt?: string
  messageCount: number
  metadata?: {
    tags?: string[]
    notes?: string
  }
}
