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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface ConversationEscalationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversation: {
    id: string
    botName: string
    botAvatar: string
    userName: string
    userAvatar: string
    messageCount: number
    userReplies: number
  }
}

export function ConversationEscalationModal({ open, onOpenChange, conversation }: ConversationEscalationModalProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isEscalating, setIsEscalating] = useState(false)

  const handleEscalate = async () => {
    setIsEscalating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsEscalating(false)
    onOpenChange(false)

    toast({
      title: "Konuşma Yükseltildi",
      description: `${conversation.userName} ile konuşma canlı sohbete yükseltildi.`,
      variant: "success",
    })

    router.push("/live-chat")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Konuşmayı Yükselt</DialogTitle>
          <DialogDescription>Bu konuşmayı canlı sohbete yükseltmek istediğinizden emin misiniz?</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex flex-col items-center">
              <Avatar className="h-12 w-12">
                <AvatarImage src={conversation.botAvatar || "/placeholder.svg"} alt={conversation.botName} />
                <AvatarFallback>{conversation.botName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-xs mt-1">{conversation.botName}</span>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 text-xs px-2 py-0.5 rounded-full">
                  {conversation.messageCount} mesaj
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <Avatar className="h-12 w-12">
                <AvatarImage src={conversation.userAvatar || "/placeholder.svg"} alt={conversation.userName} />
                <AvatarFallback>{conversation.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-xs mt-1">{conversation.userName}</span>
            </div>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-md border border-pink-200 dark:border-pink-800">
            <p className="text-sm text-pink-800 dark:text-pink-200">Bu konuşma canlı sohbete yükseltildiğinde:</p>
            <ul className="text-xs text-pink-700 dark:text-pink-300 mt-2 space-y-1 list-disc pl-4">
              <li>Tüm konuşma geçmişi canlı sohbete aktarılacak</li>
              <li>Bot artık otomatik yanıt vermeyecek</li>
              <li>Siz kullanıcıyla doğrudan iletişim kurabileceksiniz</li>
              <li>Kullanıcı, konuşmanın artık bir yönetici tarafından devralındığını bilmeyecek</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button
            className="bg-gradient-to-r from-pink-600 to-red-500"
            onClick={handleEscalate}
            disabled={isEscalating}
          >
            {isEscalating ? "Yükseltiliyor..." : "Canlı Sohbete Yükselt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
