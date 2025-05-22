"use client"

import { useState, useEffect } from "react"
import { Check, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { liveChatService } from "@/services/live-chat-service"
import type { Bot } from "@/types/bot"

interface BotSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBotSelect: (botId: string) => void
  currentBotId?: string
}

export function BotSelectionDialog({ open, onOpenChange, onBotSelect, currentBotId }: BotSelectionDialogProps) {
  const [bots, setBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch available bots when dialog opens
  useEffect(() => {
    if (open) {
      setLoading(true)
      setError(null)

      liveChatService
        .getActiveBots()
        .then((activeBots) => {
          // Filter out the current bot if provided
          const filteredBots = currentBotId ? activeBots.filter((bot) => bot.id !== currentBotId) : activeBots

          setBots(filteredBots)
          setSelectedBotId(null)
        })
        .catch((err) => {
          console.error("Failed to fetch bots:", err)
          setError("Failed to load available bots. Please try again.")
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [open, currentBotId])

  const handleConfirm = () => {
    if (selectedBotId) {
      onBotSelect(selectedBotId)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#1a1b2e] border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Sohbeti Yönlendir</DialogTitle>
          <DialogDescription className="text-gray-400">
            Sohbeti yönlendirmek istediğiniz botu seçin. Mevcut sohbet geçmişi yeni bota aktarılacaktır.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-400">Botlar yükleniyor...</span>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-red-400">{error}</p>
            <Button
              variant="outline"
              className="mt-4 bg-[#2b2c46] hover:bg-[#3a3b5a]"
              onClick={() => onOpenChange(false)}
            >
              Kapat
            </Button>
          </div>
        ) : bots.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-400">Yönlendirilebilecek aktif bot bulunamadı.</p>
            <Button
              variant="outline"
              className="mt-4 bg-[#2b2c46] hover:bg-[#3a3b5a]"
              onClick={() => onOpenChange(false)}
            >
              Kapat
            </Button>
          </div>
        ) : (
          <ScrollArea className="max-h-[300px] pr-4">
            <div className="space-y-2">
              {bots.map((bot) => (
                <div
                  key={bot.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedBotId === bot.id
                      ? "bg-blue-900/30 border border-blue-500"
                      : "hover:bg-[#2b2c46] border border-transparent"
                  }`}
                  onClick={() => setSelectedBotId(bot.id)}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={bot.avatar || "/placeholder.svg"} alt={bot.name} />
                    <AvatarFallback>{bot.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{bot.name}</p>
                    <p className="text-sm text-gray-400">{bot.status === "active" ? "Aktif" : "Meşgul"}</p>
                  </div>
                  {selectedBotId === bot.id && <Check className="h-5 w-5 text-blue-500" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" className="bg-[#2b2c46] hover:bg-[#3a3b5a]" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button
            variant="default"
            className="bg-[#fa2674] hover:bg-[#e01e65]"
            disabled={!selectedBotId || loading}
            onClick={handleConfirm}
          >
            Yönlendir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
