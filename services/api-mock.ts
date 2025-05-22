// Mock API service to simulate backend responses
import type { Bot } from "@/types/bot"
import type { Conversation } from "@/types/conversation"
import type { Message } from "@/types/message"
import type { User } from "@/types/user"
import type { Match } from "@/types/match"

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper to get a past date
const getPastDate = (daysAgo: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

// Helper to generate a random ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15)
}

// Helper to calculate match score based on common interests
const calculateMatchScore = (userInterests: string[], botInterests: string[]): number => {
  if (!userInterests.length || !botInterests.length) return 0

  const commonInterests = userInterests.filter((interest) => botInterests.includes(interest))

  return Math.round((commonInterests.length / Math.max(userInterests.length, botInterests.length)) * 100)
}

// Common interests for matching
const allInterests = ["Seyahat", "Yemek", "Yürüyüş", "Yoga", "Oyunlar", "Filmler", "Kitaplar", "Hayvanlar", "Şarap"]

// Dışa aktarma için ekleme yapıyoruz
export { allInterests }

// Mock data storage
const mockData = {
  users: [] as User[],
  bots: [] as Bot[],
  conversations: [] as Conversation[],
  messages: [] as Message[],
  matches: [] as Match[],
}

// Initialize with sample data
const initializeMockData = () => {
  // Sample users with randomized registration dates
  mockData.users = [
    {
      id: "user-1",
      name: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      avatar: "/abstract-geometric-shapes.png?height=200&width=200&query=male user",
      status: "active",
      createdAt: "2025-01-05T00:00:00.000Z", // 5 Ocak 2025
      lastActive: getPastDate(1),
      isVip: true,
      credits: 500,
      location: "İstanbul",
      birthDate: "1990-05-15",
      interests: ["Seyahat", "Filmler", "Oyunlar", "Yürüyüş"],
      online: true,
      gender: "male",
      age: 32,
      registrationMethod: "google",
    },
    {
      id: "user-2",
      name: "Zeynep Kaya",
      email: "zeynep@example.com",
      avatar: "/abstract-geometric-shapes.png?height=200&width=200&query=female user",
      status: "active",
      createdAt: "2025-01-12T00:00:00.000Z", // 12 Ocak 2025
      lastActive: getPastDate(2),
      isVip: false,
      credits: 100,
      location: "Ankara",
      birthDate: "1995-08-20",
      interests: ["Kitaplar", "Yoga", "Filmler", "Şarap"],
      online: false,
      gender: "female",
      age: 28,
      registrationMethod: "apple",
    },
    {
      id: "user-3",
      name: "Mehmet Demir",
      email: "mehmet@example.com",
      avatar: "/abstract-geometric-shapes.png?height=200&width=200&query=male user beard",
      status: "active",
      createdAt: "2025-01-03T00:00:00.000Z", // 3 Ocak 2025
      lastActive: getPastDate(3),
      isVip: false,
      credits: 50,
      location: "İzmir",
      birthDate: "1988-12-10",
      interests: ["Yürüyüş", "Yoga", "Yemek", "Seyahat"],
      online: true,
      gender: "male",
      age: 35,
      registrationMethod: "phone:05051231231212",
    },
    {
      id: "user-4",
      name: "Ayşe Şahin",
      email: "ayse@example.com",
      avatar: "/abstract-geometric-shapes.png?height=200&width=200&query=female user brunette",
      status: "blocked",
      createdAt: "2025-01-18T00:00:00.000Z", // 18 Ocak 2025
      lastActive: getPastDate(10),
      isVip: false,
      credits: 0,
      location: "Bursa",
      birthDate: "1992-03-25",
      interests: ["Hayvanlar", "Filmler", "Yemek", "Seyahat"],
      online: false,
      gender: "female",
      age: 31,
      registrationMethod: "guest-1",
    },
    {
      id: "user-5",
      name: "Can Yıldız",
      email: "can@example.com",
      avatar: "/abstract-geometric-shapes.png?height=200&width=200&query=male user glasses",
      status: "active",
      createdAt: "2025-01-08T00:00:00.000Z", // 8 Ocak 2025
      lastActive: getPastDate(5),
      isVip: true,
      credits: 1000,
      location: "Antalya",
      birthDate: "1985-07-30",
      interests: ["Seyahat", "Yürüyüş", "Hayvanlar", "Şarap"],
      online: false,
      gender: "male",
      age: 38,
      registrationMethod: "google",
    },
  ]

  // Sample bots - Türkçe kadın isimleri ile güncellendi
  mockData.bots = [
    {
      id: "bot-1",
      name: "Zehra",
      avatar: "/abstract-geometric-shapes.png?height=200&width=200&query=female avatar",
      status: "active",
      createdAt: getPastDate(60),
      interests: ["Seyahat", "Yemek", "Filmler", "Kitaplar"],
      age: 28,
      location: "İstanbul",
      bio: "Merhaba, ben Zehra! Seyahat etmeyi ve yeni yerler keşfetmeyi çok seviyorum. Fotoğraf çekmek ve müzik dinlemek en büyük tutkularım.",
      relationshipGoal: "flört",
      messageTemplates: {
        greeting: [
          "Merhaba! Profilini inceledim ve ilgi alanlarımızın benzer olduğunu fark ettim. Nasılsın?",
          "Selam! Senin de [interest] ile ilgilendiğini gördüm. Bu konuda ne düşünüyorsun?",
          "Merhaba! [location] hakkında bilgi sahibi misin? Orayı çok merak ediyorum.",
        ],
        chat: [
          "Benim en sevdiğim [interest] aktivitesi [activity]. Sen de sever misin?",
          "Son zamanlarda [interest] ile ilgili yeni bir şey keşfettin mi?",
          "Bana biraz kendinden bahseder misin? Nelerden hoşlanırsın?",
        ],
        zeroCredit: [
          "Görüşmek isterdim ama jetonların bitmiş gibi görünüyor. Jeton yükleyip konuşmaya devam edebiliriz.",
          "Sohbetimizi sürdürmek için jeton yüklemen gerekiyor. Bekliyorum!",
          "Jetonların bitmiş. Biraz daha sohbet etmek için jeton yükleyebilirsin.",
        ],
      },
    },
    {
      id: "bot-2",
      name: "Elif",
      avatar: "/abstract-geometric-shapes.png?height=200&width=200&query=female avatar brunette",
      status: "active",
      createdAt: getPastDate(55),
      interests: ["Kitaplar", "Yemek", "Şarap", "Filmler"],
      age: 32,
      location: "Ankara",
      bio: "Merhaba, ben Elif! Kitap okumayı, müzik dinlemeyi ve sanat eserleri hakkında konuşmayı çok severim. Teknoloji ile de yakından ilgileniyorum.",
      relationshipGoal: "serious",
      messageTemplates: {
        greeting: [
          "Merhaba! Profilinde [interest] ile ilgilendiğini gördüm. Ben de bu konuya bayılırım!",
          "Selam! [location]'da yaşıyorsun demek. Orayı çok merak ediyorum.",
          "Merhaba! Senin de benim gibi [interest] sevdiğini görmek harika.",
        ],
        chat: [
          "Son okuduğun kitap neydi? Ben şu anda [book] okuyorum ve çok etkileyici buluyorum.",
          "Favori müzik türün nedir? Ben genellikle [music_genre] dinlemeyi tercih ediyorum.",
          "Sanat hakkında ne düşünüyorsun? Favori bir sanatçın var mı?",
        ],
        zeroCredit: [
          "Sohbetimize devam etmek için jeton yüklemen gerekiyor. Seninle konuşmak çok keyifli!",
          "Jetonların bitmiş görünüyor. Biraz daha sohbet etmek için jeton yükleyebilirsin.",
          "Görüşmek isterdim ama jetonların bitmiş. Jeton yükleyip konuşmaya devam edebiliriz.",
        ],
      },
    },
    {
      id: "bot-3",
      name: "Aylin",
      avatar: "/abstract-geometric-shapes.png?height=200&width=200&query=female avatar blonde",
      status: "inactive",
      createdAt: getPastDate(50),
      interests: ["Yoga", "Yürüyüş", "Hayvanlar", "Seyahat"],
      age: 26,
      location: "İzmir",
      bio: "Merhaba, ben Aylin! Dans etmeyi, yoga yapmayı ve meditasyon ile zihnimizi sakinleştirmeyi seviyorum. Sağlıklı bir yaşam tarzını benimsiyorum.",
      relationshipGoal: "friendship",
      messageTemplates: {
        greeting: [
          "Merhaba! Profilinde [interest] ile ilgilendiğini gördüm. Bu konuda ne kadar deneyimin var?",
          "Selam! Ben de senin gibi [interest] ile ilgileniyorum. Bu konuda konuşmak ister misin?",
          "Merhaba! [location]'da yaşamak nasıl bir duygu? Orayı çok merak ediyorum.",
        ],
        chat: [
          "Yoga yapmayı sever misin? Ben her sabah 20 dakika yoga yapıyorum ve kendimi çok daha iyi hissediyorum.",
          "Meditasyon hakkında ne düşünüyorsun? Bence zihin sağlığı için çok önemli.",
          "Sağlıklı beslenme konusunda nelere dikkat ediyorsun? Ben genellikle [diet] tarzı beslenmeyi tercih ediyorum.",
        ],
        zeroCredit: [
          "Seninle sohbet etmek çok keyifli ama jetonların bitmiş görünüyor. Jeton yükleyip devam edebiliriz.",
          "Jetonların bitmiş. Biraz daha sohbet etmek için jeton yükleyebilirsin.",
          "Görüşmek isterdim ama jetonların bitmiş. Jeton yükleyip konuşmaya devam edebiliriz.",
        ],
      },
    },
    {
      id: "bot-4",
      name: "Selin",
      avatar: "/abstract-geometric-shapes.png?height=200&width=200&query=female avatar sporty",
      status: "active",
      createdAt: getPastDate(45),
      interests: ["Yürüyüş", "Yoga", "Hayvanlar", "Seyahat"],
      age: 30,
      location: "Bursa",
      bio: "Merhaba, ben Selin! Spor yapmayı, fitness ile ilgilenmeyi ve doğada yürüyüşe çıkmayı çok seviyorum. Sağlıklı ve aktif bir yaşam tarzını benimsiyorum.",
      relationshipGoal: "casual",
      messageTemplates: {
        greeting: [
          "Merhaba! Profilinde [interest] ile ilgilendiğini gördüm. Bu konuda ne kadar aktifsin?",
          "Selam! [location]'da yaşıyorsun demek. Orada güzel yürüyüş rotaları var mı?",
          "Merhaba! Ben de senin gibi [interest] ile ilgileniyorum. Bu konuda konuşmak ister misin?",
        ],
        chat: [
          "Haftada kaç kez spor yapıyorsun? Ben genellikle haftada 4 gün antrenman yapıyorum.",
          "Doğada yürüyüş yapmayı sever misin? Bence doğayla iç içe olmak çok rahatlatıcı.",
          "Fitness konusunda nelere dikkat ediyorsun? Ben genellikle [workout] tarzı antrenmanları tercih ediyorum.",
        ],
        zeroCredit: [
          "Seninle sohbet etmek çok keyifli ama jetonların bitmiş görünüyor. Jeton yükleyip devam edebiliriz.",
          "Jetonların bitmiş. Biraz daha sohbet etmek için jeton yükleyebilirsin.",
          "Görüşmek isterdim ama jetonların bitmiş. Jeton yükleyip konuşmaya devam edebiliriz.",
        ],
      },
    },
    {
      id: "bot-5",
      name: "Defne",
      avatar: "/abstract-geometric-shapes.png?height=200&width=200&query=female avatar redhead",
      status: "active",
      createdAt: getPastDate(40),
      interests: ["Kitaplar", "Filmler", "Şarap", "Yemek"],
      age: 29,
      location: "Antalya",
      bio: "Merhaba, ben Defne! Psikoloji ve kişisel gelişim konularına çok ilgi duyuyorum. Kitap okumayı ve meditasyon yapmayı seviyorum.",
      relationshipGoal: "flört",
      messageTemplates: {
        greeting: [
          "Merhaba! Profilinde [interest] ile ilgilendiğini gördüm. Bu konu hakkında ne düşünüyorsun?",
          "Selam! [location]'da yaşamak nasıl bir duygu? Orayı çok merak ediyorum.",
          "Merhaba! Ben de senin gibi [interest] ile ilgileniyorum. Bu konuda konuşmak ister misin?",
        ],
        chat: [
          "Kişisel gelişim konusunda hangi kitapları okudun? Ben şu anda [book] okuyorum ve çok etkileyici buluyorum.",
          "Meditasyon yapıyor musun? Bence zihin sağlığı için çok önemli.",
          "Psikoloji hakkında ne düşünüyorsun? İnsan davranışlarını anlamak çok ilginç değil mi?",
        ],
        zeroCredit: [
          "Seninle sohbet etmek çok keyifli ama jetonların bitmiş görünüyor. Jeton yükleyip devam edebiliriz.",
          "Jetonların bitmiş. Biraz daha sohbet etmek için jeton yükleyebilirsin.",
          "Görüşmek isterdim ama jetonların bitmiş. Jeton yükleyip konuşmaya devam edebiliriz.",
        ],
      },
    },
  ]

  // Create matches based on interests
  mockData.matches = []
  mockData.users.forEach((user) => {
    mockData.bots.forEach((bot) => {
      // Calculate match score
      const score = calculateMatchScore(user.interests, bot.interests)

      // Only create match if score is above 0 (at least one common interest)
      if (score > 0) {
        const commonInterests = user.interests.filter((interest) => bot.interests.includes(interest))

        mockData.matches.push({
          id: `match-${user.id}-${bot.id}`,
          userId: user.id,
          botId: bot.id,
          score,
          createdAt: getPastDate(Math.floor(Math.random() * 30)),
          status: Math.random() > 0.3 ? "accepted" : "pending",
          commonInterests,
        })
      }
    })
  })

  // Create conversations for accepted matches
  mockData.conversations = []
  mockData.matches
    .filter((match) => match.status === "accepted")
    .forEach((match) => {
      mockData.conversations.push({
        id: `conv-${match.userId}-${match.botId}`,
        userId: match.userId,
        botId: match.botId,
        status: Math.random() > 0.8 ? "escalated" : "active",
        startedAt: getPastDate(Math.floor(Math.random() * 20)),
        lastMessageAt: getPastDate(Math.floor(Math.random() * 5)),
        messageCount: Math.floor(Math.random() * 30) + 5,
        userMessageCount: Math.floor(Math.random() * 15) + 2,
        botMessageCount: Math.floor(Math.random() * 15) + 2,
        matchScore: match.score,
        priority: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
        escalatedAt: Math.random() > 0.8 ? getPastDate(Math.floor(Math.random() * 3)) : undefined,
        escalatedReason: Math.random() > 0.8 ? (Math.random() > 0.5 ? "no_template" : "message_count") : undefined,
      })
    })

  // Create messages for each conversation
  mockData.messages = []
  mockData.conversations.forEach((conv) => {
    const user = mockData.users.find((u) => u.id === conv.userId)
    const bot = mockData.bots.find((b) => b.id === conv.botId)

    if (!user || !bot) return

    // System message to start conversation
    mockData.messages.push({
      id: generateId(),
      conversationId: conv.id,
      sender: "system",
      content: "Konuşma başlatıldı. Lütfen kişisel bilgilerinizi paylaşmaktan kaçının.",
      timestamp: conv.startedAt,
      read: true,
    })

    // Generate alternating messages
    const totalMessages = conv.messageCount - 1 // -1 for system message
    const userMessages = conv.userMessageCount
    const botMessages = conv.botMessageCount

    let userMessageCount = 0
    let botMessageCount = 0

    for (let i = 0; i < totalMessages; i++) {
      const isBotTurn = i % 2 === 1 || userMessageCount >= userMessages

      if (isBotTurn && botMessageCount < botMessages) {
        // Bot message
        const templates = i === 1 ? bot.messageTemplates.greeting : bot.messageTemplates.chat
        const template = templates[Math.floor(Math.random() * templates.length)]

        // Replace placeholders
        const content = template
          .replace("[interest]", user.interests[Math.floor(Math.random() * user.interests.length)])
          .replace("[location]", user.location || "şehrin")
          .replace("[activity]", "fotoğraf çekmek")
          .replace("[book]", "Sapiens")
          .replace("[music_genre]", "indie rock")
          .replace("[diet]", "akdeniz")
          .replace("[workout]", "HIIT")

        mockData.messages.push({
          id: generateId(),
          conversationId: conv.id,
          sender: "bot",
          content,
          timestamp: new Date(new Date(conv.startedAt).getTime() + (i + 1) * 3600000).toISOString(),
          read: true,
          templateId: `template-${i}`,
          creditCost: 0,
        })

        botMessageCount++
      } else if (userMessageCount < userMessages) {
        // User message
        mockData.messages.push({
          id: generateId(),
          conversationId: conv.id,
          sender: "user",
          content: `Bu bir örnek kullanıcı mesajıdır. Mesaj #${userMessageCount + 1}`,
          timestamp: new Date(new Date(conv.startedAt).getTime() + (i + 1) * 3600000).toISOString(),
          read: true,
          creditCost: Math.floor(Math.random() * 5) + 1,
        })

        userMessageCount++
      }
    }

    // Add zero credit message if user has no credits
    if (user.credits === 0) {
      const template =
        bot.messageTemplates.zeroCredit[Math.floor(Math.random() * bot.messageTemplates.zeroCredit.length)]

      mockData.messages.push({
        id: generateId(),
        conversationId: conv.id,
        sender: "bot",
        content: template,
        timestamp: new Date(new Date(conv.lastMessageAt).getTime() + 3600000).toISOString(),
        read: false,
        templateId: "zero-credit",
        creditCost: 0,
      })
    }
  })
}

