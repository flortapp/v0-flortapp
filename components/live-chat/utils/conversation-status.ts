// Konuşma durumu yönetimi için yardımcı fonksiyonlar

export interface Message {
  id: string
  sender: "user" | "bot" | "system"
  content: string
  time: string
  read: boolean
}

export interface Conversation {
  userId: string
  botId: string
  lastUpdated: Date
  hasUnreadMessages: boolean
  lastMessageFrom: "user" | "bot" | "system" | null
}

// Konuşma durumunu belirleyen fonksiyon
export function determineConversationStatus(messages: Message[]): {
  hasUnreadMessages: boolean
  lastMessageFrom: "user" | "bot" | "system" | null
} {
  if (!messages || messages.length === 0) {
    return { hasUnreadMessages: false, lastMessageFrom: null }
  }

  // Mesajları tarih sırasına göre sırala (en yenisi son)
  const sortedMessages = [...messages].sort((a, b) => {
    const dateA = new Date(a.time.replace(/(\d+)\s+(\w+)\s+(\d+)\s+\/\s+(\d+):(\d+)/, "$3-$2-$1 $4:$5"))
    const dateB = new Date(b.time.replace(/(\d+)\s+(\w+)\s+(\d+)\s+\/\s+(\d+):(\d+)/, "$3-$2-$1 $4:$5"))
    return dateA.getTime() - dateB.getTime()
  })

  // En son mesajı al
  const lastMessage = sortedMessages[sortedMessages.length - 1]

  // Okunmamış bot mesajı var mı kontrol et
  const hasUnreadBotMessages = sortedMessages.some((msg) => msg.sender === "bot" && !msg.read)

  return {
    hasUnreadMessages: hasUnreadBotMessages,
    lastMessageFrom: lastMessage.sender,
  }
}

// Konuşma durumunu güncelleyen fonksiyon
export function updateConversationStatus(
  conversations: Record<string, Conversation>,
  userId: string,
  botId: string,
  messages: Message[],
): Record<string, Conversation> {
  const conversationId = `${userId}-${botId}`
  const status = determineConversationStatus(messages)

  return {
    ...conversations,
    [conversationId]: {
      userId,
      botId,
      lastUpdated: new Date(),
      hasUnreadMessages: status.hasUnreadMessages,
      lastMessageFrom: status.lastMessageFrom,
    },
  }
}

// Mesaj okundu olarak işaretleyen fonksiyon
export function markMessagesAsRead(messages: Message[], sender: "user" | "bot" | "system" | null = null): Message[] {
  if (!messages || messages.length === 0) {
    return messages
  }

  return messages.map((msg) => {
    // Belirli bir gönderen belirtilmişse sadece o gönderenin mesajlarını işaretle
    if (sender && msg.sender !== sender) {
      return msg
    }

    return { ...msg, read: true }
  })
}
