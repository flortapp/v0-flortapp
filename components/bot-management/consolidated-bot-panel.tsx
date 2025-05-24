"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BotSettingsTab } from "@/components/bot-management/bot-settings-tab"
import { ConversationHistoryTab } from "@/components/bot-management/conversation-history-tab"
import { ResolvedConversationsTab } from "@/components/bot-management/resolved-conversations-tab"
import { BotPerformanceTab } from "@/components/bot-management/bot-performance-tab"
import { BotsList } from "@/components/bot-management/bots-list"
import { Button } from "@/components/ui/button"
import { PlusCircle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function ConsolidatedBotPanel() {
  const [selectedBot, setSelectedBot] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("settings")
  const router = useRouter()

  // If no bot is selected, show the bot selection screen
  if (!selectedBot) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bot Yönetimi</h1>
          <Button
            className="bg-gradient-to-r from-pink-600 to-red-500 flex items-center gap-2"
            onClick={() => router.push("/bot-management/create")}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Yeni Bot Oluştur</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bot Seçimi</CardTitle>
            <CardDescription>Yönetmek istediğiniz botu seçin</CardDescription>
          </CardHeader>
          <CardContent>
            <BotsList onSelectBot={(botId) => setSelectedBot(botId)} selectionMode={true} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedBot(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Bot Yönetimi</h1>
        </div>
      </div>

      <Tabs defaultValue="settings" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="settings">Bot Ayarları</TabsTrigger>
          <TabsTrigger value="active">Aktif Konuşmalar</TabsTrigger>
          <TabsTrigger value="resolved">Çözülmüş Konuşmalar</TabsTrigger>
          <TabsTrigger value="performance">Performans</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <BotSettingsTab botId={selectedBot} />
        </TabsContent>

        <TabsContent value="active">
          <ConversationHistoryTab botId={selectedBot} status="active" />
        </TabsContent>

        <TabsContent value="resolved">
          <ResolvedConversationsTab botId={selectedBot} />
        </TabsContent>

        <TabsContent value="performance">
          <BotPerformanceTab botId={selectedBot} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
