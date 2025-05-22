"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { mockApi } from "@/services/api-mock"
import { Loader2, MessageSquare, Users, BarChart3, Settings, Heart } from "lucide-react"
import type { Bot } from "@/types/bot"
import type { Conversation } from "@/types/conversation"
import type { Match } from "@/types/match"

interface BotDetailDialogProps {
  botId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BotDetailDialog({ botId, open, onOpenChange }: BotDetailDialogProps) {
  const [bot, setBot] = useState<Bot | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBotDetails = async () => {
      if (!open || !botId) return

      try {
        setLoading(true)
        setError(null)

        // Fetch bot details
        const botResponse = await mockApi.bots.getById(botId)
        setBot(botResponse.data)

        // Fetch bot conversations
        const conversationsResponse = await mockApi.conversations.getByBotId(botId)
        setConversations(conversationsResponse.data)

        // Fetch bot matches
        const matchesResponse = await mockApi.matches.getByBotId(botId)
        setMatches(matchesResponse.data)
      } catch (err) {
        console.error("Error fetching bot details:", err)
        setError("Bot detayları yüklenirken bir hata oluştu.")
      } finally {
        setLoading(false)
      }
    }

    fetchBotDetails()
  }, [botId, open])

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p>Bot detayları yükleniyor...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error || !bot) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Hata</DialogTitle>
            <DialogDescription>
              {error || "Bot detayları yüklenirken bir hata oluştu. Lütfen tekrar deneyin."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Kapat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Calculate statistics
  const activeConversations = conversations.filter((c) => c.status === "active").length
  const escalatedConversations = conversations.filter((c) => c.status === "escalated").length
  const acceptedMatches = matches.filter((m) => m.status === "accepted").length
  const pendingMatches = matches.filter((m) => m.status === "pending").length
  const averageMatchScore = matches.length
    ? Math.round(matches.reduce((sum, match) => sum + match.score, 0) / matches.length)
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={bot.avatar || "/placeholder.svg"} alt={bot.name} />
              <AvatarFallback>{bot.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl">{bot.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Badge variant={bot.status === "active" ? "success" : "secondary"}>
                  {bot.status === "active" ? "Aktif" : "İnaktif"}
                </Badge>
                <span className="text-sm">
                  {bot.gender === "female" ? "Kadın" : "Erkek"}, {bot.age} yaşında
                </span>
                {bot.location && <span className="text-sm">• {bot.location}</span>}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="profile">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="profile" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Profil</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>İstatistikler</span>
            </TabsTrigger>
            <TabsTrigger value="conversations" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>Konuşmalar</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>Ayarlar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Biyografi</h3>
                <p className="text-sm text-muted-foreground">{bot.bio}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">İlgi Alanları</h3>
                <div className="flex flex-wrap gap-2">
                  {bot.interests.map((interest) => (
                    <Badge key={interest} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Eşleşme Kriterleri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Yaş Aralığı</p>
                    <p className="text-sm text-muted-foreground">
                      {bot.matchCriteria.minAge} - {bot.matchCriteria.maxAge} yaş
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tercih Edilen Cinsiyet</p>
                    <p className="text-sm text-muted-foreground">
                      {bot.matchCriteria.preferredGender === "male"
                        ? "Erkek"
                        : bot.matchCriteria.preferredGender === "female"
                          ? "Kadın"
                          : "Herhangi"}
                    </p>
                  </div>
                  {bot.matchCriteria.preferredLocation && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium">Tercih Edilen Konum</p>
                      <p className="text-sm text-muted-foreground">{bot.matchCriteria.preferredLocation.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Toplam Konuşma</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{conversations.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeConversations} aktif, {escalatedConversations} yükseltilmiş
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Eşleşmeler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{matches.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {acceptedMatches} kabul edilmiş, {pendingMatches} beklemede
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ortalama Eşleşme Skoru</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageMatchScore}%</div>
                  <p className="text-xs text-muted-foreground mt-1">{matches.length} eşleşme üzerinden hesaplandı</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">En Yüksek Eşleşme Skorları</h3>
              <div className="space-y-4">
                {matches
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 5)
                  .map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`/abstract-geometric-shapes.png?height=40&width=40&query=user-${match.userId}`}
                            alt={`User ${match.userId}`}
                          />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Kullanıcı {match.userId}</p>
                          <p className="text-xs text-muted-foreground">
                            {match.commonInterests.slice(0, 3).join(", ")}
                            {match.commonInterests.length > 3 ? "..." : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={match.score > 75 ? "success" : match.score > 50 ? "warning" : "outline"}
                          className="flex items-center gap-1"
                        >
                          <Heart className="h-3 w-3" />
                          <span>{match.score}%</span>
                        </Badge>
                        <Badge
                          variant={
                            match.status === "accepted"
                              ? "success"
                              : match.status === "pending"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {match.status === "accepted"
                            ? "Kabul Edildi"
                            : match.status === "pending"
                              ? "Beklemede"
                              : "Reddedildi"}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="conversations">
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Son Konuşmalar</h3>
              {conversations.length > 0 ? (
                conversations
                  .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
                  .slice(0, 10)
                  .map((conversation) => (
                    <div key={conversation.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={`/abstract-geometric-shapes.png?height=40&width=40&query=user-${conversation.userId}`}
                              alt={`User ${conversation.userId}`}
                            />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Kullanıcı {conversation.userId}</p>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  conversation.status === "active"
                                    ? "success"
                                    : conversation.status === "escalated"
                                      ? "destructive"
                                      : conversation.status === "pending"
                                        ? "warning"
                                        : "outline"
                                }
                              >
                                {conversation.status === "active"
                                  ? "Aktif"
                                  : conversation.status === "escalated"
                                    ? "Yükseltilmiş"
                                    : conversation.status === "pending"
                                      ? "Beklemede"
                                      : "Çözüldü"}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{conversation.messageCount} mesaj</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(conversation.lastMessageAt).toLocaleDateString("tr-TR")}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-muted-foreground text-center py-4">Henüz konuşma bulunmuyor.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Mesaj Şablonları</h3>
                <Separator className="my-2" />

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Karşılama Mesajları</h4>
                    <div className="space-y-2">
                      {bot.messageTemplates.greeting.map((template, index) => (
                        <div key={index} className="p-2 border rounded-md text-sm">
                          {template}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Sohbet Mesajları</h4>
                    <div className="space-y-2">
                      {bot.messageTemplates.chat.map((template, index) => (
                        <div key={index} className="p-2 border rounded-md text-sm">
                          {template}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Jeton Bitti Mesajları</h4>
                    <div className="space-y-2">
                      {bot.messageTemplates.zeroCredit.map((template, index) => (
                        <div key={index} className="p-2 border rounded-md text-sm">
                          {template}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Yanıt Gecikmesi</h3>
                <Separator className="my-2" />
                <p className="text-sm">
                  {bot.responseDelay === "fast"
                    ? "Hızlı (30 saniye - 2 dakika)"
                    : bot.responseDelay === "medium"
                      ? "Orta (2 - 5 dakika)"
                      : "Yavaş (5 - 15 dakika)"}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Kapat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
