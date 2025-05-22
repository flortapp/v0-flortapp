"use client"

import { useState } from "react"
import { BotRedirectionAnalytics } from "@/components/live-chat/bot-redirection-analytics"
import { RedirectionHistory } from "@/components/live-chat/redirection-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BotRedirectionsPage() {
  const [activeTab, setActiveTab] = useState("analytics")

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Bot Yönlendirme Yönetimi</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
          <TabsTrigger value="history">Geçmiş</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-6">
          <BotRedirectionAnalytics />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <RedirectionHistory limit={10} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
