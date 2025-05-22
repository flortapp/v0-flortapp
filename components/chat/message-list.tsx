"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

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

interface MessageListProps {
  messages: Message[]
  bot: Bot
  user: User
}

export function MessageList({ messages, bot, user }: MessageListProps) {
  // Mesaj zamanını formatla
  const formatMessageTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        // Bugün
        return format(date, "HH:mm", { locale: tr })
      } else if (diffDays === 1) {
        // Dün
        return `Dün ${format(date, "HH:mm", { locale: tr })}`
      } else if (diffDays < 7) {
        // Son bir hafta
        return format(date, "EEEE HH:mm", { locale: tr })
      } else {
        // Daha eski
        return format(date, "d MMMM HH:mm", { locale: tr })
      }
    } catch (error) {
      console.error("Tarih formatlanırken hata:", error)
      return timestamp
    }
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === "user" ? "justify-end" : message.sender === "system" ? "justify-center" : "justify-start"
          }`}
        >
          {message.sender === "bot" && (
            <Avatar className="h-8 w-8 mr-2 mt-1">
              <AvatarImage
                src={bot.avatar || `/abstract-geometric-shapes.png?height=32&width=32&query=${bot.name}`}
                alt={bot.name || "Bot"}
              />
              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
                {(bot.name || "B").substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}

          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.sender === "user"
                ? "bg-blue-100 dark:bg-blue-900/30 text-foreground"
                : message.sender === "system"
                  ? "bg-muted text-muted-foreground text-sm max-w-[90%]"
                  : "bg-orange-100 dark:bg-orange-900/30 text-foreground"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

            {message.image && (
              <div className="mt-2">
                <img
                  src={message.image || "/placeholder.svg"}
                  alt="Paylaşılan görsel"
                  className="rounded-lg max-w-full"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                    e.currentTarget.alt = "Görsel yüklenemedi"
                  }}
                />
              </div>
            )}

            {message.location && (
              <div className="mt-2 bg-background rounded-lg p-2 text-xs">
                <p className="font-medium">{message.location.placeName}</p>
                <p>{message.location.city}</p>
                <p className="text-muted-foreground mt-1">
                  {message.location.lat.toFixed(6)}, {message.location.lng.toFixed(6)}
                </p>
              </div>
            )}

            <p className="text-xs mt-1 opacity-70 text-right">{formatMessageTime(message.timestamp)}</p>
          </div>

          {message.sender === "user" && (
            <Avatar className="h-8 w-8 ml-2 mt-1">
              <AvatarImage
                src={user.avatar || `/abstract-geometric-shapes.png?height=32&width=32&query=${user.name}`}
                alt={user.name || "Kullanıcı"}
              />
              <AvatarFallback className="bg-blue-500 text-white text-xs">
                {(user.name || "K").substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
    </div>
  )
}
