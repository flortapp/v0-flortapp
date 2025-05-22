"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { DefaultMessageTemplates } from "./default-message-templates"
import { BotResponseSettings } from "./bot-response-settings"
import { AutomationRules } from "./automation-rules"

export function BotAutomationSettings() {
  const [activeTab, setActiveTab] = useState("response-settings")
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Bot yanıt süresi ayarları
  const [responseDelay, setResponseDelay] = useState("medium")
  const [responseDelaySeconds, setResponseDelaySeconds] = useState(15)

  // Yükseltme ayarları
  const [escalateOnNoTemplate, setEscalateOnNoTemplate] = useState(true)
  const [escalateOnKeywords, setEscalateOnKeywords] = useState(true)
  const [escalateAfterMessages, setEscalateAfterMessages] = useState(true)
  const [maxMessages, setMaxMessages] = useState(30)

  const handleSaveSettings = async () => {
    setIsLoading(true)

    try {
      // Simüle edilmiş API çağrısı
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Ayarlar kaydedildi",
        description: "Bot otomasyon ayarları başarıyla güncellendi.",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ayarlar kaydedilirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bot Otomasyonu</CardTitle>
          <CardDescription>Botların mesaj şablonlarını ve yanıt ayarlarını yapılandırın.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="response-settings">Yanıt Ayarları</TabsTrigger>
              <TabsTrigger value="automation-rules">Otomasyon Kuralları</TabsTrigger>
              <TabsTrigger value="message-templates">Mesaj Şablonları</TabsTrigger>
            </TabsList>

            <TabsContent value="response-settings">
              <BotResponseSettings />
            </TabsContent>

            <TabsContent value="automation-rules">
              <AutomationRules />
            </TabsContent>

            <TabsContent value="message-templates">
              <DefaultMessageTemplates />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isLoading} className="bg-gradient-to-r from-pink-600 to-red-500">
          {isLoading ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </Button>
      </div>
    </div>
  )
}
