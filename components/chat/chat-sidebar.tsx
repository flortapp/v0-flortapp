"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BotsList } from "./bots-list"
import { UsersList } from "./users-list"

export function ChatSidebar() {
  const [activeTab, setActiveTab] = useState("bots")

  return (
    <div className="h-full flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Tabs defaultValue="bots" className="h-full flex flex-col" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 bg-gray-50 border-b border-gray-200 rounded-none">
          <TabsTrigger value="bots">Botlar</TabsTrigger>
          <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
        </TabsList>

        <TabsContent value="bots" className="flex-1 overflow-hidden p-0">
          <BotsList />
        </TabsContent>

        <TabsContent value="users" className="flex-1 overflow-hidden p-0">
          <UsersList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