// Initialize mock data
initializeMockData()

// Mock API endpoints
export const mockApi = {
  // User endpoints
  users: {
    getAll: async () => {
      await delay(300)
      return { data: mockData.users }
    },
    getById: async (id: string) => {
      await delay(200)
      const user = mockData.users.find((u) => u.id === id)
      if (!user) throw new Error("User not found")
      return { data: user }
    },
    create: async (userData: Partial<User>) => {
      await delay(400)
      const newUser = {
        id: `user-${mockData.users.length + 1}`,
        name: userData.name || "New User",
        email: userData.email || "new@example.com",
        avatar: userData.avatar || "/abstract-geometric-shapes.png?height=200&width=200&query=new user",
        status: userData.status || "active",
        createdAt: "2025-01-01T00:00:00.000Z",
        isVip: userData.isVip || false,
        credits: userData.credits || 0,
        interests: userData.interests || [],
        online: false,
        gender: userData.gender || "other",
        age: userData.age || 30,
        registrationMethod: userData.registrationMethod || "guest",
      } as User

      mockData.users.push(newUser)
      return { data: newUser }
    },
    update: async (id: string, userData: Partial<User>) => {
      await delay(300)
      const index = mockData.users.findIndex((u) => u.id === id)
      if (index === -1) throw new Error("User not found")

      mockData.users[index] = { ...mockData.users[index], ...userData }
      return { data: mockData.users[index] }
    },
    delete: async (id: string) => {
      await delay(500)
      const index = mockData.users.findIndex((u) => u.id === id)
      if (index === -1) throw new Error("User not found")

      mockData.users.splice(index, 1)
      return { success: true }
    },
  },

  // Bot endpoints
  bots: {
    getAll: async () => {
      await delay(300)
      return { data: mockData.bots }
    },
    getById: async (id: string) => {
      await delay(200)
      const bot = mockData.bots.find((b) => b.id === id)
      if (!bot) throw new Error("Bot not found")
      return { data: bot }
    },
    create: async (botData: Partial<Bot>) => {
      await delay(400)
      const newBot = {
        id: `bot-${mockData.bots.length + 1}`,
        name: botData.name || "Yeni Bot",
        avatar: botData.avatar || "/abstract-geometric-shapes.png?height=200&width=200&query=female avatar",
        status: botData.status || "active",
        createdAt: new Date().toISOString(),
        interests: botData.interests || [],
        age: botData.age || 28,
        bio: botData.bio || "Henüz bir biyografi eklenmedi.",
        relationshipGoal: botData.relationshipGoal || "flört",
        messageTemplates: botData.messageTemplates || {
          greeting: ["Merhaba!"],
          chat: ["Nasılsın?"],
          zeroCredit: ["Jetonların bitti."],
        },
      } as Bot

      mockData.bots.push(newBot)
      return { data: newBot }
    },
    update: async (id: string, botData: Partial<Bot>) => {
      await delay(300)
      const index = mockData.bots.findIndex((b) => b.id === id)
      if (index === -1) throw new Error("Bot not found")

      mockData.bots[index] = { ...mockData.bots[index], ...botData }
      return { data: mockData.bots[index] }
    },
    delete: async (id: string) => {
      await delay(500)
      const index = mockData.bots.findIndex((b) => b.id === id)
      if (index === -1) throw new Error("Bot not found")

      mockData.bots.splice(index, 1)
      return { success: true }
    },
    getActiveCount: async () => {
      await delay(200)
      return { data: mockData.bots.filter((b) => b.status === "active").length }
    },
    getStats: async () => {
      await delay(300)
      return {
        data: {
          total: mockData.bots.length,
          active: mockData.bots.filter((b) => b.status === "active").length,
          inactive: mockData.bots.filter((b) => b.status === "inactive").length,
          averageMatchScore: Math.round(
            mockData.matches.reduce((sum, match) => sum + match.score, 0) / mockData.matches.length,
          ),
        },
      }
    },
  },

  // Conversation endpoints
  conversations: {
    getAll: async () => {
      await delay(300)
      return { data: mockData.conversations }
    },
    getById: async (id: string) => {
      await delay(200)
      const conversation = mockData.conversations.find((c) => c.id === id)
      if (!conversation) throw new Error("Conversation not found")
      return { data: conversation }
    },
    getByUserId: async (userId: string) => {
      await delay(300)
      const conversations = mockData.conversations.filter((c) => c.userId === userId)
      return { data: conversations }
    },
    getByBotId: async (botId: string) => {
      await delay(300)
      const conversations = mockData.conversations.filter((c) => c.botId === botId)
      return { data: conversations }
    },
    getByStatus: async (status: string) => {
      await delay(300)
      const conversations = mockData.conversations.filter((c) => c.status === status)
      return { data: conversations }
    },
    create: async (conversationData: Partial<Conversation>) => {
      await delay(400)
      const newConversation = {
        id: `conv-${conversationData.userId}-${conversationData.botId}`,
        userId: conversationData.userId || "",
        botId: conversationData.botId || "",
        status: conversationData.status || "active",
        startedAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        messageCount: 0,
        userMessageCount: 0,
        botMessageCount: 0,
        matchScore: conversationData.matchScore || 0,
        priority: conversationData.priority || "medium",
      } as Conversation

      mockData.conversations.push(newConversation)

      // Create initial system message
      mockData.messages.push({
        id: generateId(),
        conversationId: newConversation.id,
        sender: "system",
        content: "Konuşma başlatıldı. Lütfen kişisel bilgilerinizi paylaşmaktan kaçının.",
        timestamp: newConversation.startedAt,
        read: true,
      })

      return { data: newConversation }
    },
    update: async (id: string, conversationData: Partial<Conversation>) => {
      await delay(300)
      const index = mockData.conversations.findIndex((c) => c.id === id)
      if (index === -1) throw new Error("Conversation not found")

      mockData.conversations[index] = { ...mockData.conversations[index], ...conversationData }
      return { data: mockData.conversations[index] }
    },
    delete: async (id: string) => {
      await delay(500)
      const index = mockData.conversations.findIndex((c) => c.id === id)
      if (index === -1) throw new Error("Conversation not found")

      // Delete all messages for this conversation
      const messagesToDelete = mockData.messages.filter((m) => m.conversationId === id)
      messagesToDelete.forEach((message) => {
        const messageIndex = mockData.messages.findIndex((m) => m.id === message.id)
        if (messageIndex !== -1) {
          mockData.messages.splice(messageIndex, 1)
        }
      })

      mockData.conversations.splice(index, 1)
      return { success: true }
    },
    escalate: async (id: string, reason: string) => {
      await delay(300)
      const index = mockData.conversations.findIndex((c) => c.id === id)
      if (index === -1) throw new Error("Conversation not found")

      mockData.conversations[index] = {
        ...mockData.conversations[index],
        status: "escalated",
        escalatedAt: new Date().toISOString(),
        escalatedReason: reason as any,
      }

      return { data: mockData.conversations[index] }
    },
    resolve: async (id: string) => {
      await delay(300)
      const index = mockData.conversations.findIndex((c) => c.id === id)
      if (index === -1) throw new Error("Conversation not found")

      mockData.conversations[index] = {
        ...mockData.conversations[index],
        status: "resolved",
      }

      return { data: mockData.conversations[index] }
    },
    getStats: async () => {
      await delay(300)
      return {
        data: {
          total: mockData.conversations.length,
          active: mockData.conversations.filter((c) => c.status === "active").length,
          escalated: mockData.conversations.filter((c) => c.status === "escalated").length,
          resolved: mockData.conversations.filter((c) => c.status === "resolved").length,
          averageMessages: Math.round(
            mockData.conversations.reduce((sum, conv) => sum + conv.messageCount, 0) / mockData.conversations.length,
          ),
        },
      }
    },
  },

  // Message endpoints
  messages: {
    getAll: async () => {
      await delay(300)
      return { data: mockData.messages }
    },
    getById: async (id: string) => {
      await delay(200)
      const message = mockData.messages.find((m) => m.id === id)
      if (!message) throw new Error("Message not found")
      return { data: message }
    },
    getByConversationId: async (conversationId: string) => {
      await delay(300)
      const messages = mockData.messages.filter((m) => m.conversationId === conversationId)
      return { data: messages }
    },
    create: async (messageData: Partial<Message>) => {
      await delay(400)
      const newMessage = {
        id: generateId(),
        conversationId: messageData.conversationId || "",
        sender: messageData.sender || "system",
        content: messageData.content || "",
        timestamp: new Date().toISOString(),
        read: false,
        creditCost: messageData.sender === "user" ? 1 : 0,
      } as Message

      mockData.messages.push(newMessage)

      // Update conversation
      const conversationIndex = mockData.conversations.findIndex((c) => c.id === newMessage.conversationId)
      if (conversationIndex !== -1) {
        mockData.conversations[conversationIndex].lastMessageAt = newMessage.timestamp
        mockData.conversations[conversationIndex].messageCount += 1

        if (newMessage.sender === "user") {
          mockData.conversations[conversationIndex].userMessageCount += 1
        } else if (newMessage.sender === "bot") {
          mockData.conversations[conversationIndex].botMessageCount += 1
        }
      }

      return { data: newMessage }
    },
    update: async (id: string, messageData: Partial<Message>) => {
      await delay(300)
      const index = mockData.messages.findIndex((m) => m.id === id)
      if (index === -1) throw new Error("Message not found")

      mockData.messages[index] = { ...mockData.messages[index], ...messageData }
      return { data: mockData.messages[index] }
    },
    delete: async (id: string) => {
      await delay(500)
      const index = mockData.messages.findIndex((m) => m.id === id)
      if (index === -1) throw new Error("Message not found")

      const message = mockData.messages[index]

      // Update conversation
      const conversationIndex = mockData.conversations.findIndex((c) => c.id === message.conversationId)
      if (conversationIndex !== -1) {
        mockData.conversations[conversationIndex].messageCount -= 1

        if (message.sender === "user") {
          mockData.conversations[conversationIndex].userMessageCount -= 1
        } else if (message.sender === "bot") {
          mockData.conversations[conversationIndex].botMessageCount -= 1
        }
      }

      mockData.messages.splice(index, 1)
      return { success: true }
    },
    markAsRead: async (id: string) => {
      await delay(200)
      const index = mockData.messages.findIndex((m) => m.id === id)
      if (index === -1) throw new Error("Message not found")

      mockData.messages[index].read = true
      return { data: mockData.messages[index] }
    },
  },

  // Match endpoints
  matches: {
    getAll: async () => {
      await delay(300)
      return { data: mockData.matches }
    },
    getById: async (id: string) => {
      await delay(200)
      const match = mockData.matches.find((m) => m.id === id)
      if (!match) throw new Error("Match not found")
      return { data: match }
    },
    getByUserId: async (userId: string) => {
      await delay(300)
      const matches = mockData.matches.filter((m) => m.userId === userId)
      return { data: matches }
    },
    getByBotId: async (botId: string) => {
      await delay(300)
      const matches = mockData.matches.filter((m) => m.botId === botId)
      return { data: matches }
    },
    create: async (matchData: Partial<Match>) => {
      await delay(400)

      // Calculate match score if not provided
      let score = matchData.score
      if (!score && matchData.userId && matchData.botId) {
        const user = mockData.users.find((u) => u.id === matchData.userId)
        const bot = mockData.bots.find((b) => b.id === matchData.botId)

        if (user && bot) {
          score = calculateMatchScore(user.interests, bot.interests)
        }
      }

      const newMatch = {
        id: `match-${matchData.userId}-${matchData.botId}`,
        userId: matchData.userId || "",
        botId: matchData.botId || "",
        score: score || 0,
        createdAt: new Date().toISOString(),
        status: matchData.status || "pending",
        commonInterests: matchData.commonInterests || [],
      } as Match

      mockData.matches.push(newMatch)
      return { data: newMatch }
    },
    update: async (id: string, matchData: Partial<Match>) => {
      await delay(300)
      const index = mockData.matches.findIndex((m) => m.id === id)
      if (index === -1) throw new Error("Match not found")

      mockData.matches[index] = { ...mockData.matches[index], ...matchData }
      return { data: mockData.matches[index] }
    },
    delete: async (id: string) => {
      await delay(500)
      const index = mockData.matches.findIndex((m) => m.id === id)
      if (index === -1) throw new Error("Match not found")

      mockData.matches.splice(index, 1)
      return { success: true }
    },
    accept: async (id: string) => {
      await delay(300)
      const index = mockData.matches.findIndex((m) => m.id === id)
      if (index === -1) throw new Error("Match not found")

      mockData.matches[index].status = "accepted"

      // Create conversation for this match
      const match = mockData.matches[index]
      const existingConversation = mockData.conversations.find(
        (c) => c.userId === match.userId && c.botId === match.botId,
      )

      if (!existingConversation) {
        const newConversation = {
          id: `conv-${match.userId}-${match.botId}`,
          userId: match.userId,
          botId: match.botId,
          status: "active",
          startedAt: new Date().toISOString(),
          lastMessageAt: new Date().toISOString(),
          messageCount: 1, // System message
          userMessageCount: 0,
          botMessageCount: 0,
          matchScore: match.score,
          priority: "medium",
        } as Conversation

        mockData.conversations.push(newConversation)

        // Create initial system message
        mockData.messages.push({
          id: generateId(),
          conversationId: newConversation.id,
          sender: "system",
          content: "Konuşma başlatıldı. Lütfen kişisel bilgilerinizi paylaşmaktan kaçının.",
          timestamp: newConversation.startedAt,
          read: true,
        })
      }

      return { data: mockData.matches[index] }
    },
    reject: async (id: string) => {
      await delay(300)
      const index = mockData.matches.findIndex((m) => m.id === id)
      if (index === -1) throw new Error("Match not found")

      mockData.matches[index].status = "rejected"
      return { data: mockData.matches[index] }
    },
    getStats: async () => {
      await delay(300)
      return {
        data: {
          total: mockData.matches.length,
          accepted: mockData.matches.filter((m) => m.status === "accepted").length,
          pending: mockData.matches.filter((m) => m.status === "pending").length,
          rejected: mockData.matches.filter((m) => m.status === "rejected").length,
          averageScore: Math.round(
            mockData.matches.reduce((sum, match) => sum + match.score, 0) / mockData.matches.length,
          ),
        },
      }
    },
  },

  // Analytics endpoints
  analytics: {
    getUserStats: async () => {
      await delay(400)
      return {
        data: {
          totalUsers: mockData.users.length,
          activeUsers: mockData.users.filter((u) => u.status === "active").length,
          vipUsers: mockData.users.filter((u) => u.isVip).length,
          totalCredits: mockData.users.reduce((sum, user) => sum + user.credits, 0),
          averageAge: Math.round(mockData.users.reduce((sum, user) => sum + user.age, 0) / mockData.users.length),
          genderDistribution: {
            male: mockData.users.filter((u) => u.gender === "male").length,
            female: mockData.users.filter((u) => u.gender === "female").length,
            other: mockData.users.filter((u) => u.gender === "other").length,
          },
        },
      }
    },
    getBotStats: async () => {
      await delay(400)
      return {
        data: {
          totalBots: mockData.bots.length,
          activeBots: mockData.bots.filter((b) => b.status === "active").length,
          inactiveBots: mockData.bots.filter((b) => b.status === "inactive").length,
          averageAge: Math.round(mockData.bots.reduce((sum, bot) => sum + bot.age, 0) / mockData.bots.length),
          mostPopularInterests: getMostPopularInterests(mockData.bots.flatMap((b) => b.interests)),
        },
      }
    },
    getConversationStats: async () => {
      await delay(400)
      return {
        data: {
          totalConversations: mockData.conversations.length,
          activeConversations: mockData.conversations.filter((c) => c.status === "active").length,
          escalatedConversations: mockData.conversations.filter((c) => c.status === "escalated").length,
          resolvedConversations: mockData.conversations.filter((c) => c.status === "resolved").length,
          averageMessagesPerConversation: Math.round(
            mockData.conversations.reduce((sum, conv) => sum + conv.messageCount, 0) / mockData.conversations.length,
          ),
          totalMessages: mockData.messages.length,
          userMessages: mockData.messages.filter((m) => m.sender === "user").length,
          botMessages: mockData.messages.filter((m) => m.sender === "bot").length,
          systemMessages: mockData.messages.filter((m) => m.sender === "system").length,
        },
      }
    },
    getMatchStats: async () => {
      await delay(400)
      return {
        data: {
          totalMatches: mockData.matches.length,
          acceptedMatches: mockData.matches.filter((m) => m.status === "accepted").length,
          pendingMatches: mockData.matches.filter((m) => m.status === "pending").length,
          rejectedMatches: mockData.matches.filter((m) => m.status === "rejected").length,
          averageMatchScore: Math.round(
            mockData.matches.reduce((sum, match) => sum + match.score, 0) / mockData.matches.length,
          ),
          mostCommonInterests: getMostPopularInterests(mockData.matches.flatMap((m) => m.commonInterests)),
        },
      }
    },
    getDashboardStats: async () => {
      await delay(500)
      return {
        data: {
          users: {
            total: mockData.users.length,
            active: mockData.users.filter((u) => u.status === "active").length,
            vip: mockData.users.filter((u) => u.isVip).length,
          },
          bots: {
            total: mockData.bots.length,
            active: mockData.bots.filter((b) => b.status === "active").length,
          },
          conversations: {
            total: mockData.conversations.length,
            active: mockData.conversations.filter((c) => c.status === "active").length,
            escalated: mockData.conversations.filter((c) => c.status === "escalated").length,
          },
          matches: {
            total: mockData.matches.length,
            accepted: mockData.matches.filter((m) => m.status === "accepted").length,
          },
          messages: {
            total: mockData.messages.length,
            user: mockData.messages.filter((m) => m.sender === "user").length,
            bot: mockData.messages.filter((m) => m.sender === "bot").length,
          },
          credits: {
            total: mockData.users.reduce((sum, user) => sum + user.credits, 0),
            spent: mockData.messages.reduce((sum, msg) => sum + (msg.creditCost || 0), 0),
          },
        },
      }
    },
  },
}

// Helper function to get most popular interests
function getMostPopularInterests(interests: string[]): { interest: string; count: number }[] {
  const counts: Record<string, number> = {}

  interests.forEach((interest) => {
    counts[interest] = (counts[interest] || 0) + 1
  })

  return Object.entries(counts)
    .map(([interest, count]) => ({ interest, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}
