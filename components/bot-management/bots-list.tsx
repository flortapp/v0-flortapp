"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash, Eye, Power, PowerOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { mockApi } from "@/services/api-mock"
import { Loader2 } from "lucide-react"
import { BotDetailDialog } from "@/components/bot-management/bot-detail-dialog"
import { useToast } from "@/hooks/use-toast"

interface BotsListProps {
  filter: "all" | "active" | "inactive"
  searchQuery?: string
}

export function BotsList({ filter, searchQuery = "" }: BotsListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [bots, setBots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBot, setSelectedBot] = useState<any>(null)
  const [showBotDetail, setShowBotDetail] = useState(false)

  useEffect(() => {
    const fetchBots = async () => {
      try {
        setLoading(true)
        // Fix: Use getAll instead of getBots
        const response = await mockApi.bots.getAll()
        let filteredBots = response.data

        // Apply status filter
        if (filter === "active") {
          filteredBots = filteredBots.filter((bot: any) => bot.status === "active")
        } else if (filter === "inactive") {
          filteredBots = filteredBots.filter((bot: any) => bot.status === "inactive")
        }

        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filteredBots = filteredBots.filter(
            (bot: any) =>
              bot.name.toLowerCase().includes(query) ||
              (bot.location && bot.location.toLowerCase().includes(query)) ||
              (bot.bio && bot.bio.toLowerCase().includes(query)),
          )
        }

        setBots(filteredBots)
      } catch (error) {
        console.error("Error fetching bots:", error)
        toast({
          title: "Hata",
          description: "Botlar yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBots()
  }, [filter, searchQuery, toast])

  const handleEditBot = (botId: string) => {
    router.push(`/edit-bot/${botId}`)
  }

  const handleViewBot = (bot: any) => {
    setSelectedBot(bot)
    setShowBotDetail(true)
  }

  const handleToggleStatus = async (botId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      // Fix: Use update instead of updateBotStatus
      await mockApi.bots.update(botId, { status: newStatus })

      // Update local state
      setBots(bots.map((bot) => (bot.id === botId ? { ...bot, status: newStatus } : bot)))

      toast({
        title: `Bot ${newStatus === "active" ? "Aktifleştirildi" : "Devre Dışı Bırakıldı"}`,
        description: `Bot başarıyla ${newStatus === "active" ? "aktifleştirildi" : "devre dışı bırakıldı"}.`,
        variant: newStatus === "active" ? "success" : "default",
      })
    } catch (error) {
      console.error("Error updating bot status:", error)
      toast({
        title: "Hata",
        description: "Bot durumu güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBot = async (botId: string, botName: string) => {
    try {
      await mockApi.bots.delete(botId)

      // Update local state
      setBots(bots.filter((bot) => bot.id !== botId))

      toast({
        title: "Bot Silindi",
        description: `${botName} botu başarıyla silindi.`,
        variant: "destructive",
      })
    } catch (error) {
      console.error("Error deleting bot:", error)
      toast({
        title: "Hata",
        description: "Bot silinirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (bots.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          {searchQuery
            ? "Arama kriterlerine uygun bot bulunamadı."
            : filter !== "all"
              ? `${filter === "active" ? "Aktif" : "Pasif"} durumda bot bulunamadı.`
              : "Henüz hiç bot oluşturulmamış."}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bot</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Konum</TableHead>
              <TableHead>Yaş</TableHead>
              <TableHead>Konuşmalar</TableHead>
              <TableHead>Başarı Oranı</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bots.map((bot) => (
              <TableRow key={bot.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={bot.avatar || "/robot-avatar.png"} alt={bot.name} />
                      <AvatarFallback>{bot.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{bot.name}</p>
                      <p className="text-sm text-muted-foreground">{bot.gender}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={bot.status === "active" ? "success" : "secondary"} className="capitalize">
                    {bot.status === "active" ? "Aktif" : "Pasif"}
                  </Badge>
                </TableCell>
                <TableCell>{bot.location}</TableCell>
                <TableCell>{bot.age}</TableCell>
                <TableCell>{bot.conversationCount || 0}</TableCell>
                <TableCell>{bot.successRate ? `${bot.successRate}%` : "N/A"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menüyü aç</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewBot(bot)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Bot Detay</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditBot(bot.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Düzenle</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(bot.id, bot.status)}>
                        {bot.status === "active" ? (
                          <>
                            <PowerOff className="mr-2 h-4 w-4" />
                            <span>Pasif Yap</span>
                          </>
                        ) : (
                          <>
                            <Power className="mr-2 h-4 w-4" />
                            <span>Aktif Yap</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteBot(bot.id, bot.name)}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Sil</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BotDetailDialog botId={selectedBot?.id} open={showBotDetail} onOpenChange={setShowBotDetail} />
    </>
  )
}
