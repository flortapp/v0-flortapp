"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search,
  Lock,
  Pin,
  Bot,
  MessageSquarePlus,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Loader2,
} from "lucide-react"
import { LiveChatInterface } from "@/components/live-chat/live-chat-interface"
import { LiveChatBotsList } from "@/components/live-chat/live-chat-bots-list"
import {
  type Conversation,
  determineConversationStatus,
  markMessagesAsRead,
} from "@/components/live-chat/utils/conversation-status"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { ConversationMetadata, ConversationStatus } from "@/types/conversation"
import { conversationService } from "@/services/conversation-service"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { mockApi } from "@/services/api-mock"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Import the EscalationBanner at the top of the file
import { EscalationBanner } from "@/components/bot-list/escalation-banner"

// Add the import for the ConversationTransitionHandler component
import { ConversationTransitionHandler } from "@/components/live-chat/conversation-transition-handler"

// Kullanıcı ve bot veri tipleri
interface User {
  id: string
  name: string
  email: string
  birthDate?: string
  location?: string
  coins?: string
  lastActive?: string
  online: boolean
  profileData?: {
    birthDate: string
    location: string
    coins: string
  }
  avatar: string
}

interface IBot {
  id: string
  name: string
  email: string
  online: boolean
  location?: string
  status?: string
  avatar: string
}

interface Message {
  id: string
  sender: "user" | "bot" | "system"
  content: string
  time: string
  read: boolean
  image?: string
  location?: {
    lat: number
    lng: number
    placeName: string
    city: string
  }
}

