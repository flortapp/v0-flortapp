"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mockApi } from "@/services/api-mock"
import { Loader2, Pin } from "lucide-react"
import { Button } from "@/components/ui/button"

// User tipi tanımı
interface User {
  id: string
  name: string
  avatar?: string
  status?: string
  online?: boolean
  location?: string
  lastActive?: string
  email?: string
  age?: number
  isVip?: boolean
  credits?: number
  birthDate?: string
  interests?: string[]
  gender?: string
  registrationMethod?: string
}

// Bot tipi tanımı
interface Bot {
  id: string
  name: string
  avatar?: string
  status: string
  online?: boolean
  location?: string
  lastActive?: string
  email?: string
  age?: number
  bio?: string
  relationshipGoal?: string
  messageTemplates?: any
  createdAt?: string
  interests?: string[]
}

// Conversation tipi tanımı
interface Conversation {
  id: string
  userId: string
  botId: string
  status: string
  startedAt: string
  lastMessageAt: string
  messageCount: number
  userMessageCount: number
  botMessageCount: number
  matchScore?: number
  priority?: string
  escalatedAt?: string
  escalatedReason?: string
  isPinned?: boolean
  hasUnreadMessages?: boolean
}

interface UsersListProps {
  searchQuery: string
  selectedUser: User | null
  selectedBot: Bot | null
  onSelectUser: (user: User) => void
}

// Son görülme bilgisini formatla
function formatLastSeen(lastActive: string | undefined): string {
  if (!lastActive) return "Son görülme bilinmiyor"

  try {
    const lastActiveDate = new Date(lastActive)
    const now = new Date()
    const diffMs = now.getTime() - lastActiveDate.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffWeeks = Math.floor(diffDays / 7)
    const diffMonths = Math.floor(diffDays / 30)

    if (diffMins < 1) return "Az önce"
    if (diffMins < 60) return `${diffMins} dakika önce`
    if (diffHours < 24) return `${diffHours} saat önce`
    if (diffDays === 1) return "Dün"
    if (diffDays < 7) return `${diffDays} gün önce`
    if (diffWeeks === 1) return "1 hafta önce"
    if (diffWeeks < 4) return `${diffWeeks} hafta önce`
    if (diffMonths === 1) return "1 ay önce"
    if (diffMonths < 12) return `${diffMonths} ay önce`
    return "1 yıldan fazla"
  } catch (error) {
    console.error("Tarih formatı hatası:", error)
    return "Son görülme bilinmiyor"
  }
}

export function UsersList({ searchQuery, selectedUser, selectedBot, onSelectUser }: UsersListProps) {
  const [users, setUsers] = useState<User[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pinnedConversations, setPinnedConversations] = useState<Record<string, boolean>>({})

  // API'den kullanıcı ve konuşma verilerini yükle
  useEffect(() => {
    const loadData = async () => {
      if (!selectedBot) return

      try {
        setLoading(true)
        setError(null)

        // Kullanıcıları al
        const usersResponse = await mockApi.users.getAll()
        const activeUsers = usersResponse.data.filter((user) => user.status === "active")
        setUsers(activeUsers)

        // Konuşmaları al
        const conversationsResponse = await mockApi.conversations.getAll()

        // Seçili bot ile ilgili konuşmaları filtrele
        const botConversations = conversationsResponse.data.filter((conv) => conv.botId === selectedBot.id)

        setConversations(botConversations)

        // Sabitlenmiş konuşmaları ayarla (örnek olarak)
        const pinned: Record<string, boolean> = {}
        botConversations.forEach((conv) => {
          // Rastgele bazı konuşmaları sabitle (gerçek uygulamada API'den gelecek)
          pinned[conv.userId] = Math.random() > 0.7
        })
        setPinnedConversations(pinned)
      } catch (err) {
        console.error("Kullanıcılar yüklenirken hata oluştu:", err)
        setError("Kullanıcılar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [selectedBot])

  // Seçili bot ile konuşan kullanıcıları filtrele
  const usersWithConversations = users.filter((user) => conversations.some((conv) => conv.userId === user.id))

  // Arama filtrelemesi
  const filteredUsers = searchQuery
    ? usersWithConversations.filter(
        (user) =>
          (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (user.location?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
      )
    : usersWithConversations

  // Kullanıcıları sırala: önce sabitlenmiş, sonra son mesaj tarihine göre
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    // Önce sabitlenmiş konuşmalar
    if (pinnedConversations[a.id] && !pinnedConversations[b.id]) return -1
    if (!pinnedConversations[a.id] && pinnedConversations[b.id]) return 1

    // Sonra son mesaj tarihine göre
    const aConv = conversations.find((c) => c.userId === a.id)
    const bConv = conversations.find((c) => c.userId === b.id)

    if (aConv && bConv) {
      return new Date(bConv.lastMessageAt).getTime() - new Date(aConv.lastMessageAt).getTime()
    }

    return 0
  })

  // Konuşma sabitleme işlevi
  const togglePin = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPinnedConversations((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500 mr-2" />
        <p className="text-sm text-muted-foreground">Kullanıcılar yükleniyor...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-red-500 mb-2">{error}</p>
        <button
          className="text-xs text-orange-500 hover:text-orange-600 underline"
          onClick={() => window.location.reload()}
        >
          Yeniden Dene
        </button>
      </div>
    )
  }

  if (!selectedBot) {
    return <div className="p-4 text-center text-muted-foreground">Lütfen önce bir bot seçin</div>
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {sortedUsers.length > 0 ? (
          sortedUsers.map((user) => {
            const conversation = conversations.find((c) => c.userId === user.id)
            const hasUnread = conversation?.hasUnreadMessages || false
            const isPinned = pinnedConversations[user.id] || false

            return (
              <div
                key={user.id}
                className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedUser?.id === user.id
                    ? "bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20"
                    : "hover:bg-muted"
                }`}
                onClick={() => onSelectUser(user)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage
                      src={user.avatar || `/abstract-geometric-shapes.png?height=40&width=40&query=${user.name}`}
                      alt={user.name || "Kullanıcı"}
                    />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {(user.name || "K").substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {user.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                  )}
                  {hasUnread && selectedUser?.id !== user.id && (
                    <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-background"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-medium leading-none ${
                        hasUnread && selectedUser?.id !== user.id ? "text-orange-600" : ""
                      }`}
                    >
                      {user.name || `Kullanıcı ${user.id}`}
                    </p>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => togglePin(user.id, e)}>
                      <Pin
                        className={`h-3.5 w-3.5 ${isPinned ? "text-orange-500 -rotate-45" : "text-muted-foreground"}`}
                      />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{user.location || "Konum belirtilmemiş"}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.online ? "Şimdi aktif" : formatLastSeen(user.lastActive)}
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            {searchQuery ? "Arama sonucu bulunamadı" : `${selectedBot.name} ile konuşan kullanıcı bulunamadı`}
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
