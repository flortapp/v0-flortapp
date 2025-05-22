"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, MessageSquare, ArrowUpRight, User, Filter, Loader2, AlertCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { ConversationLocationIndicator } from "@/components/live-chat/conversation-location-indicator"
import { conversationTransitionService } from "@/services/conversation-transition-service"
import { conversationService } from "@/services/conversation-service"
import { mockApi } from "@/services/api-mock"
import { format, parseISO } from "date-fns"
import { tr } from "date-fns/locale"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface BotConversationsListProps {
  botId?: string
  filter?: string
}

interface EnhancedConversation {
  id: string
  botId: string
  botName: string
  botAvatar: string
  userId: string
  userName: string
  userAvatar: string
  status: string
  messageCount: number
  userReplies: number
  lastMessage: string
  startedAt: Date
  lastMessageAt: Date
  formattedStartedAt: string
  formattedLastMessageAt: string
  priority: string
  isVipUser: boolean
  userJetons: number
  escalatedAt?: string
  escalatedBy?: string
  assignedTo?: string
  resolvedAt?: string
  resolvedBy?: string
}

export function BotConversationsList({ botId, filter = "all" }: BotConversationsListProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState(filter)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [minJeton, setMinJeton] = useState(0)
  const [maxJeton, setMaxJeton] = useState(100)
  const [isFilteringByJeton, setIsFilteringByJeton] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [conversations, setConversations] = useState<EnhancedConversation[]>([])

  // Function to check if a conversation should be escalated
  const shouldEscalateConversation = (conversation: EnhancedConversation) => {
    // Check if the conversation has been inactive for 24 hours
    const lastMessageTime = conversation.lastMessageAt.getTime()
    const currentTime = new Date().getTime()
    const hoursDifference = (currentTime - lastMessageTime) / (1000 * 60 * 60)

    // If the conversation has been inactive for 24 hours or more, it should be escalated
    if (hoursDifference >= 24) {
      return true
    }

    // Check if the user is VIP
    if (conversation.isVipUser) {
      return true
    }

    return false
  }

  // Fetch conversations from the mock API
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch conversations
        const conversationsResponse = await mockApi.conversations.getAll()
        const apiConversations = conversationsResponse.data

        console.log("Raw conversations data:", apiConversations)

        if (!apiConversations || apiConversations.length === 0) {
          setError("Konuşma verisi bulunamadı.")
          setLoading(false)
          return
        }

        // Fetch users and bots to get names and avatars
        const usersResponse = await mockApi.users.getAll()
        const users = usersResponse.data
        const botsResponse = await mockApi.bots.getAll()
        const bots = botsResponse.data

        // Process each conversation
        const enhancedConversationsPromises = apiConversations.map(async (conv) => {
          try {
            // Fetch messages for this conversation
            const messagesResponse = await mockApi.messages.getByConversationId(conv.id)
            const messages = messagesResponse.data

            // Find the user and bot for this conversation
            const user = users.find((u) => u.id === conv.userId) || {
              name: "Unknown User",
              avatar: "/placeholder.svg",
            }
            const bot = bots.find((b) => b.id === conv.botId) || { name: "Unknown Bot", avatar: "/placeholder.svg" }

            // Get the last message content
            const lastMessage = messages.length > 0 ? messages[messages.length - 1].content : "No messages yet"

            // Parse dates safely
            let startedAtDate: Date
            let lastMessageAtDate: Date
            let formattedStartedAt: string
            let formattedLastMessageAt: string

            try {
              startedAtDate = parseISO(conv.startedAt)
              lastMessageAtDate = parseISO(conv.lastMessageAt)
              formattedStartedAt = format(startedAtDate, "d MMMM yyyy, HH:mm", { locale: tr })
              formattedLastMessageAt = format(lastMessageAtDate, "d MMMM yyyy, HH:mm", { locale: tr })
            } catch (dateError) {
              console.error("Date parsing error:", dateError)
              startedAtDate = new Date()
              lastMessageAtDate = new Date()
              formattedStartedAt = "Geçersiz tarih"
              formattedLastMessageAt = "Geçersiz tarih"
            }

            // Create the enhanced conversation object
            return {
              id: conv.id,
              botId: conv.botId,
              botName: bot.name,
              botAvatar: bot.avatar,
              userId: conv.userId,
              userName: user.name,
              userAvatar: user.avatar,
              status: conv.status,
              messageCount: conv.messageCount || 0,
              userReplies: conv.userReplies || Math.floor(conv.messageCount / 2) || 0,
              lastMessage,
              startedAt: startedAtDate,
              lastMessageAt: lastMessageAtDate,
              formattedStartedAt,
              formattedLastMessageAt,
              priority: conv.priority || "medium",
              isVipUser: conv.isVipUser || false,
              userJetons: conv.userJetons || 0,
              escalatedAt: conv.escalatedAt,
              escalatedBy: conv.escalatedBy,
              assignedTo: conv.assignedTo,
              resolvedAt: conv.resolvedAt,
              resolvedBy: conv.resolvedBy,
            }
          } catch (err) {
            console.error(`Error processing conversation ${conv.id}:`, err)
            // Return a default conversation object if there's an error
            return {
              id: conv.id,
              botId: conv.botId,
              botName: "Unknown Bot",
              botAvatar: "/placeholder.svg",
              userId: conv.userId,
              userName: "Unknown User",
              userAvatar: "/placeholder.svg",
              status: conv.status || "active",
              messageCount: conv.messageCount || 0,
              userReplies: conv.userReplies || 0,
              lastMessage: "Error loading message",
              startedAt: new Date(),
              lastMessageAt: new Date(),
              formattedStartedAt: "Geçersiz tarih",
              formattedLastMessageAt: "Geçersiz tarih",
              priority: conv.priority || "medium",
              isVipUser: conv.isVipUser || false,
              userJetons: conv.userJetons || 0,
            }
          }
        })

        // Wait for all conversations to be processed
        const enhancedConversations = await Promise.all(enhancedConversationsPromises)
        console.log("Enhanced conversations:", enhancedConversations)

        // Register conversations with the conversation service
        enhancedConversations.forEach((conv) => {
          // Convert the enhanced conversation to the format expected by the conversation service
          const conversationMetadata = {
            id: conv.id,
            userId: conv.userId,
            botId: conv.botId,
            status: conv.status,
            createdAt: conv.startedAt,
            updatedAt: new Date(),
            lastMessageAt: conv.lastMessageAt,
            messageCount: conv.messageCount,
            userMessageCount: conv.userReplies,
            botMessageCount: conv.messageCount - conv.userReplies,
            hasUnreadMessages: false,
            isPinned: false,
            isArchived: false,
            isVipUser: conv.isVipUser,
            userCredits: conv.userJetons,
            priority: conv.priority,
          }

          // Register the conversation with the service
          conversationService.updateConversation(conversationMetadata)

          // Set the initial location in the transition service
          conversationTransitionService.setConversationLocation(conv.id, "bot")
        })

        setConversations(enhancedConversations)
      } catch (err) {
        console.error("Error fetching conversations:", err)
        setError("Konuşmalar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.")
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  // Filter conversations based on botId if provided
  let filteredConversations = botId ? conversations.filter((conv) => conv.botId === botId) : conversations

  // Filter by status if filter is not "all"
  if (statusFilter !== "all") {
    filteredConversations = filteredConversations.filter((conv) => conv.status === statusFilter)
  }

  // Filter by jeton range if jeton filtering is enabled
  if (isFilteringByJeton) {
    filteredConversations = filteredConversations.filter(
      (conv) => conv.userJetons >= minJeton && conv.userJetons <= maxJeton,
    )
  }

  // Filter by search query
  if (searchQuery) {
    filteredConversations = filteredConversations.filter(
      (conv) =>
        conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.botName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  // Sort conversations
  filteredConversations = [...filteredConversations].sort((a, b) => {
    if (sortOrder === "newest") {
      return b.lastMessageAt.getTime() - a.lastMessageAt.getTime()
    } else {
      return a.lastMessageAt.getTime() - b.lastMessageAt.getTime()
    }
  })

  const handleViewConversation = (id: string) => {
    router.push(`/conversation/${id}`)
  }

  const handleEscalateConversation = (id: string, userName: string) => {
    // Update conversation status to escalated via the API
    mockApi.conversations
      .update(id, { status: "escalated", escalatedAt: new Date().toISOString(), escalatedBy: "admin" })
      .then(() => {
        toast({
          title: "Konuşma Yükseltildi",
          description: `${userName} ile konuşma Yükseltilmiş Konuşmalar'a yönlendirildi.`,
          variant: "success",
        })

        // Update the local state
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === id
              ? {
                  ...conv,
                  status: "escalated",
                  escalatedAt: new Date().toISOString(),
                  escalatedBy: "admin",
                }
              : conv,
          ),
        )
      })
      .catch((error) => {
        toast({
          title: "Hata",
          description: `Konuşma yükseltilirken bir hata oluştu: ${error.message}`,
          variant: "destructive",
        })
      })
  }

  const handleAssignToMe = (id: string, userName: string) => {
    // Update conversation to assign it to the current admin
    mockApi.conversations
      .update(id, { assignedTo: "admin", assignedAt: new Date().toISOString() })
      .then(() => {
        toast({
          title: "Konuşma Atandı",
          description: `${userName} ile konuşma size atandı.`,
          variant: "success",
        })

        // Update the local state
        setConversations((prevConversations) =>
          prevConversations.map((conv) => (conv.id === id ? { ...conv, assignedTo: "admin" } : conv)),
        )
      })
      .catch((error) => {
        toast({
          title: "Hata",
          description: `Konuşma atanırken bir hata oluştu: ${error.message}`,
          variant: "destructive",
        })
      })
  }

  const getStatusBadge = (status: string) => {
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

  const handleApplyJetonFilter = () => {
    setIsFilteringByJeton(true)
    toast({
      title: "Jeton Filtresi Uygulandı",
      description: `${minJeton} - ${maxJeton} jeton aralığındaki konuşmalar gösteriliyor.`,
      variant: "success",
    })
  }

  const handleResetJetonFilter = () => {
    setIsFilteringByJeton(false)
    setMinJeton(0)
    setMaxJeton(100)
    toast({
      title: "Jeton Filtresi Sıfırlandı",
      description: "Tüm jeton değerlerine sahip konuşmalar gösteriliyor.",
      variant: "default",
    })
  }

  // Add a function to handle transitioning to live chat
  const handleTransitionToLiveChat = (conversationId: string, userName: string) => {
    // First check if the conversation exists in the service
    const conversation = conversationService.getConversation(conversationId)

    if (!conversation) {
      // If conversation doesn't exist, show an error toast
      toast({
        title: "Hata",
        description: `Konuşma bulunamadı (ID: ${conversationId}). Lütfen sayfayı yenileyip tekrar deneyin.`,
        variant: "destructive",
      })
      return
    }

    conversationTransitionService
      .transitionToLiveChat(
        conversationId,
        "admin", // In a real app, use the current admin's ID
        "admin_decision",
        true, // Preserve context
      )
      .then((success) => {
        if (success) {
          toast({
            title: "Konuşma Canlı Sohbete Aktarıldı",
            description: `${userName} ile konuşma canlı sohbete aktarıldı.`,
            variant: "success",
          })

          // Update the local state
          setConversations((prevConversations) =>
            prevConversations.map((conv) => (conv.id === conversationId ? { ...conv, status: "escalated" } : conv)),
          )
        }
      })
      .catch((error) => {
        toast({
          title: "Aktarım Hatası",
          description: `Konuşma aktarılırken bir hata oluştu: ${error.message}`,
          variant: "destructive",
        })
      })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Konuşmalar yükleniyor...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Yeniden Dene</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {conversations.length === 0 && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Dikkat</AlertTitle>
          <AlertDescription>
            Henüz hiç konuşma verisi bulunmuyor. Canlıya alındığında, yeni konuşmalar burada görüntülenecektir.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">{botId ? "Bot Konuşmaları" : "Tüm Konuşmalar"}</h2>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="escalated">Yükseltilmiş</SelectItem>
                <SelectItem value="pending">Beklemede</SelectItem>
                <SelectItem value="resolved">Çözüldü</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-[130px] justify-between ${isFilteringByJeton ? "bg-blue-50 border-blue-300" : ""}`}
                  data-state="open"
                >
                  <span>{isFilteringByJeton ? `${minJeton}-${maxJeton} Jeton` : "Jeton Filtresi"}</span>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4" />
                    {isFilteringByJeton && <div className="h-2 w-2 rounded-full bg-blue-500 ml-1"></div>}
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Jeton Aralığı</h4>
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="minJeton">Min Jeton</Label>
                      <Input
                        id="minJeton"
                        type="number"
                        min="0"
                        max={maxJeton}
                        value={minJeton}
                        onChange={(e) => setMinJeton(Number(e.target.value))}
                        className="w-24"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="maxJeton">Max Jeton</Label>
                      <Input
                        id="maxJeton"
                        type="number"
                        min={minJeton}
                        value={maxJeton}
                        onChange={(e) => setMaxJeton(Number(e.target.value))}
                        className="w-24"
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <Label>
                      Jeton Aralığı: {minJeton} - {maxJeton}
                    </Label>
                    <Slider
                      defaultValue={[minJeton, maxJeton]}
                      min={0}
                      max={100}
                      step={1}
                      value={[minJeton, maxJeton]}
                      onValueChange={(values) => {
                        setMinJeton(values[0])
                        setMaxJeton(values[1])
                      }}
                      className="mt-2"
                      minStepsBetweenThumbs={1}
                    />
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={handleResetJetonFilter}>
                      Sıfırla
                    </Button>
                    <Button size="sm" onClick={handleApplyJetonFilter}>
                      Uygula
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sıralama" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">En Yeni</SelectItem>
                <SelectItem value="oldest">En Eski</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredConversations.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">Filtrelere uygun konuşma bulunamadı.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Bot</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Mesaj Sayısı</TableHead>
                <TableHead>Jeton</TableHead>
                <TableHead>Son Mesaj</TableHead>
                <TableHead>Son Aktivite</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConversations.map((conversation) => (
                <TableRow
                  key={conversation.id}
                  className={
                    conversation.status === "escalated"
                      ? "bg-red-50/10"
                      : conversation.status === "pending"
                        ? "bg-yellow-50/10"
                        : conversation.isVipUser
                          ? "bg-purple-50/10"
                          : ""
                  }
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={conversation.userAvatar || "/placeholder.svg"} alt={conversation.userName} />
                        <AvatarFallback>{conversation.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">{conversation.userName}</span>
                        {conversation.isVipUser && (
                          <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-800 border-purple-200">
                            VIP
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={conversation.botAvatar || "/placeholder.svg"} alt={conversation.botName} />
                        <AvatarFallback>{conversation.botName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{conversation.botName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(conversation.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span>{conversation.messageCount}</span>
                      {conversation.userReplies >= 5 && conversation.status === "active" && (
                        <Badge variant="outline" className="ml-2 bg-pink-100 text-pink-800 border-pink-200">
                          Yükseltilebilir
                        </Badge>
                      )}
                      <div className="ml-2">
                        <ConversationLocationIndicator conversationId={conversation.id} showLabel={false} size="sm" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {conversation.userJetons > 0 ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        {conversation.userJetons} Jeton
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                        Jeton Yok
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="truncate block max-w-[200px]">{conversation.lastMessage}</span>
                  </TableCell>
                  <TableCell>{conversation.formattedLastMessageAt.split(", ")[1]}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menüyü Aç</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewConversation(conversation.id)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Görüntüle</span>
                        </DropdownMenuItem>

                        {conversation.status === "active" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleTransitionToLiveChat(conversation.id, conversation.userName)}
                            >
                              <ArrowUpRight className="mr-2 h-4 w-4" />
                              <span>Canlı Sohbete Aktar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEscalateConversation(conversation.id, conversation.userName)}
                            >
                              <ArrowUpRight className="mr-2 h-4 w-4" />
                              <span>Yükselt</span>
                            </DropdownMenuItem>
                          </>
                        )}

                        {(conversation.status === "escalated" || conversation.status === "pending") && (
                          <DropdownMenuItem onClick={() => handleAssignToMe(conversation.id, conversation.userName)}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Bana Ata</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
