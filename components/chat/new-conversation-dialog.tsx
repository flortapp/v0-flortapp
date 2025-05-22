"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NewConversationDialogProps {
  open: boolean
  onClose: () => void
}

export function NewConversationDialog({ open, onClose }: NewConversationDialogProps) {
  const [selectedBot, setSelectedBot] = useState("")
  const [selectedUser, setSelectedUser] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Örnek bot ve kullanıcı verileri
  const bots = [
    { id: "1", name: "Sophia", avatar: "/mystical-forest-spirit.png" },
    { id: "2", name: "Emma", avatar: "" },
    { id: "3", name: "Olivia", avatar: "" },
  ]

  const users = [
    { id: "1", name: "Ahmet Yılmaz", avatar: "/male-avatar.png" },
    { id: "2", name: "Mehmet Demir", avatar: "" },
    { id: "3", name: "Ayşe Kaya", avatar: "" },
  ]

  // Konuşma başlatma işlevi
  const handleStartConversation = () => {
    if (!selectedBot || !selectedUser) return

    setIsLoading(true)

    // Konuşma başlatma işlemleri burada yapılacak
    console.log("Konuşma başlatılıyor:", { botId: selectedBot, userId: selectedUser })

    // İşlem tamamlandıktan sonra
    setTimeout(() => {
      setIsLoading(false)
      onClose()
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Konuşma Başlat</DialogTitle>
          <DialogDescription>Yeni bir konuşma başlatmak için bir bot ve kullanıcı seçin.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="bot">Bot</Label>
            <Select value={selectedBot} onValueChange={setSelectedBot}>
              <SelectTrigger id="bot">
                <SelectValue placeholder="Bir bot seçin" />
              </SelectTrigger>
              <SelectContent>
                {bots.map((bot) => (
                  <SelectItem key={bot.id} value={bot.id}>
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage
                          src={bot.avatar || `/abstract-geometric-shapes.png?height=24&width=24&query=${bot.name}`}
                          alt={bot.name}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
                          {bot.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {bot.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user">Kullanıcı</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger id="user">
                <SelectValue placeholder="Bir kullanıcı seçin" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage
                          src={user.avatar || `/abstract-geometric-shapes.png?height=24&width=24&query=${user.name}`}
                          alt={user.name}
                        />
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {user.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button
            className="bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600"
            onClick={handleStartConversation}
            disabled={!selectedBot || !selectedUser || isLoading}
          >
            {isLoading ? "Başlatılıyor..." : "Konuşma Başlat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
