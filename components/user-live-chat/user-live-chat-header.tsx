"use client"

import { Button } from "@/components/ui/button"
import { X, Crown } from "lucide-react"

interface UserLiveChatHeaderProps {
  botName: string
  isVip?: boolean
  onClose: () => void
}

export function UserLiveChatHeader({ botName, isVip = false, onClose }: UserLiveChatHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4 p-2">
      <div className="flex items-center">
        <h2 className="text-xl font-bold">
          {isVip && <Crown className="inline-block mr-2 h-5 w-5 text-yellow-500" />}
          Canlı Destek: {botName}
        </h2>
        {isVip && (
          <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs rounded-full">
            VIP
          </span>
        )}
      </div>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-5 w-5" />
        <span className="sr-only">Kapat</span>
      </Button>
    </div>
  )
}
