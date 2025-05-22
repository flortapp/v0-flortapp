export type ConversationStatus = "active" | "pending" | "escalated" | "resolved"
export type EscalationReason = "no_template" | "keyword" | "message_count" | "admin"
export type ConversationPriority = "low" | "medium" | "high"

export interface Conversation {
  id: string
  userId: string
  botId: string
  status: ConversationStatus
  startedAt: string
  lastMessageAt: string
  messageCount: number
  userMessageCount: number
  botMessageCount: number
  matchScore: number // 0-100 arası eşleşme skoru
  escalatedAt?: string
  escalatedReason?: EscalationReason
  resolvedAt?: string
  resolvedBy?: string
  priority: ConversationPriority
}

export interface ConversationMetadata {
  id: string
  userId: string
  botId: string
  status: ConversationStatus
  createdAt: Date
  updatedAt: Date
  lastMessageAt: Date
  messageCount: number
  userMessageCount?: number
  botMessageCount?: number
  hasUnreadMessages?: boolean
  isPinned?: boolean
  isArchived?: boolean
  isVipUser?: boolean
  userCredits?: number
}
