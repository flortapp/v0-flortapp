"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BotStatistics } from "@/components/bot-management/bot-statistics"
import { BotsList } from "@/components/bot-management/bots-list"
import { ConversationMetrics } from "@/components/bot-management/conversation-metrics"
import { Button } from "@/components/ui/button"
import { PlusCircle, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export function BotDashboard() {
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bot Yönetimi</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => router.push("/bot-settings")}>
            <Settings className="h-4 w-4" />
            <span>Bot Ayarları</span>
          </Button>
          <Button
            className="bg-gradient-to-r from-pink-600 to-red-500 flex items-center gap-2"
            onClick={() => router.push("/create-bot")}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Yeni Bot Oluştur</span>
          </Button>
        </div>
      </div>

      {/* Bot Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BotStatistics title="Aktif Botlar" value="124" change="+12%" trend="up" description="Son 30 günde" />
        <BotStatistics title="Toplam Konuşmalar" value="8,432" change="+23%" trend="up" description="Son 30 günde" />
        <BotStatistics
          title="Yükseltilen Konuşmalar"
          value="1,287"
          change="+18%"
          trend="up"
          description="Son 30 günde"
        />
      </div>

      {/* Conversation Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Konuşma Metrikleri</CardTitle>
          <CardDescription>Botların konuşma başarı oranları ve kullanıcı etkileşimleri</CardDescription>
        </CardHeader>
        <CardContent>
          <ConversationMetrics />
        </CardContent>
      </Card>

      {/* Bot List */}
      <Card>
        <CardHeader>
          <CardTitle>Bot Listesi</CardTitle>
          <CardDescription>Tüm botları görüntüleyin ve yönetin</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tüm Botlar</TabsTrigger>
              <TabsTrigger value="active">Aktif</TabsTrigger>
              <TabsTrigger value="inactive">Pasif</TabsTrigger>
              <TabsTrigger value="escalated">Yükseltilmiş</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <BotsList filter="all" />
            </TabsContent>
            <TabsContent value="active">
              <BotsList filter="active" />
            </TabsContent>
            <TabsContent value="inactive">
              <BotsList filter="inactive" />
            </TabsContent>
            <TabsContent value="escalated">
              <BotsList filter="escalated" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
