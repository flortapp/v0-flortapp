"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

interface ConversationActionsProps {
  conversationId: string
  context?: string
  isVip?: boolean
}

export function ConversationActions({ conversationId, context, isVip = false }: ConversationActionsProps) {
  const router = useRouter()

  const handleTransferToLiveChat = () => {
    // Build URL with query parameters
    const params = new URLSearchParams()
    params.append("conversationId", conversationId)

    if (context) {
      params.append("context", context)
    }

    if (isVip) {
      params.append("isVip", "true")
    }

    // Navigate to live chat
    router.push(`/user/live-chat?${params.toString()}`)
  }

  return (
    <Button onClick={handleTransferToLiveChat} className={isVip ? "bg-gradient-to-r from-yellow-500 to-amber-500" : ""}>
      <MessageSquare className="mr-2 h-4 w-4" />
      {isVip ? "VIP Canlı Destek" : "Canlı Destek"}
    </Button>
  )
}
