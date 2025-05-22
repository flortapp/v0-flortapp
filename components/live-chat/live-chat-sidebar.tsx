"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, Pin } from "lucide-react"

export function BotChatSidebar() {
  const [selectedUser, setSelectedUser] = useState("1")
  const [searchQuery, setSearchQuery] = useState("")

  const users = [
    {
      id: "1",
      name: "Berke Cantepe",
      email: "berkecantepe@gmail.com",
      lastMessage: "Hahahah! Evet uzun zamandır görüşemiyoruz.",
      time: "1d",
      online: true,
      pinned: true,
    },
    {
      id: "2",
      name: "Hüseyin Altun",
      email: "huseyinaltun@gmail.com",
      lastMessage: "Merhaba, nasılsın?",
      time: "1d",
      online: false,
      pinned: false,
    },
    {
      id: "3",
      name: "Ramazan Çam",
      email: "ramazancam@gmail.com",
      lastMessage: "Teşekkür ederim, iyi günler.",
      time: "1d",
      online: false,
      pinned: false,
    },
    {
      id: "4",
      name: "Ahmet Uçar",
      email: "ahmetucar@gmail.com",
      lastMessage: "Yarın görüşelim mi?",
      time: "1d",
      online: false,
      pinned: false,
    },
    {
      id: "5",
      name: "Mustafa Uğur",
      email: "mustafaugur@gmail.com",
      lastMessage: "Tamam, anlaştık.",
      time: "1d",
      online: false,
      pinned: false,
    },
    {
      id: "6",
      name: "Kerim Almış",
      email: "kerimalmis@gmail.com",
      lastMessage: "Görüşmek üzere!",
      time: "1d",
      online: false,
      pinned: false,
    },
    {
      id: "7",
      name: "Bora Taşkıran",
      email: "borataskiran@gmail.com",
      lastMessage: "Teşekkürler!",
      time: "1d",
      online: false,
      pinned: false,
    },
  ]

  // Arama işlemi
  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : users

  return (
    <div className="flex flex-col h-full bg-[#171829]">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-medium mb-2">Kişiler</h2>
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
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`flex items-center gap-3 p-3 cursor-pointer relative ${
              selectedUser === user.id ? "bg-[#2b2c46]" : "hover:bg-[#1a1b2e]"
            }`}
            onClick={() => setSelectedUser(user.id)}
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
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-xs truncate text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground">{user.time}</span>
              {user.pinned && <Pin className="h-3 w-3 text-[#fa2674] rotate-45 mt-1" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
