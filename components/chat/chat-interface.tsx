"use client"

import { useState, useEffect } from "react"
import { EmptyState } from "./empty-state"
import { MessageList } from "./message-list"
import { mockApi } from "@/services/api-mock"
import { Loader2, Send, Smile, Paperclip, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

// Bot ve User tipleri
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

// Message tipi tanımı
interface Message {
  id: string
  conversationId: string
  sender: "user" | "bot" | "system"
  content: string
  timestamp: string
  read: boolean
  templateId?: string
  creditCost?: number
  image?: string
  location?: {
    lat: number
    lng: number
    placeName: string
    city: string
  }
}

interface ChatInterfaceProps {
  selectedBot: Bot | null
  selectedUser: User | null
}

export function ChatInterface({ selectedBot, selectedUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")

  // Mesajları yükle
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedBot || !selectedUser) {
        setMessages([])
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Konuşmayı bul
        const conversationsResponse = await mockApi.conversations.getAll()
        const conversation = conversationsResponse.data.find(
          (conv) => conv.botId === selectedBot.id && conv.userId === selectedUser.id,
        )

        if (conversation) {
          // Konuşma mesajlarını al
          const messagesResponse = await mockApi.messages.getByConversationId(conversation.id)
          setMessages(messagesResponse.data)
        } else {
          // Konuşma yoksa boş mesaj listesi
          setMessages([])
        }
      } catch (err) {
        console.error("Mesajlar yüklenirken hata oluştu:", err)
        setError("Mesajlar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.")
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [selectedBot, selectedUser])

  // Mesaj gönderme işlevi
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedBot || !selectedUser) return

    try {
      // Konuşmayı bul veya oluştur
      const conversationsResponse = await mockApi.conversations.getAll()
      let conversation = conversationsResponse.data.find(
        (conv) => conv.botId === selectedBot.id && conv.userId === selectedUser.id,
      )

      if (!conversation) {
        // Konuşma yoksa yeni oluştur
        const newConversationResponse = await mockApi.conversations.create({
          botId: selectedBot.id,
          userId: selectedUser.id,
          status: "active",
        })
        conversation = newConversationResponse.data
      }

      // Mesajı gönder
      await mockApi.messages.create({
        conversationId: conversation.id,
        sender: "bot",
        content: inputValue,
        timestamp: new Date().toISOString(),
        read: false,
      })

      // Mesajları yeniden yükle
      const messagesResponse = await mockApi.messages.getByConversationId(conversation.id)
      setMessages(messagesResponse.data)

      // Input'u temizle
      setInputValue("")
    } catch (err) {
      console.error("Mesaj gönderme hatası:", err)
      setError("Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.")
    }
  }

  if (!selectedBot || !selectedUser) {
    return <EmptyState />
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sohbet Başlığı */}
      <div className="border-b p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage
                src={
                  selectedUser.avatar || `/abstract-geometric-shapes.png?height=32&width=32&query=${selectedUser.name}`
                }
                alt={selectedUser.name || "Kullanıcı"}
              />
              <AvatarFallback className="bg-blue-500 text-white">
                {(selectedUser.name || "K").substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{selectedUser.name || `Kullanıcı ${selectedUser.id}`}</p>
              <p className="text-xs text-muted-foreground">
                {selectedUser.online ? "Çevrimiçi" : "Çevrimdışı"}
                {selectedUser.location ? ` • ${selectedUser.location}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <p className="text-xs text-muted-foreground mr-2">Bot olarak konuşuyorsunuz:</p>
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={
                  selectedBot.avatar || `/abstract-geometric-shapes.png?height=24&width=24&query=${selectedBot.name}`
                }
                alt={selectedBot.name || "Bot"}
              />
              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
                {(selectedBot.name || "B").substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Kullanıcı Bilgileri */}
        <div className="mt-2 flex flex-wrap gap-2">
          {/* Jeton Sayısı */}
          <div className="bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5 flex items-center text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clipRule="evenodd"
              />
            </svg>
            {selectedUser.credits || 0} Jeton
          </div>

          {/* İlişki Hedefi */}
          {selectedUser.relationshipGoal && (
            <div className="bg-pink-50 text-pink-700 border border-pink-200 rounded-full px-2 py-0.5 flex items-center text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              {selectedUser.relationshipGoal === "flirt"
                ? "Flört"
                : selectedUser.relationshipGoal === "serious"
                  ? "Ciddi İlişki"
                  : selectedUser.relationshipGoal === "friendship"
                    ? "Arkadaşlık"
                    : selectedUser.relationshipGoal === "casual"
                      ? "Gündelik"
                      : selectedUser.relationshipGoal}
            </div>
          )}

          {/* İlgi Alanları */}
          {selectedUser.interests && selectedUser.interests.length > 0 && (
            <div className="bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-0.5 flex items-center text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              {selectedUser.interests.slice(0, 3).join(", ")}
              {selectedUser.interests.length > 3 && ` +${selectedUser.interests.length - 3}`}
            </div>
          )}
        </div>
      </div>

      {/* Mesaj Listesi */}
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500 mr-2" />
            <p className="text-sm text-muted-foreground">Mesajlar yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <button
              className="text-xs text-orange-500 hover:text-orange-600 underline"
              onClick={() => window.location.reload()}
            >
              Yeniden Dene
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Henüz mesaj yok</p>
              <p className="text-sm text-muted-foreground">
                {selectedBot.name} olarak {selectedUser.name} ile konuşmaya başlayın
              </p>
            </div>
          </div>
        ) : (
          <MessageList messages={messages} bot={selectedBot} user={selectedUser} />
        )}
      </ScrollArea>

      {/* Mesaj Giriş Alanı */}
      <div className="border-t p-3">
        <div className="relative">
          <Textarea
            placeholder={`${selectedBot.name} olarak mesaj yazın...`}
            className="min-h-[80px] resize-none pr-24"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <div className="absolute bottom-2 right-2 flex space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Smile className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button
              className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