export function LiveChatContent() {
  const [activeBots, setActiveBots] = useState<IBot[]>([])
  const [selectedBot, setSelectedBot] = useState<IBot | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [conversations, setConversations] = useState<ConversationMetadata[]>([])
  const [escalatedConversations, setEscalatedConversations] = useState<ConversationMetadata[]>([])
  const [pendingEscalations, setPendingEscalations] = useState<ConversationMetadata[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Mesaj ve konuşma durumu yönetimi için state'ler
  const [messagesByUserAndBot, setMessagesByUserAndBot] = useState<Record<string, Record<string, Message[]>>>({})
  const [conversationStatuses, setConversationStatuses] = useState<Record<string, Conversation>>({})
  const [userBotRelations, setUserBotRelations] = useState<Record<string, string[]>>({})

  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false)
  const [selectedNewUser, setSelectedNewUser] = useState<User | null>(null)
  const [selectedNewBot, setSelectedNewBot] = useState<IBot | null>(null)

  // Search and pagination states for new conversation dialog
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [botSearchQuery, setBotSearchQuery] = useState("")
  const [botPage, setBotPage] = useState(1)
  const ITEMS_PER_PAGE = 5

  // Assume adminControlsEnabled is determined elsewhere or is always true for this example
  const adminControlsEnabled = true

  // Fetch data from the mock API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch bots
        const botsResponse = await mockApi.bots.getAll()
        const botsData = botsResponse.data

        // Filter for active bots only
        const activeBotsOnly = botsData
          .filter((bot) => bot.status === "active")
          .map((bot) => ({
            id: bot.id,
            name: bot.name,
            email: bot.email,
            online: bot.online,
            location: bot.location,
            status: bot.status,
            avatar: bot.avatar,
          }))

        setActiveBots(activeBotsOnly)

        // Set the first active bot as selected by default
        if (activeBotsOnly.length > 0 && !selectedBot) {
          setSelectedBot(activeBotsOnly[0])
        }

        // Fetch users
        const usersResponse = await mockApi.users.getAll()
        const usersData = usersResponse.data.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          birthDate: user.birthDate,
          location: user.location,
          coins: user.credits.toString(),
          lastActive: user.lastActive,
          online: user.online,
          profileData: {
            birthDate: user.birthDate || "",
            location: user.location || "",
            coins: `${user.credits} Coin`,
          },
          avatar: user.avatar,
        }))

        // Fetch conversations
        const conversationsResponse = await mockApi.conversations.getAll()
        const conversationsData = conversationsResponse.data

        // Build user-bot relations
        const relations: Record<string, string[]> = {}
        conversationsData.forEach((conv) => {
          if (!relations[conv.userId]) {
            relations[conv.userId] = []
          }
          if (!relations[conv.userId].includes(conv.botId)) {
            relations[conv.userId].push(conv.botId)
          }
        })
        setUserBotRelations(relations)

        // Fetch messages for each conversation and build messagesByUserAndBot
        const messagesMap: Record<string, Record<string, Message[]>> = {}

        for (const conv of conversationsData) {
          const messagesResponse = await mockApi.messages.getByConversationId(conv.id)
          const messagesData = messagesResponse.data

          if (!messagesMap[conv.userId]) {
            messagesMap[conv.userId] = {}
          }

          messagesMap[conv.userId][conv.botId] = messagesData.map((msg) => ({
            id: msg.id,
            sender: msg.sender,
            content: msg.content,
            time: new Date(msg.timestamp).toLocaleString("tr-TR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            read: msg.read,
            image: msg.image,
            location: msg.location,
          }))
        }

        setMessagesByUserAndBot(messagesMap)

        // Convert conversations to ConversationMetadata
        const conversationMetadata: ConversationMetadata[] = conversationsData.map((conv) => ({
          id: `${conv.userId}-${conv.botId}`,
          userId: conv.userId,
          botId: conv.botId,
          status: conv.status as ConversationStatus,
          createdAt: new Date(conv.startedAt),
          updatedAt: new Date(),
          lastMessageAt: new Date(conv.lastMessageAt),
          messageCount: conv.messageCount,
          userMessageCount: conv.userReplies,
          botMessageCount: conv.messageCount - conv.userReplies,
          hasUnreadMessages: false,
          isPinned: false,
          isArchived: false,
          isVipUser: conv.isVipUser,
          userCredits: conv.userJetons,
        }))

        setConversations(conversationMetadata)

        // Update conversation service
        conversationMetadata.forEach((conv) => {
          conversationService.updateConversation(conv)
        })

        // Set escalated and pending conversations
        setEscalatedConversations(conversationMetadata.filter((conv) => conv.status === "escalated"))
        setPendingEscalations(conversationMetadata.filter((conv) => conv.status === "pending"))

        // Calculate conversation statuses
        const statuses: Record<string, Conversation> = {}
        Object.keys(messagesMap).forEach((userId) => {
          Object.keys(messagesMap[userId]).forEach((botId) => {
            const messages = messagesMap[userId][botId]
            const status = determineConversationStatus(messages)
            const conversationId = `${userId}-${botId}`

            statuses[conversationId] = {
              userId,
              botId,
              lastUpdated: new Date(),
              hasUnreadMessages: status.hasUnreadMessages,
              lastMessageFrom: status.lastMessageFrom,
            }
          })
        })

        setConversationStatuses(statuses)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Veri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedBot])

  // Bot seçildiğinde, o botla konuşan kullanıcıları filtrele
  useEffect(() => {
    if (!selectedBot || !userBotRelations) return

    const fetchFilteredUsers = async () => {
      try {
        const usersResponse = await mockApi.users.getAll()
        const allUsers = usersResponse.data.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          birthDate: user.birthDate,
          location: user.location,
          coins: user.credits.toString(),
          lastActive: user.lastActive,
          online: user.online,
          profileData: {
            birthDate: user.birthDate || "",
            location: user.location || "",
            coins: `${user.credits} Coin`,
          },
          avatar: user.avatar,
        }))

        const users = allUsers.filter((user) => {
          const botIds = userBotRelations[user.id] || []
          return botIds.includes(selectedBot.id)
        })

        setFilteredUsers(users)
        setSearchQuery("") // Bot değiştiğinde arama sorgusunu sıfırla

        // Eğer seçili kullanıcı bu botla konuşmuyorsa veya hiç seçili kullanıcı yoksa
        // ilk kullanıcıyı seç
        if (!selectedUser || !userBotRelations[selectedUser.id]?.includes(selectedBot.id)) {
          if (users.length > 0) {
            setSelectedUser(users[0])
            setActiveConversation(`${users[0].id}-${selectedBot.id}`)
          } else {
            setSelectedUser(null)
            setActiveConversation(null)
          }
        } else {
          setActiveConversation(`${selectedUser.id}-${selectedBot.id}`)
        }
      } catch (err) {
        console.error("Error fetching filtered users:", err)
      }
    }

    fetchFilteredUsers()
  }, [selectedBot, selectedUser, userBotRelations])

  // Aktif konuşma değiştiğinde, mesajları okundu olarak işaretle
  useEffect(() => {
    if (activeConversation && selectedUser && selectedBot) {
      const [userId, botId] = activeConversation.split("-")

      // Eğer bu kullanıcı-bot kombinasyonu için mesajlar varsa
      if (messagesByUserAndBot[userId]?.[botId]) {
        // Bot mesajlarını okundu olarak işaretle
        const updatedMessages = markMessagesAsRead(
          messagesByUserAndBot[userId][botId],
          "bot", // Sadece bot mesajlarını okundu olarak işaretle
        )

        // Mesajları güncelle
        setMessagesByUserAndBot((prev) => ({
          ...prev,
          [userId]: {
            ...prev[userId],
            [botId]: updatedMessages,
          },
        }))

        // Konuşma durumunu güncelle
        const status = determineConversationStatus(updatedMessages)
        setConversationStatuses((prev) => ({
          ...prev,
          [activeConversation]: {
            userId,
            botId,
            lastUpdated: new Date(),
            hasUnreadMessages: status.hasUnreadMessages,
            lastMessageFrom: status.lastMessageFrom,
          },
        }))
      }
    }
  }, [activeConversation])

  // Bot seçme işlevi
  const handleSelectBot = (bot: IBot) => {
    setSelectedBot(bot)
  }

  // Kullanıcı seçme işlevi
  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    if (selectedBot) {
      const newActiveConversation = `${user.id}-${selectedBot.id}`
      setActiveConversation(newActiveConversation)
    }
  }

  const togglePinConversation = useCallback((userId: string, botId: string) => {
    const conversationId = `${userId}-${botId}`
    const updated = conversationService.togglePinStatus(conversationId)

    if (updated) {
      // Update the conversations state
      setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? updated : conv)))
    }
  }, [])

  const isConversationPinned = useCallback((userId: string, botId: string) => {
    const conversationId = `${userId}-${botId}`
    const conversation = conversationService.getConversation(conversationId)
    return conversation?.isPinned || false
  }, [])

  const escalateConversation = useCallback(
    (userId: string, botId: string) => {
      const conversationId = `${userId}-${botId}`
      const updated = conversationService.escalateConversation(
        conversationId,
        "admin", // In a real app, use the current admin's ID
        "admin_decision",
        "medium",
      )

      if (updated) {
        // Update the conversations state
        setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? updated : conv)))

        // Update escalated conversations
        setEscalatedConversations((prev) => [...prev, updated])

        // Remove from pending if it was there
        setPendingEscalations((prev) => prev.filter((conv) => conv.id !== conversationId))

        // Show toast notification
        toast({
          title: "Konuşma Yükseltildi",
          description: "Konuşma başarıyla canlı sohbete yükseltildi.",
          variant: "success",
        })
      }
    },
    [toast],
  )

  // Konuşmanın cevaplanmamış mesajları olup olmadığını kontrol etme
  const hasUnreadMessages = useCallback(
    (userId: string, botId: string) => {
      const conversationId = `${userId}-${botId}`
      return conversationStatuses[conversationId]?.hasUnreadMessages || false
    },
    [conversationStatuses],
  )

  // Enhance the handleSendBotMessage function to properly initialize new conversations
  const handleSendBotMessage = useCallback(
    async (userId: string, botId: string, content: string, image?: string, location?: Message["location"]) => {
      try {
        // Create a new message via the API
        const messageData = {
          conversationId: `${userId}-${botId}`,
          sender: "bot" as const,
          content,
          image,
          location,
        }

        const response = await mockApi.messages.create(messageData)
        const newMessage = response.data

        const botResponse: Message = {
          id: newMessage.id,
          sender: "bot",
          content,
          time: new Date(newMessage.timestamp).toLocaleString("tr-TR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          read: activeConversation === `${userId}-${botId}`, // Aktif konuşmaysa okundu olarak işaretle
          image,
          location,
        }

        // Check if this is a new conversation
        const isNewConversation = !messagesByUserAndBot[userId]?.[botId]
        const conversationId = `${userId}-${botId}`

        // Mesajları güncelle
        setMessagesByUserAndBot((prev) => {
          const userMessages = prev[userId] || {}
          const botMessages = userMessages[botId] || []

          const updatedMessages = [...botMessages, botResponse]

          return {
            ...prev,
            [userId]: {
              ...userMessages,
              [botId]: updatedMessages,
            },
          }
        })

        // Konuşma durumunu güncelle
        setConversationStatuses((prev) => {
          const isActive = activeConversation === conversationId

          return {
            ...prev,
            [conversationId]: {
              userId,
              botId,
              lastUpdated: new Date(),
              hasUnreadMessages: !isActive, // Aktif konuşma değilse, cevaplanmamış olarak işaretle
              lastMessageFrom: "bot",
            },
          }
        })

        // If this is a new conversation, update the userBotRelations and filtered users
        if (isNewConversation) {
          // Update userBotRelations to include this new relationship
          setUserBotRelations((prev) => {
            const newRelations = { ...prev }
            if (!newRelations[userId]) {
              newRelations[userId] = [botId]
            } else if (!newRelations[userId].includes(botId)) {
              newRelations[userId] = [...newRelations[userId], botId]
            }
            return newRelations
          })

          // Create new conversation via the API
          const newConversationData = {
            userId,
            botId,
            status: "active" as const,
            messageCount: 1,
            userReplies: 0,
            priority: "medium" as const,
            isVipUser: false,
            userJetons: 0,
          }

          const convResponse = await mockApi.conversations.create(newConversationData)
          const newConv = convResponse.data

          // Create new conversation metadata
          const newConversation: ConversationMetadata = {
            id: conversationId,
            userId,
            botId,
            status: "active",
            createdAt: new Date(newConv.startedAt),
            updatedAt: new Date(),
            lastMessageAt: new Date(newConv.lastMessageAt),
            messageCount: 1,
            userMessageCount: 0,
            botMessageCount: 1,
            hasUnreadMessages: !activeConversation || activeConversation !== conversationId,
            isPinned: false,
            isArchived: false,
            isVipUser: false,
            userCredits: 0,
          }

          // Update conversations state immediately
          setConversations((prev) => [...prev, newConversation])
          conversationService.updateConversation(newConversation)

          // Show a toast notification for the new conversation
          toast({
            title: "Yeni Konuşma Başlatıldı",
            description: `Bot ${botId} ve Kullanıcı ${userId} arasında yeni konuşma başlatıldı.`,
            variant: "success",
          })
        }
      } catch (err) {
        console.error("Error sending bot message:", err)
        toast({
          title: "Hata",
          description: "Mesaj gönderilirken bir hata oluştu.",
          variant: "destructive",
        })
      }
    },
    [activeConversation, messagesByUserAndBot, conversationStatuses, toast],
  )

  // Sistem mesajı gönderme işlevi
  const handleSendSystemMessage = useCallback(async () => {
    if (!selectedUser || !selectedBot || !activeConversation) return

    const [userId, botId] = activeConversation.split("-")

    try {
      // Create a new system message via the API
      const messageData = {
        conversationId: `${userId}-${botId}`,
        sender: "system" as const,
        content:
          "Uygulamamız üzerinde, ceptelefonu, adres ve kişisel bilgilerinizi vermenizi tavsiye etmiyoruz. Bu tarz bilgileri paylaştığınız durumda oluşabilecek sorunlardan sorumlu değildir.",
      }

      const response = await mockApi.messages.create(messageData)
      const newMessage = response.data

      const systemMessage: Message = {
        id: newMessage.id,
        sender: "system",
        content: newMessage.content,
        time: new Date(newMessage.timestamp).toLocaleString("tr-TR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        read: true,
      }

      // Mesajları güncelle
      setMessagesByUserAndBot((prev) => {
        const userMessages = prev[userId] || {}
        const botMessages = userMessages[botId] || []

        const updatedMessages = [...botMessages, systemMessage]

        return {
          ...prev,
          [userId]: {
            ...userMessages,
            [botId]: updatedMessages,
          },
        }
      })
    } catch (err) {
      console.error("Error sending system message:", err)
      toast({
        title: "Hata",
        description: "Sistem mesajı gönderilirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }, [selectedUser, selectedBot, activeConversation, toast])

  // Arama işlemi
  const searchedUsers = searchQuery
    ? filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : filteredUsers

  // Modify the sortedUsers definition to add a timestamp-based sort
  const sortedUsers = [...searchedUsers].sort((a, b) => {
    if (!selectedBot) return 0

    const aIsPinned = isConversationPinned(a.id, selectedBot.id)
    const bIsPinned = isConversationPinned(b.id, selectedBot.id)

    // First sort by pin status
    if (aIsPinned && !bIsPinned) return -1
    if (!aIsPinned && bIsPinned) return 1

    // Then sort by conversation creation time (newest first)
    const aConv = conversationService.getConversationByUserAndBot(a.id, selectedBot.id)
    const bConv = conversationService.getConversationByUserAndBot(b.id, selectedBot.id)

    if (aConv && bConv) {
      return bConv.createdAt.getTime() - aConv.createdAt.getTime()
    }

    return 0
  })

  // Filter and paginate users for the new conversation dialog
  const filteredUsersNewConv = userSearchQuery
    ? filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearchQuery.toLowerCase()),
      )
    : filteredUsers

  const paginatedUsers = filteredUsersNewConv

  const totalUserPages = Math.ceil(filteredUsersNewConv.length / ITEMS_PER_PAGE)

  // Filter and paginate bots for the new conversation dialog
  const filteredBots = botSearchQuery
    ? activeBots.filter(
        (bot) =>
          bot.name.toLowerCase().includes(botSearchQuery.toLowerCase()) ||
          bot.email.toLowerCase().includes(botSearchQuery.toLowerCase()),
      )
    : activeBots

  const paginatedBots = filteredBots.slice((botPage - 1) * ITEMS_PER_PAGE, botPage * ITEMS_PER_PAGE)

  const totalBotPages = Math.ceil(filteredBots.length / ITEMS_PER_PAGE)

  // Add this function to synchronize conversation state
  const synchronizeConversations = useCallback(async () => {
    try {
      // Fetch conversations from the API
      const conversationsResponse = await mockApi.conversations.getAll()
      const conversationsData = conversationsResponse.data

      // Convert to ConversationMetadata
      const conversationMetadata: ConversationMetadata[] = conversationsData.map((conv) => ({
        id: `${conv.userId}-${conv.botId}`,
        userId: conv.userId,
        botId: conv.botId,
        status: conv.status as ConversationStatus,
        createdAt: new Date(conv.startedAt),
        updatedAt: new Date(),
        lastMessageAt: new Date(conv.lastMessageAt),
        messageCount: conv.messageCount,
        userMessageCount: conv.userReplies,
        botMessageCount: conv.messageCount - conv.userReplies,
        hasUnreadMessages: false,
        isPinned: false,
        isArchived: false,
        isVipUser: conv.isVipUser,
        userCredits: conv.userJetons,
      }))

      // Update local state
      setConversations(conversationMetadata)

      // Update conversation service
      conversationMetadata.forEach((conv) => {
        conversationService.updateConversation(conv)
      })

      // Update filtered conversation lists
      setEscalatedConversations(conversationMetadata.filter((conv) => conv.status === "escalated"))
      setPendingEscalations(conversationMetadata.filter((conv) => conv.status === "pending"))

      // Ensure all conversations have corresponding entries in messagesByUserAndBot
      for (const conv of conversationMetadata) {
        const { userId, botId } = conv

        // If this conversation doesn't have messages yet, fetch them
        if (!messagesByUserAndBot[userId]?.[botId]) {
          const messagesResponse = await mockApi.messages.getByConversationId(`${userId}-${botId}`)
          const messagesData = messagesResponse.data

          if (messagesData.length > 0) {
            setMessagesByUserAndBot((prev) => {
              const newMap = { ...prev }
              if (!newMap[userId]) {
                newMap[userId] = {}
              }

              newMap[userId][botId] = messagesData.map((msg) => ({
                id: msg.id,
                sender: msg.sender,
                content: msg.content,
                time: new Date(msg.timestamp).toLocaleString("tr-TR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                read: msg.read,
                image: msg.image,
                location: msg.location,
              }))

              return newMap
            })

            // Update conversation statuses as well
            const status = determineConversationStatus(messagesData)
            setConversationStatuses((prev) => ({
              ...prev,
              [`${userId}-${botId}`]: {
                userId,
                botId,
                lastUpdated: new Date(),
                hasUnreadMessages: status.hasUnreadMessages,
                lastMessageFrom: status.lastMessageFrom,
              },
            }))
          } else {
            // If no messages, initialize with system message
            const initialMessage = {
              id: Date.now().toString(),
              sender: "system" as const,
              content: "Konuşma başlatıldı.",
              time: new Date().toLocaleString("tr-TR"),
              read: true,
            }

            setMessagesByUserAndBot((prev) => ({
              ...prev,
              [userId]: {
                ...(prev[userId] || {}),
                [botId]: [initialMessage],
              },
            }))

            // Update conversation statuses
            setConversationStatuses((prev) => ({
              ...prev,
              [`${userId}-${botId}`]: {
                userId,
                botId,
                lastUpdated: new Date(),
                hasUnreadMessages: false,
                lastMessageFrom: "system",
              },
            }))
          }
        }
      }
    } catch (err) {
      console.error("Error synchronizing conversations:", err)
    }
  }, [messagesByUserAndBot])

  // Call this function in a useEffect to periodically check for new conversations
  useEffect(() => {
    // Initial synchronization
    synchronizeConversations()

    // Set up periodic sync (every 5 seconds)
    const syncInterval = setInterval(synchronizeConversations, 5000)

    return () => clearInterval(syncInterval)
  }, [synchronizeConversations])

  // Add this function to handle conversation redirects
  const handleConversationRedirect = useCallback(
    async (fromUserId: string, fromBotId: string, toUserId: string, toBotId: string, context?: string) => {
      try {
        // Create a system message in the source conversation
        const redirectMessageData = {
          conversationId: `${fromUserId}-${fromBotId}`,
          sender: "system" as const,
          content: `Bu konuşma ${filteredUsers.find((u) => u.id === toUserId)?.name || toUserId} kullanıcısına yönlendirildi.`,
        }

        await mockApi.messages.create(redirectMessageData)

        // Create a system message in the target conversation
        const contextMessageData = {
          conversationId: `${toUserId}-${toBotId}`,
          sender: "system" as const,
          content: `Bu konuşma ${filteredUsers.find((u) => u.id === fromUserId)?.name || fromUserId} kullanıcısından yönlendirildi.${context ? ` Konu: ${context}` : ""}`,
        }

        await mockApi.messages.create(contextMessageData)

        // Check if target conversation exists, if not create it
        const isNewConversation = !messagesByUserAndBot[toUserId]?.[toBotId]

        if (isNewConversation) {
          // Create new conversation via the API
          const newConversationData = {
            userId: toUserId,
            botId: toBotId,
            status: "active" as const,
            messageCount: 1,
            userReplies: 0,
            priority: "medium" as const,
            isVipUser: false,
            userJetons: 0,
          }

          await mockApi.conversations.create(newConversationData)

          // Update userBotRelations
          setUserBotRelations((prev) => {
            const newRelations = { ...prev }
            if (!newRelations[toUserId]) {
              newRelations[toUserId] = [toBotId]
            } else if (!newRelations[toUserId].includes(toBotId)) {
              newRelations[toUserId] = [...newRelations[toUserId], toBotId]
            }
            return newRelations
          })
        }

        // Refresh conversations
        await synchronizeConversations()

        // Show a toast notification
        toast({
          title: "Konuşma Yönlendirildi",
          description: `Konuşma başarıyla yönlendirildi.`,
          variant: "success",
        })
      } catch (err) {
        console.error("Error redirecting conversation:", err)
        toast({
          title: "Hata",
          description: "Konuşma yönlendirilirken bir hata oluştu.",
          variant: "destructive",
        })
      }
    },
    [filteredUsers, messagesByUserAndBot, synchronizeConversations, toast],
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-kisstagram-pink" />
        <span className="ml-2 text-lg text-gray-700">Veriler yükleniyor...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Hata</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()}>Yeniden Dene</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <ConversationTransitionHandler
        onTransitionComplete={(conversationId, success) => {
          if (success) {
            // Refresh the conversation lists
            synchronizeConversations()
          }
        }}
      />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Canlı Sohbet</h1>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-gray-200 text-gray-700 hover:bg-gray-50"
            onClick={() => router.push("/bot-list")}
          >
            <Bot className="h-4 w-4" />
            <span>Bot Listesi</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-kisstagram-pink text-kisstagram-pink hover:bg-kisstagram-pink_light"
            onClick={() => setShowNewConversationDialog(true)}
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span>YENİ KONUŞMA</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <EscalationBanner pendingEscalations={pendingEscalations.length} />
          <div className="bg-gray-50 px-3 py-1 rounded-full text-xs border border-gray-200 text-gray-700">
            <Lock className="h-3 w-3 text-kisstagram-pink inline-block mr-1" />
            <span>Tek Yönlü İletişim Modu</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-hidden">
        {/* Sol panel - Bot listesi */}
        <Card className="md:col-span-3 lg:col-span-2 overflow-hidden flex flex-col p-0 border-gray-200 shadow-sm">
          <LiveChatBotsList
            bots={activeBots}
            selectedBot={selectedBot || undefined}
            onSelectBot={handleSelectBot}
            getUnreadStatus={(botId) => {
              // Botun cevaplanmamış mesajları olup olmadığını kontrol et
              return Object.keys(conversationStatuses).some((convId) => {
                const [userId, convBotId] = convId.split("-")
                return convBotId === botId && conversationStatuses[convId].hasUnreadMessages
              })
            }}
          />
        </Card>

        {/* Orta panel - Kullanıcı listesi ve sohbet arayüzü */}
        <Card className="md:col-span-9 lg:col-span-10 overflow-hidden flex flex-col p-0 border-gray-200 shadow-sm">
          {selectedUser && selectedBot ? (
            <>
              <div className="flex h-full flex-col md:flex-row">
                {/* Kullanıcı listesi */}
                <div className="w-full md:w-1/3 lg:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 overflow-hidden md:max-h-full max-h-48">
                  {/* Maintain search for top user */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Kişi Ara..."
                        className="pl-8 bg-gray-50 border-gray-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto h-full bg-white">
                    {sortedUsers.length > 0 ? (
                      sortedUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center gap-3 p-3 cursor-pointer relative ${
                            selectedUser?.id === user.id ? "bg-kisstagram-pink_light" : "hover:bg-gray-50"
                          }`}
                          onClick={() => handleSelectUser(user)}
                        >
                          <div className="relative">
                            <Avatar className="h-10 w-10 border-2 border-kisstagram-pink">
                              <AvatarImage
                                src={
                                  user.avatar || `/abstract-geometric-shapes.png?height=40&width=40&query=${user.name}`
                                }
                                alt={user.name}
                              />
                              <AvatarFallback className="bg-kisstagram-pink text-white">
                                {user.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {user.online && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            )}
                            {selectedBot &&
                              hasUnreadMessages(user.id, selectedBot.id) &&
                              selectedUser?.id !== user.id && (
                                <span className="absolute top-0 right-0 w-3 h-3 bg-kisstagram-pink border-2 border-white rounded-full"></span>
                              )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p
                                className={`font-medium truncate ${
                                  selectedBot &&
                                  hasUnreadMessages(user.id, selectedBot.id) &&
                                  selectedUser?.id !== user.id
                                    ? "text-kisstagram-pink"
                                    : "text-gray-900"
                                }`}
                              >
                                {user.name}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-0 h-auto ml-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (selectedBot) {
                                    togglePinConversation(user.id, selectedBot.id)
                                  }
                                }}
                              >
                                <Pin
                                  className={`h-3 w-3 ${
                                    selectedBot && isConversationPinned(user.id, selectedBot.id)
                                      ? "text-kisstagram-pink rotate-45"
                                      : "text-gray-400"
                                  }`}
                                />
                              </Button>
                            </div>
                            <p className="text-xs truncate text-gray-500">{user.email}</p>
                          </div>
                          <div className="text-xs text-gray-500 hidden sm:block">
                            {user.lastActive ? user.lastActive.split(" ")[0] : ""}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">Bu botla konuşan kullanıcı bulunamadı</div>
                    )}
                  </div>
                </div>

                {/* Sohbet arayüzü */}
                <div className="w-full md:w-2/3 lg:w-3/4 flex-1">
                  <LiveChatInterface
                    user={selectedUser}
                    bot={selectedBot}
                    isPinned={isConversationPinned(selectedUser.id, selectedBot.id)}
                    onTogglePin={() => togglePinConversation(selectedUser.id, selectedBot.id)}
                    messages={messagesByUserAndBot[selectedUser.id]?.[selectedBot.id] || []}
                    onSendSystemMessage={handleSendSystemMessage}
                    onSendBotMessage={(content, image, location) =>
                      handleSendBotMessage(selectedUser.id, selectedBot.id, content, image, location)
                    }
                    conversationId={`${selectedUser.id}-${selectedBot.id}`}
                  >
                    {/* Add this to the DropdownMenuContent in the LiveChatInterface component */}
                    <DropdownMenuItem
                      onClick={() =>
                        handleConversationRedirect(
                          selectedUser.id,
                          selectedBot.id,
                          "user-2",
                          "bot-1",
                          "Önceki konuşmadan yönlendirme",
                        )
                      }
                      disabled={!adminControlsEnabled}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Başka Bota Yönlendir</span>
                    </DropdownMenuItem>
                  </LiveChatInterface>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 bg-white">
              <div className="text-center p-6">
                <Lock className="h-12 w-12 text-kisstagram-pink mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2 text-gray-900">Tek Yönlü İletişim Kanalı</h3>
                <p>Lütfen bir bot ve kullanıcı seçin</p>
                <p className="text-sm mt-2">
                  Bu kanal yalnızca bot mesajları için tasarlanmıştır. Kullanıcı mesajları mobil uygulamadan
                  alınacaktır.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
      {/* New Conversation Dialog */}
      {showNewConversationDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Yeni Konuşma Başlat</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowNewConversationDialog(false)
                  // Reset search and pagination when closing
                  setUserSearchQuery("")
                  setBotSearchQuery("")
                  setBotPage(1)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden">
              {/* Bot Selection */}
              <div className="flex flex-col border border-gray-200 rounded-md overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-medium mb-2 text-gray-900">Bot Seç</h3>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Bot Ara..."
                      className="pl-8 bg-white border-gray-200"
                      value={botSearchQuery}
                      onChange={(e) => {
                        setBotSearchQuery(e.target.value)
                        setBotPage(1) // Reset to first page on search
                      }}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[300px] bg-white">
                  {paginatedBots.length > 0 ? (
                    paginatedBots.map((bot) => (
                      <div
                        key={bot.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer ${
                          selectedNewBot?.id === bot.id ? "bg-kisstagram-pink_light" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedNewBot(bot)}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10 border-2 border-gray-200">
                            <AvatarImage
                              src={bot.avatar || `/abstract-geometric-shapes.png?height=40&width=40&query=${bot.name}`}
                              alt={bot.name}
                            />
                            <AvatarFallback className="bg-kisstagram-pink text-white">
                              {bot.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {bot.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-gray-900">{bot.name}</p>
                          <p className="text-xs truncate text-gray-500">{bot.email}</p>
                          {bot.location && (
                            <p className="text-xs truncate text-gray-500 mt-1">
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                              {bot.location}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">Bot bulunamadı</div>
                  )}
                </div>

                {totalBotPages > 1 && (
                  <div className="p-2 border-t border-gray-200 flex justify-center bg-white">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 border-gray-200"
                        onClick={() => setBotPage(Math.max(1, botPage - 1))}
                        disabled={botPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-xs text-gray-700">
                        Sayfa {botPage} / {totalBotPages}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 border-gray-200"
                        onClick={() => setBotPage(Math.min(totalBotPages, botPage + 1))}
                        disabled={botPage === totalBotPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Selection */}
              <div className="flex flex-col border border-gray-200 rounded-md overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-medium mb-2 text-gray-900">Kullanıcı Seç</h3>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Kullanıcı Ara..."
                      className="pl-8 bg-white border-gray-200"
                      value={userSearchQuery}
                      onChange={(e) => {
                        setUserSearchQuery(e.target.value)
                      }}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[300px] bg-white">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer ${
                          selectedNewUser?.id === user.id ? "bg-kisstagram-pink_light" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedNewUser(user)}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10 border-2 border-kisstagram-pink">
                            <AvatarImage
                              src={
                                user.avatar || `/abstract-geometric-shapes.png?height=40&width=40&query=${user.name}`
                              }
                              alt={user.name}
                            />
                            <AvatarFallback className="bg-kisstagram-pink text-white">
                              {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {user.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-gray-900">{user.name}</p>
                          <p className="text-xs truncate text-gray-500">{user.email}</p>
                          <p className="text-xs truncate text-gray-500">
                            {user.location && `${user.location} • `}
                            {user.lastActive && `Son aktif: ${user.lastActive.split(" ")[0]}`}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">Kullanıcı bulunamadı</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
              <div className="text-sm">
                {selectedNewBot && selectedNewUser ? (
                  <span className="text-green-600">
                    {selectedNewBot.name} ve {selectedNewUser.name} arasında konuşma başlatılacak
                  </span>
                ) : (
                  <span className="text-gray-500">Konuşma başlatmak için bir bot ve kullanıcı seçin</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowNewConversationDialog(false)
                    setUserSearchQuery("")
                    setBotSearchQuery("")
                    setBotPage(1)
                  }}
                >
                  İptal
                </Button>
                <Button
                  variant="default"
                  className="bg-kisstagram-pink hover:bg-kisstagram-pink_dark"
                  disabled={!selectedNewBot || !selectedNewUser}
                  onClick={async () => {
                    if (selectedNewBot && selectedNewUser) {
                      try {
                        // Create a new conversation via the API
                        const newConversationData = {
                          userId: selectedNewUser.id,
                          botId: selectedNewBot.id,
                          status: "active" as const,
                          messageCount: 1,
                          userReplies: 0,
                          priority: "medium" as const,
                          isVipUser: false,
                          userJetons: 0,
                        }

                        await mockApi.conversations.create(newConversationData)

                        // Create initial system message
                        const initialMessageData = {
                          conversationId: `${selectedNewUser.id}-${selectedNewBot.id}`,
                          sender: "system" as const,
                          content: "Yeni konuşma başlatıldı.",
                        }

                        await mockApi.messages.create(initialMessageData)

                        // Update userBotRelations
                        setUserBotRelations((prev) => {
                          const newRelations = { ...prev }
                          if (!newRelations[selectedNewUser.id]) {
                            newRelations[selectedNewUser.id] = [selectedNewBot.id]
                          } else if (!newRelations[selectedNewUser.id].includes(selectedNewBot.id)) {
                            newRelations[selectedNewUser.id] = [...newRelations[selectedNewUser.id], selectedNewBot.id]
                          }
                          return newRelations
                        })

                        // Set the selected bot and user
                        setSelectedBot(selectedNewBot)
                        setSelectedUser(selectedNewUser)
                        setActiveConversation(`${selectedNewUser.id}-${selectedNewBot.id}`)

                        // Refresh conversations
                        await synchronizeConversations()

                        // Show success toast
                        toast({
                          title: "Konuşma Başlatıldı",
                          description: `${selectedNewUser.name} ve ${selectedNewBot.name} arasında yeni konuşma başlatıldı.`,
                          variant: "success",
                        })
                      } catch (err) {
                        console.error("Error creating new conversation:", err)
                        toast({
                          title: "Hata",
                          description: "Konuşma başlatılırken bir hata oluştu.",
                          variant: "destructive",
                        })
                      } finally {
                        // Close the dialog and reset states
                        setShowNewConversationDialog(false)
                        setSelectedNewBot(null)
                        setSelectedNewUser(null)
                        setUserSearchQuery("")
                        setBotSearchQuery("")
                        setBotPage(1)
                      }
                    }
                  }}
                >
                  Konuşma Başlat
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
