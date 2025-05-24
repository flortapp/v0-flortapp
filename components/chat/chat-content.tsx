"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, MessageSquarePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BotsList } from "./bots-list"
import { UsersList } from "./users-list"
import { ChatInterface } from "./chat-interface"

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

export function ChatContent() {
  // State tanımlamaları
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("bots")
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false)

  // Bot seçme işlevi
  const handleSelectBot = (bot: Bot) => {
    setSelectedBot(bot)
    setSelectedUser(null) // Bot değiştiğinde kullanıcı seçimini sıfırla
    setActiveTab("users") // Bot seçildiğinde kullanıcılar sekmesine geç
  }

  // Kullanıcı seçme işlevi
  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
  }

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sohbet</h1>
        <Button
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          onClick={() => setShowNewConversationDialog(true)}
        >
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          Yeni Konuşma
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
        {/* Sol Panel - Bot ve Kullanıcı Listeleri */}
        <div className="md:col-span-4 lg:col-span-3 border rounded-lg overflow-hidden bg-card h-full flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Ara..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="bots" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="bots">Botlar</TabsTrigger>
              <TabsTrigger value="users" disabled={!selectedBot}>
                Kullanıcılar
              </TabsTrigger>
            </TabsList>
            <TabsContent value="bots" className="flex-1 overflow-hidden">
              <BotsList searchQuery={searchQuery} selectedBot={selectedBot} onSelectBot={handleSelectBot} />
            </TabsContent>
            <TabsContent value="users" className="flex-1 overflow-hidden">
              <UsersList
                searchQuery={searchQuery}
                selectedUser={selectedUser}
                onSelectUser={handleSelectUser}
                selectedBot={selectedBot}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sağ Panel - Sohbet Arayüzü */}
        <div className="md:col-span-8 lg:col-span-9 border rounded-lg overflow-hidden bg-card h-full">
          <ChatInterface selectedBot={selectedBot} selectedUser={selectedUser} />
        </div>
      </div>

      {/* Yeni Konuşma Dialog'u buraya eklenecek */}
    </div>
  )
}
