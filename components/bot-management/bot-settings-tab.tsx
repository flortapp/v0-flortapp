"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save, Trash2 } from "lucide-react"

interface BotSettingsTabProps {
  botId: string
}

export function BotSettingsTab({ botId }: BotSettingsTabProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [botData, setBotData] = useState({
    id: "",
    name: "",
    description: "",
    avatar: "",
    status: "active",
    personality: "friendly",
    interests: [],
    greetingMessages: [],
    chatMessages: [],
    zeroJetonMessages: [],
    dailyInitiationLimit: 20,
    cooldownPeriodMinutes: 15,
    maxMessageCount: 30,
    maxDurationHours: 48,
    messagesPerToken: 10,
  })

  useEffect(() => {
    // Simulate fetching bot data
    const fetchBotData = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setBotData({
          id: botId,
          name: "Ayşe",
          description: "Friendly and outgoing bot with interests in music and travel",
          avatar: "/female-avatar.png",
          status: "active",
          personality: "friendly",
          interests: ["music", "travel", "movies"],
          greetingMessages: ["Merhaba! Nasılsın?", "Selam! Bugün nasıl geçiyor?", "Hey! Tanıştığımıza memnun oldum!"],
          chatMessages: [
            "Bu çok ilginç, devam et lütfen.",
            "Gerçekten mi? Daha fazla detay verebilir misin?",
            "Bunu duyduğuma üzüldüm. Nasıl hissediyorsun?",
          ],
          zeroJetonMessages: [
            "Jetonların bitti. Daha fazla konuşmak için jeton satın almalısın.",
            "Üzgünüm, jetonların tükendi. Konuşmaya devam etmek için jeton yükleyebilirsin.",
          ],
          dailyInitiationLimit: 20,
          cooldownPeriodMinutes: 15,
          maxMessageCount: 30,
          maxDurationHours: 48,
          messagesPerToken: 10,
        })
      } catch (error) {
        console.error("Error fetching bot data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (botId) {
      fetchBotData()
    }
  }, [botId])

  const handleSave = async () => {
    setSaving(true)
    try {
      // In a real app, this would be an API call to save the bot data
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // Success notification would go here
    } catch (error) {
      console.error("Error saving bot data:", error)
      // Error notification would go here
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
          <TabsTrigger value="messages">Mesaj Havuzları</TabsTrigger>
          <TabsTrigger value="limits">Konuşma Limitleri</TabsTrigger>
          <TabsTrigger value="advanced">Gelişmiş Ayarlar</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Genel Bot Ayarları</CardTitle>
              <CardDescription>Botun temel bilgilerini ve kişiliğini yapılandırın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Bot Adı</Label>
                  <Input
                    id="name"
                    value={botData.name}
                    onChange={(e) => setBotData({ ...botData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <Select value={botData.status} onValueChange={(value) => setBotData({ ...botData, status: value })}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Pasif</SelectItem>
                      <SelectItem value="maintenance">Bakımda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={botData.description}
                  onChange={(e) => setBotData({ ...botData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personality">Kişilik Tipi</Label>
                <Select
                  value={botData.personality}
                  onValueChange={(value) => setBotData({ ...botData, personality: value })}
                >
                  <SelectTrigger id="personality">
                    <SelectValue placeholder="Kişilik tipi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Arkadaş Canlısı</SelectItem>
                    <SelectItem value="flirty">Flörtöz</SelectItem>
                    <SelectItem value="mysterious">Gizemli</SelectItem>
                    <SelectItem value="intellectual">Entelektüel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Mesaj Havuzları</CardTitle>
              <CardDescription>Botun kullanacağı mesaj havuzlarını yapılandırın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="greetingMessages">Karşılama Mesajları</Label>
                <Textarea
                  id="greetingMessages"
                  value={botData.greetingMessages.join("\n")}
                  onChange={(e) =>
                    setBotData({
                      ...botData,
                      greetingMessages: e.target.value.split("\n").filter((msg) => msg.trim() !== ""),
                    })
                  }
                  rows={5}
                  placeholder="Her satıra bir mesaj yazın"
                />
                <p className="text-xs text-muted-foreground">
                  Bot konuşmayı başlattığında veya yönlendirildiğinde kullanılacak mesajlar
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chatMessages">Sohbet Mesajları</Label>
                <Textarea
                  id="chatMessages"
                  value={botData.chatMessages.join("\n")}
                  onChange={(e) =>
                    setBotData({
                      ...botData,
                      chatMessages: e.target.value.split("\n").filter((msg) => msg.trim() !== ""),
                    })
                  }
                  rows={5}
                  placeholder="Her satıra bir mesaj yazın"
                />
                <p className="text-xs text-muted-foreground">Normal sohbet akışında kullanılacak mesajlar</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zeroJetonMessages">Jeton Bitince Mesajlar</Label>
                <Textarea
                  id="zeroJetonMessages"
                  value={botData.zeroJetonMessages.join("\n")}
                  onChange={(e) =>
                    setBotData({
                      ...botData,
                      zeroJetonMessages: e.target.value.split("\n").filter((msg) => msg.trim() !== ""),
                    })
                  }
                  rows={5}
                  placeholder="Her satıra bir mesaj yazın"
                />
                <p className="text-xs text-muted-foreground">Kullanıcının jetonları bittiğinde kullanılacak mesajlar</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits">
          <Card>
            <CardHeader>
              <CardTitle>Konuşma Limitleri</CardTitle>
              <CardDescription>Botun konuşma başlatma ve sürdürme limitlerini yapılandırın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyInitiationLimit">Günlük Başlatma Limiti</Label>
                  <Input
                    id="dailyInitiationLimit"
                    type="number"
                    min="1"
                    max="100"
                    value={botData.dailyInitiationLimit}
                    onChange={(e) => setBotData({ ...botData, dailyInitiationLimit: Number.parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">Botun günde başlatabileceği maksimum konuşma sayısı</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cooldownPeriodMinutes">Bekleme Süresi (Dakika)</Label>
                  <Input
                    id="cooldownPeriodMinutes"
                    type="number"
                    min="1"
                    max="120"
                    value={botData.cooldownPeriodMinutes}
                    onChange={(e) => setBotData({ ...botData, cooldownPeriodMinutes: Number.parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">Bir konuşma başlattıktan sonra beklenecek süre</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxMessageCount">Maksimum Mesaj Sayısı</Label>
                  <Input
                    id="maxMessageCount"
                    type="number"
                    min="5"
                    max="100"
                    value={botData.maxMessageCount}
                    onChange={(e) => setBotData({ ...botData, maxMessageCount: Number.parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">Bir konuşmadaki maksimum toplam mesaj sayısı</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxDurationHours">Maksimum Süre (Saat)</Label>
                  <Input
                    id="maxDurationHours"
                    type="number"
                    min="1"
                    max="72"
                    value={botData.maxDurationHours}
                    onChange={(e) => setBotData({ ...botData, maxDurationHours: Number.parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">Bir konuşmanın maksimum süresi (saat cinsinden)</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="messagesPerToken">Jeton Başına Mesaj</Label>
                <Input
                  id="messagesPerToken"
                  type="number"
                  min="1"
                  max="20"
                  value={botData.messagesPerToken}
                  onChange={(e) => setBotData({ ...botData, messagesPerToken: Number.parseInt(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  Kullanıcının bir jeton karşılığında alabileceği mesaj sayısı
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Gelişmiş Ayarlar</CardTitle>
              <CardDescription>Botun gelişmiş ayarlarını yapılandırın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoRespond" className="block">
                    Otomatik Yanıt
                  </Label>
                  <p className="text-xs text-muted-foreground">Bot kullanıcı mesajlarına otomatik yanıt versin mi?</p>
                </div>
                <Switch id="autoRespond" checked={true} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="initiateConversations" className="block">
                    Konuşma Başlatma
                  </Label>
                  <p className="text-xs text-muted-foreground">Bot yeni kullanıcılarla konuşma başlatabilsin mi?</p>
                </div>
                <Switch id="initiateConversations" checked={true} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="useAI" className="block">
                    AI Kullanımı
                  </Label>
                  <p className="text-xs text-muted-foreground">Bot yanıtları için AI kullanılsın mı?</p>
                </div>
                <Switch id="useAI" checked={false} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          <span>Botu Sil</span>
        </Button>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-pink-600 to-red-500 flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Kaydediliyor...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Değişiklikleri Kaydet</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
