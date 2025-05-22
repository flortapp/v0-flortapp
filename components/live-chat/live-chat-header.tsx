"use client"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Coins, Pin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  birthDate?: string
  location?: string
  coins?: string
  lastActive?: string
  online: boolean
  profileData?: {
    birthDate: string
    location: string
    coins: string
  }
}

interface Bot {
  id: string
  name: string
  email: string
  online: boolean
}

interface BotChatHeaderProps {
  user: User
  bot: Bot
  isPinned?: boolean
  onTogglePin?: () => void
  onSendSystemMessage: () => void
}

// Not: Bu bileşen artık kullanılmıyor, ancak geriye dönük uyumluluk için korunuyor.
// Tüm işlevsellik BotChatInterface bileşenine taşındı.
export function BotChatHeader({ user, bot, isPinned, onTogglePin, onSendSystemMessage }: BotChatHeaderProps) {
  const { toast } = useToast()

  const handleSendSystemMessage = () => {
    onSendSystemMessage()

    toast({
      title: "Sistem Mesajı Gönderildi",
      description: "Sistem mesajı başarıyla gönderildi.",
      variant: "success",
    })
  }

  // Kullanıcı profil bilgilerini al (eski veya yeni format)
  const birthDate = user.profileData?.birthDate || user.birthDate || "Belirtilmemiş"
  const location = user.profileData?.location || user.location || "Belirtilmemiş"
  const coins = user.profileData?.coins || user.coins || "0 Coin"

  return (
    <div
      className={`border-b border-gray-800 p-4 bg-[#171829] flex flex-wrap justify-between items-center gap-4 ${
        isPinned ? "border-l-4 border-[#fa2674]" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#404157] flex items-center justify-center">
          <span className="text-xl font-bold text-white">{user.name.substring(0, 1)}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">{user.name}</h2>
            {isPinned && <Pin className="h-4 w-4 text-[#fa2674] rotate-45" />}
          </div>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Her zaman profil bilgilerini göster */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{birthDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{coins}</span>
        </div>
        <Button className="bg-[#404157] hover:bg-[#2b2c46] text-white" onClick={handleSendSystemMessage}>
          Sistem Mesajı Gönder
        </Button>
        {onTogglePin && (
          <Button
            variant={isPinned ? "default" : "outline"}
            className={isPinned ? "bg-[#fa2674] hover:bg-[#e01e65] text-white" : "text-gray-400 hover:text-[#fa2674]"}
            onClick={onTogglePin}
          >
            <Pin className={`mr-2 h-4 w-4 ${isPinned ? "rotate-45" : ""}`} />
            {isPinned ? "Sabitlemeyi Kaldır" : "Sohbeti Sabitle"}
          </Button>
        )}
      </div>
    </div>
  )
}
