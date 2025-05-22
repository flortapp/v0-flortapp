"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Bot {
  id: string
  name: string
  email: string
  online: boolean
  location?: string
}

interface LiveChatBotsListProps {
  bots: Bot[]
  selectedBot?: Bot
  onSelectBot: (bot: Bot) => void
  getUnreadStatus: (botId: string) => boolean
}

export function LiveChatBotsList({ bots, selectedBot, onSelectBot, getUnreadStatus }: LiveChatBotsListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Arama işlemi
  const filteredBots = searchQuery
    ? bots.filter(
        (bot) =>
          bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bot.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : bots

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium mb-2 text-gray-900">Aktif Botlar</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Bot Ara..."
            className="pl-8 bg-gray-50 border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {filteredBots.length > 0 ? (
          filteredBots.map((bot) => {
            const isSelected = selectedBot?.id === bot.id
            const hasUnread = getUnreadStatus(bot.id)

            return (
              <div
                key={bot.id}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-all
                  ${isSelected ? "bg-kisstagram-pink_light" : "hover:bg-gray-50"}
                  ${hasUnread && !isSelected ? "border-r-4 border-r-kisstagram-pink" : "border-r-4 border-transparent"}
                `}
                onClick={() => onSelectBot(bot)}
              >
                <div className="relative">
                  <Avatar
                    className={`h-10 w-10 border-2 ${hasUnread && !isSelected ? "border-kisstagram-pink" : "border-gray-200"}`}
                  >
                    <AvatarImage
                      src={`/abstract-geometric-shapes.png?height=40&width=40&query=${bot.name}`}
                      alt={bot.name}
                    />
                    <AvatarFallback className="bg-kisstagram-pink text-white">
                      {bot.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {bot.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                  {hasUnread && !isSelected && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-kisstagram-pink border-2 border-white rounded-full"></span>
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
            )
          })
        ) : (
          <div className="p-4 text-center text-gray-500">Aktif bot bulunamadı</div>
        )}
      </div>
    </div>
  )
}
