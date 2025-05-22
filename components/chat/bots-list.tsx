"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mockApi } from "@/services/api-mock"
import { Loader2 } from "lucide-react"

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

interface BotsListProps {
  searchQuery: string
  selectedBot: Bot | null
  onSelectBot: (bot: Bot) => void
}

export function BotsList({ searchQuery, selectedBot, onSelectBot }: BotsListProps) {
  const [bots, setBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // API'den bot verilerini yükle
  useEffect(() => {
    const loadBots = async () => {
      try {
        setLoading(true)
        setError(null)

        // API'den botları al
        const response = await mockApi.bots.getAll()

        // Sadece aktif botları filtrele
        const activeBots = response.data.filter((bot) => bot.status === "active")

        setBots(activeBots)
      } catch (err) {
        console.error("Botlar yüklenirken hata oluştu:", err)
        setError("Botlar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.")
      } finally {
        setLoading(false)
      }
    }

    loadBots()
  }, [])

  // Arama filtrelemesi
  const filteredBots = searchQuery
    ? bots.filter(
        (bot) =>
          (bot.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (bot.location?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (bot.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
      )
    : bots

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500 mr-2" />
        <p className="text-sm text-muted-foreground">Botlar yükleniyor...</p>
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

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {filteredBots.length > 0 ? (
          filteredBots.map((bot) => (
            <div
              key={bot.id}
              className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer transition-colors ${
                selectedBot?.id === bot.id
                  ? "bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20"
                  : "hover:bg-muted"
              }`}
              onClick={() => onSelectBot(bot)}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    src={bot.avatar || `/abstract-geometric-shapes.png?height=40&width=40&query=${bot.name}`}
                    alt={bot.name || "Bot"}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    {(bot.name || "B").substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {bot.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none">{bot.name || `Bot ${bot.id}`}</p>
                <p className="text-xs text-muted-foreground truncate">{bot.location || "Konum belirtilmemiş"}</p>
                <p className="text-xs text-muted-foreground">
                  {bot.relationshipGoal === "flirt" ? "flört" : bot.relationshipGoal || "İlişki hedefi belirtilmemiş"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            {searchQuery ? "Arama sonucu bulunamadı" : "Aktif bot bulunamadı"}
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
