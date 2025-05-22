// Remove this component as we're now handling the user list directly in the LiveChatContent component
// This will prevent any unintended modifications to the user list functionality

"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, Pin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface User {
  id: string
  name: string
  email: string
  online: boolean
  lastActive?: string
  botIds?: string[]
  hasUnreadMessages?: boolean
}

interface Bot {
  id: string
  name: string
  email: string
  online: boolean
}

interface LiveChatUsersListProps {
  users: User[]
  selectedBot: Bot
  selectedUser: User | null
  onSelectUser: (user: User) => void
  pinnedUsers: string[]
  onTogglePinUser: (userId: string) => void
}

// This component is no longer used as we've integrated its functionality directly into LiveChatContent
export function LiveChatUsersList({
  users,
  selectedBot,
  selectedUser,
  onSelectUser,
  pinnedUsers,
  onTogglePinUser,
}: LiveChatUsersListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Arama işlemi
  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : users

  // Pinlenmiş kullanıcıları üste getir
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aIsPinned = pinnedUsers.includes(a.id)
    const bIsPinned = pinnedUsers.includes(b.id)

    if (aIsPinned && !bIsPinned) return -1
    if (!aIsPinned && bIsPinned) return 1
    return 0
  })

  return (
    <div className="flex flex-col h-full bg-[#171829]">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-medium mb-2">{selectedBot.name} - Kişiler</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Kişi Ara..."
            className="pl-8 bg-[#1a1b2e] border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {sortedUsers.length > 0 ? (
          sortedUsers.map((user) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-3 cursor-pointer relative ${
                selectedUser?.id === user.id ? "bg-[#2b2c46]" : "hover:bg-[#1a1b2e]"
              }`}
              onClick={() => onSelectUser(user)}
            >
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-[#fa2674]">
                  <AvatarImage
                    src={`/abstract-geometric-shapes.png?height=40&width=40&query=${user.name}`}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-[#fa2674] text-white">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {user.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#171829] rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`font-medium truncate ${
                      user.hasUnreadMessages && selectedUser?.id !== user.id ? "text-[#fa2674]" : ""
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
                      onTogglePinUser(user.id)
                    }}
                  >
                    <Pin
                      className={`h-3 w-3 ${pinnedUsers.includes(user.id) ? "text-[#fa2674] rotate-45" : "text-gray-500"}`}
                    />
                  </Button>
                </div>
                <p className="text-xs truncate text-muted-foreground">{user.email}</p>
              </div>
              <div className="text-xs text-muted-foreground hidden sm:block">
                {user.lastActive ? user.lastActive.split(" ")[0] : ""}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">Bu botla konuşan kullanıcı bulunamadı</div>
        )}
      </div>
    </div>
  )
}
