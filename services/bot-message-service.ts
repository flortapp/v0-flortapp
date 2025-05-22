export type MessageType = "greeting" | "chat" | "zeroJeton"

// Varsayılan şablonları yönetmek için servis
class BotMessageTemplateService {
  private templates: Record<MessageType, string[]> = {
    greeting: [
      "Merhaba {user_name}! Ben {bot_name}, nasılsın?",
      "Selam {user_name}! Bugün nasıl geçiyor?",
      "Hey {user_name}! Tanıştığımıza memnun oldum. Ben {bot_name}.",
    ],
    chat: [
      "Bu çok ilginç, devam et lütfen.",
      "Gerçekten mi? Daha fazla detay verebilir misin?",
      "Bunu duyduğuma üzüldüm. Nasıl hissediyorsun?",
    ],
    zeroJeton: [
      "Jetonların bitti {user_name}. Daha fazla konuşmak için jeton satın almalısın.",
      "Üzgünüm, jetonların tükendi. Konuşmaya devam etmek için jeton yükleyebilirsin.",
    ],
  }

  // Varsayılan şablonları al
  getDefaultTemplates(messageType: MessageType): string[] {
    return this.templates[messageType] || []
  }

  // Varsayılan şablonları güncelle
  updateDefaultTemplates(messageType: MessageType, templates: string[]): void {
    this.templates[messageType] = templates
  }

  // Şablonu değişkenlerle doldur
  fillTemplate(template: string, variables: Record<string, string>): string {
    let filledTemplate = template

    for (const [key, value] of Object.entries(variables)) {
      filledTemplate = filledTemplate.replace(new RegExp(`{${key}}`, "g"), value)
    }

    return filledTemplate
  }
}

// Bot mesajlarını yönetmek için servis
class BotMessageService {
  private templateService: BotMessageTemplateService
  private botMessages: Record<string, Record<MessageType, string[]>> = {}

  constructor() {
    this.templateService = new BotMessageTemplateService()
  }

  // Bot mesajlarını al
  async getBotMessages(botId: string, messageType: MessageType): Promise<string[]> {
    // Eğer bot için özel mesajlar varsa onları döndür
    if (this.botMessages[botId]?.[messageType]) {
      return this.botMessages[botId][messageType]
    }

    // Yoksa varsayılan şablonları döndür
    return this.templateService.getDefaultTemplates(messageType)
  }

  // Bot mesajlarını kaydet
  async saveBotMessages(botId: string, messageType: MessageType, messages: string[]): Promise<void> {
    if (!this.botMessages[botId]) {
      this.botMessages[botId] = {
        greeting: [],
        chat: [],
        zeroJeton: [],
      }
    }

    this.botMessages[botId][messageType] = messages
  }

  // Bot için rastgele bir mesaj al
  async getRandomBotMessage(
    botId: string,
    messageType: MessageType,
    variables: Record<string, string> = {},
  ): Promise<string> {
    const messages = await this.getBotMessages(botId, messageType)

    if (messages.length === 0) {
      return "Mesaj bulunamadı."
    }

    const randomIndex = Math.floor(Math.random() * messages.length)
    const template = messages[randomIndex]

    return this.templateService.fillTemplate(template, variables)
  }

  // Varsayılan şablonları güncelle
  async updateDefaultTemplates(messageType: MessageType, templates: string[]): Promise<void> {
    this.templateService.updateDefaultTemplates(messageType, templates)
  }

  // Varsayılan şablonları al
  async getDefaultTemplates(messageType: MessageType): Promise<string[]> {
    return this.templateService.getDefaultTemplates(messageType)
  }
}

// Singleton olarak dışa aktar
export const botMessageService = new BotMessageService()
