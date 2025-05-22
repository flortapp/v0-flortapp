"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, ArrowUpRight, User, Clock, Bot, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ConversationStatus, ConversationPriority } from "@/types/conversation"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { mockApi } from "@/services/api-mock"
import { ConversationLocationIndicator } from "@/components/live-chat/conversation-location-indicator"
import { conversationTransitionService } from "@/services/conversation-transition-service"

interface EscalatedConversation {
  id: string
  userId: string
  botId: string
  status: ConversationStatus
  startedAt: string
  lastMessageAt: string
  messageCount: number
  userMessageCount: number
  botMessageCount: number
  matchScore: number
  priority: ConversationPriority
  escalatedAt?: string
  escalatedReason?: string
  resolvedAt?: string
  resolvedBy?: string
  user?: {
    name: string
    avatar: string
    isVip: boolean
  }
  bot?: {
    name: string
    avatar: string
  }
}

export function EscalationQueue() {
  const [conversations, setConversations] = useState<EscalatedConversation[]>([])
  const [filteredConversations, setFilteredConversations] = useState<EscalatedConversation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<ConversationPriority | "all">("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "priority">("priority")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Dialog states
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [conversationToResolve, setConversationToResolve] = useState<string | null>(null)

  // Bot selection dialog
  const [isBotSelectionDialogOpen, setIsBotSelectionDialogOpen] = useState(false)
  const [conversationToTransfer, setConversationToTransfer] = useState<string | null>(null)
  const [selectedBot, setSelectedBot] = useState<string>("")
  const [availableBots, setAvailableBots] = useState<{ id: string; name: string }[]>([])

  // Load conversations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch escalated conversations
        const response = await mockApi.conversations.getByStatus("escalated")
        const escalatedConversations = response.data

        // Fetch user and bot details for each conversation
        const enrichedConversations = await Promise.all(
          escalatedConversations.map(async (conv) => {
            try {
              const userResponse = await mockApi.users.getById(conv.userId)
              const botResponse = await mockApi.bots.getById(conv.botId)

              return {
                ...conv,
                user: {
                  name: userResponse.data.name,
                  avatar: userResponse.data.avatar,
                  isVip: userResponse.data.isVip,
                },
                bot: {
                  name: botResponse.data.name,
                  avatar: botResponse.data.avatar,
                },
              }
            } catch (err) {
              console.error(`Error fetching details for conversation ${conv.id}:`, err)
              return {
                ...conv,
                user: { name: `User ${conv.userId}`, avatar: "", isVip: false },
                bot: { name: `Bot ${conv.botId}`, avatar: "" },
              }
            }
          }),
        )

        setConversations(enrichedConversations)

        // Fetch available bots for transfer
        const botsResponse = await mockApi.bots.getAll()
        setAvailableBots(
          botsResponse.data.map((bot) => ({
            id: bot.id,
            name: bot.name,
          })),
        )
      } catch (err) {
        console.error("Error fetching escalated conversations:", err)
        setError("Yükseltilmiş konuşmalar yüklenirken bir hata oluştu.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...conversations]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((conv) => conv.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((conv) => conv.priority === priorityFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (conv) =>
          conv.id.toLowerCase().includes(query) ||
          (conv.user?.name || "").toLowerCase().includes(query) ||
          (conv.bot?.name || "").toLowerCase().includes(query),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
      } else if (sortOrder === "oldest") {
        return new Date(a.lastMessageAt).getTime() - new Date(b.lastMessageAt).getTime()
      } else {
        // Priority sorting (high, medium, low)
        const priorityOrder = { high: 0, medium: 1, low: 2, undefined: 3 }
        return (
          (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) -
          (priorityOrder[b.priority as keyof typeof priorityOrder] || 3)
        )
      }
    })

    setFilteredConversations(filtered)
  }, [conversations, statusFilter, priorityFilter, searchQuery, sortOrder])

  // Handle assigning a conversation to the current admin
  const handleAssignToMe = async (conversationId: string) => {
    try {
      const conversation = conversations.find((conv) => conv.id === conversationId)
      if (!conversation) return

      // Update conversation status
      await mockApi.conversations.update(conversationId, {
        assignedTo: "current-admin", // In a real app, use the current admin's ID
      })

      // Show success toast
      toast({
        title: "Konuşma Canlı Sohbete Aktarıldı",
        description: "Konuşma başarıyla size atandı ve canlı sohbete aktarıldı.",
        variant: "success",
      })

      // Remove the conversation from the list
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))
    } catch (err) {
      console.error("Error assigning conversation:", err)
      toast({
        title: "Hata",
        description: "Konuşma atanırken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  // Handle showing the confirmation dialog for resolving a conversation
  const handleShowResolveDialog = (conversationId: string) => {
    setConversationToResolve(conversationId)
    setIsConfirmDialogOpen(true)
  }

  // Handle confirming the resolution of a conversation
  const handleConfirmResolve = async () => {
    if (!conversationToResolve) return

    try {
      // Resolve the conversation
      await mockApi.conversations.resolve(conversationToResolve)

      // Remove the conversation from the list
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationToResolve))

      toast({
        title: "Konuşma Çözüldü",
        description: "Konuşma başarıyla çözüldü ve silindi.",
        variant: "success",
      })
    } catch (err) {
      console.error("Error resolving conversation:", err)
      toast({
        title: "Hata",
        description: "Konuşma çözülürken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      // Close the dialog and reset the conversation ID
      setIsConfirmDialogOpen(false)
      setConversationToResolve(null)
    }
  }

  // Handle showing the bot selection dialog
  const handleShowBotSelectionDialog = (conversationId: string) => {
    const conversation = conversations.find((conv) => conv.id === conversationId)
    if (!conversation) return

    setConversationToTransfer(conversationId)
    setSelectedBot(conversation.botId) // Default to current bot
    setIsBotSelectionDialogOpen(true)
  }

  // Handle transferring conversation to selected bot
  const handleTransferToBot = async () => {
    if (!conversationToTransfer || !selectedBot) return

    try {
      const conversation = conversations.find((conv) => conv.id === conversationToTransfer)
      if (!conversation) return

      const userName = conversation.user?.name || `User ${conversation.userId}`
      const botName = availableBots.find((bot) => bot.id === selectedBot)?.name || `Bot ${selectedBot}`

      // Check if transferring to same bot or different bot
      const isSameBot = selectedBot === conversation.botId

      await conversationTransitionService.transitionToBot(
        conversationToTransfer,
        "admin", // In a real app, use the current admin's ID
        "admin_decision",
        true, // Preserve context
      )

      toast({
        title: "Konuşma Bot'a Aktarıldı",
        description: isSameBot
          ? `${userName} ile konuşma aynı bota (${botName}) geri aktarıldı.`
          : `${userName} ile konuşma ${botName} botuna aktarıldı.`,
        variant: "success",
      })

      // Remove the conversation from the escalated list
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationToTransfer))
    } catch (err) {
      console.error("Error transitioning conversation to bot:", err)
      toast({
        title: "Hata",
        description: "Konuşma bot'a aktarılırken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsBotSelectionDialogOpen(false)
      setConversationToTransfer(null)
    }
  }

  // Get status badge
  const getStatusBadge = (status: ConversationStatus) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Aktif</Badge>
      case "escalated":
        return <Badge variant="destructive">Yükseltilmiş</Badge>
      case "pending":
        return <Badge variant="warning">Beklemede</Badge>
      case "resolved":
        return <Badge variant="outline">Çözüldü</Badge>
      default:
        return <Badge variant="secondary">Bilinmiyor</Badge>
    }
  }

  // Get priority badge
  const getPriorityBadge = (priority?: ConversationPriority) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Yüksek</Badge>
      case "medium":
        return <Badge variant="warning">Orta</Badge>
      case "low":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Düşük
          </Badge>
        )
      default:
        return <Badge variant="outline">Belirsiz</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Yükseltilmiş Konuşmalar</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p>Yükseltilmiş konuşmalar yükleniyor...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Yükseltilmiş Konuşmalar</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Hata</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()}>Yeniden Dene</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yükseltilmiş Konuşmalar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Konuşma ara..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="escalated">Yükseltilmiş</SelectItem>
                <SelectItem value="pending">Beklemede</SelectItem>
                <SelectItem value="resolved">Çözüldü</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as any)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Öncelik" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="high">Yüksek</SelectItem>
                <SelectItem value="medium">Orta</SelectItem>
                <SelectItem value="low">Düşük</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sıralama" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Öncelik</SelectItem>
                <SelectItem value="newest">En Yeni</SelectItem>
                <SelectItem value="oldest">En Eski</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border rounded-lg ${
                  conversation.status === "escalated"
                    ? "border-red-300 bg-red-50/10"
                    : conversation.status === "pending"
                      ? "border-yellow-300 bg-yellow-50/10"
                      : "border-gray-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          conversation.user?.avatar ||
                          `/abstract-geometric-shapes.png?height=40&width=40&query=user-${conversation.userId || "/placeholder.svg"}`
                        }
                        alt={conversation.user?.name || `User ${conversation.userId}`}
                      />
                      <AvatarFallback>{(conversation.user?.name || "U").substring(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{conversation.user?.name || `User ${conversation.userId}`}</h3>
                        {conversation.user?.isVip && (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            VIP
                          </Badge>
                        )}
                        <ConversationLocationIndicator conversationId={conversation.id} showLabel={false} size="sm" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Bot: {conversation.bot?.name || `Bot ${conversation.botId}`}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(conversation.status)}
                        {getPriorityBadge(conversation.priority)}
                        <span className="text-xs text-muted-foreground">{conversation.messageCount} mesaj</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => handleAssignToMe(conversation.id)}
                    >
                      <User className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Canlı Sohbete Al</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => handleShowResolveDialog(conversation.id)}
                    >
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Çözüldü</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => handleShowBotSelectionDialog(conversation.id)}
                    >
                      <Bot className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Bota Yönlendir</span>
                    </Button>
                    <Button size="sm" className="h-8 bg-pink-600 hover:bg-pink-700 text-white">
                      <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Görüntüle</span>
                    </Button>
                  </div>
                </div>

                {conversation.escalatedReason && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium">Yükseltme Nedeni:</span>{" "}
                    {conversation.escalatedReason === "no_template"
                      ? "Uygun şablon bulunamadı"
                      : conversation.escalatedReason === "keyword"
                        ? "Anahtar kelime tespit edildi"
                        : conversation.escalatedReason === "message_count"
                          ? "Mesaj sayısı eşiği aşıldı"
                          : conversation.escalatedReason === "admin"
                            ? "Admin tarafından yükseltildi"
                            : conversation.escalatedReason}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Filtrelere uygun konuşma bulunamadı.</p>
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Konuşmayı Çöz</DialogTitle>
              <DialogDescription>Çözülen konuşmalar silinir ve bu işlem geri alınamaz.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
              <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                İptal
              </Button>
              <Button variant="destructive" onClick={handleConfirmResolve}>
                Onayla
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bot Selection Dialog */}
        <Dialog open={isBotSelectionDialogOpen} onOpenChange={setIsBotSelectionDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Bota Yönlendir</DialogTitle>
              <DialogDescription>
                Konuşmayı yönlendirmek istediğiniz botu seçin. Mevcut bota geri yönlendirmek için aynı botu
                seçebilirsiniz.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Label htmlFor="bot-selection" className="mb-2 block">
                Bot Seçin
              </Label>
              <Select value={selectedBot} onValueChange={setSelectedBot}>
                <SelectTrigger id="bot-selection">
                  <SelectValue placeholder="Bot seçin" />
                </SelectTrigger>
                <SelectContent>
                  {availableBots.map((bot) => (
                    <SelectItem key={bot.id} value={bot.id}>
                      {bot.name}
                      {conversationToTransfer &&
                      conversations.find((c) => c.id === conversationToTransfer)?.botId === bot.id
                        ? " (Mevcut Bot)"
                        : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
              <Button variant="outline" onClick={() => setIsBotSelectionDialogOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleTransferToBot} disabled={!selectedBot}>
                Yönlendir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
