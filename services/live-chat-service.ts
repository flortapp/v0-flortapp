import type { Bot } from "@/types/bot"
import type { Message } from "@/types/message"

// In a real app, this would interact with an API
export class LiveChatService {
  // Get all active bots
  async getActiveBots(): Promise<Bot[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock data
    return [
      {
        id: "1",
        name: "Sophia",
        avatar: "/abstract-geometric-shapes.png?height=40&width=40&query=Sophia",
        status: "active",
        personality: "friendly",
        specialties: ["general conversation", "customer support"],
      },
      {
        id: "2",
        name: "Alex",
        avatar: "/abstract-geometric-shapes.png?height=40&width=40&query=Alex",
        status: "active",
        personality: "professional",
        specialties: ["technical support", "product information"],
      },
      {
        id: "3",
        name: "Emma",
        avatar: "/abstract-geometric-shapes.png?height=40&width=40&query=Emma",
        status: "active",
        personality: "empathetic",
        specialties: ["emotional support", "relationship advice"],
      },
      {
        id: "4",
        name: "David",
        avatar: "/abstract-geometric-shapes.png?height=40&width=40&query=David",
        status: "active",
        personality: "analytical",
        specialties: ["data analysis", "financial advice"],
      },
    ]
  }

  // Get bot by ID
  async getBotById(botId: string): Promise<Bot | null> {
    // If botId is "random", return a random bot
    if (botId === "random") {
      return this.getRandomActiveBot()
    }

    const activeBots = await this.getActiveBots()
    return activeBots.find((bot) => bot.id === botId) || null
  }

  // Randomly select an active bot
  async getRandomActiveBot(): Promise<Bot | null> {
    const activeBots = await this.getActiveBots()

    if (activeBots.length === 0) {
      return null
    }

    const randomIndex = Math.floor(Math.random() * activeBots.length)
    return activeBots[randomIndex]
  }

  // Get conversation history
  async getConversationHistory(conversationId: string): Promise<Message[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock data
    return [
      {
        id: "1",
        sender: "bot",
        content: "Merhaba! Size nasıl yardımcı olabilirim?",
        time: new Date(Date.now() - 60000).toLocaleString("tr-TR"),
        read: true,
      },
      {
        id: "2",
        sender: "user",
        content: "Hesabımla ilgili bir sorunum var.",
        time: new Date(Date.now() - 30000).toLocaleString("tr-TR"),
        read: true,
      },
    ]
  }

  // Create a new conversation
  async createConversation(userId: string, botId: string, isVip = false): Promise<string> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generate a unique conversation ID
    const conversationId = `live-${userId}-${botId}-${Date.now()}`

    // In a real app, this would create a conversation in the database
    console.log(`Creating new conversation: ${conversationId} (VIP: ${isVip})`)

    return conversationId
  }

  // Enhanced transfer conversation method
  async transferConversation(
    conversationId: string,
    botId: string,
    messages: Message[] = [],
    preserveContext = true,
  ): Promise<string> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate a new conversation ID for the transfer
    const newConversationId = `transfer-${conversationId}-${botId}-${Date.now()}`

    // In a real app, this would update the conversation status in the database
    console.log(`Transferring conversation ${conversationId} to bot ${botId} with new ID: ${newConversationId}`)

    // Log transferred messages for debugging
    if (messages.length > 0 && preserveContext) {
      console.log(`Transferring ${messages.length} messages to the new conversation`)
    } else {
      console.log(`Creating new conversation without context transfer`)
    }

    return newConversationId
  }

  // Send message
  async sendMessage(conversationId: string, message: Omit<Message, "id" | "time" | "read">): Promise<Message> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    // In a real app, this would send the message to the API
    return {
      ...message,
      id: Date.now().toString(),
      time: new Date().toLocaleString("tr-TR"),
      read: false,
    }
  }

  // Get bot response for redirected conversation
  async getBotResponseForRedirection(botId: string, context = ""): Promise<string> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get the bot to personalize the response
    const bot = await this.getBotById(botId)

    if (!bot) {
      return "Merhaba! Konuşmanız bana yönlendirildi. Size nasıl yardımcı olabilirim?"
    }

    // Personalized responses based on bot personality
    const responses: Record<string, string[]> = {
      friendly: [
        `Merhaba! Ben ${bot.name}, konuşmanız bana yönlendirildi. Size nasıl yardımcı olabilirim?`,
        `Selam! ${bot.name} olarak konuşmanızı devraldım. Bugün size nasıl yardımcı olabilirim?`,
        `Merhaba! Ben ${bot.name}, sizinle konuşmaktan mutluluk duyuyorum. Nasıl yardımcı olabilirim?`,
      ],
      professional: [
        `Merhaba, ben ${bot.name}. Konuşmanız bana yönlendirildi. Size profesyonel destek sağlamak için buradayım.`,
        `İyi günler, ben ${bot.name}. Konuşmanızı inceledim ve size yardımcı olmaya hazırım.`,
        `Merhaba, ${bot.name} olarak size yardımcı olmak için buradayım. Nasıl destek olabilirim?`,
      ],
      empathetic: [
        `Merhaba, ben ${bot.name}. Konuşmanız bana yönlendirildi. Endişelerinizi dinlemek ve size yardımcı olmak için buradayım.`,
        `Selam! Ben ${bot.name}, konuşmanızı devraldım. Nasıl hissediyorsunuz? Size nasıl yardımcı olabilirim?`,
        `Merhaba! ${bot.name} olarak sizinle konuşmaktan mutluluk duyuyorum. Sizi dinliyorum.`,
      ],
      analytical: [
        `Merhaba, ben ${bot.name}. Konuşmanız bana yönlendirildi. Sorununuzu analiz etmek ve çözüm bulmak için buradayım.`,
        `İyi günler, ben ${bot.name}. Konuşmanızı inceledim ve detaylı bir analiz yapabilirim. Nasıl yardımcı olabilirim?`,
        `Merhaba, ${bot.name} olarak size yardımcı olmak için buradayım. Sorununuzu detaylı bir şekilde anlatabilir misiniz?`,
      ],
    }

    // Default to friendly if personality not found
    const personalityType = bot.personality || "friendly"
    const personalizedResponses = responses[personalityType] || responses.friendly

    return personalizedResponses[Math.floor(Math.random() * personalizedResponses.length)]
  }
}

// Create a singleton instance
export const liveChatService = new LiveChatService()
