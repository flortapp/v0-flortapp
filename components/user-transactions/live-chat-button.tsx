"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface LiveChatButtonProps {
  conversationId?: string
  context?: string
  isVip?: boolean
}

export function LiveChatButton({ conversationId, context, isVip = false }: LiveChatButtonProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleStartLiveChat = () => {
    // Build the URL with query parameters
    let url = "/user/live-chat"
    const params = new URLSearchParams()

    if (conversationId) {
      params.append("conversationId", conversationId)
    }

    if (context) {
      params.append("context", context)
    }

    if (isVip) {
      params.append("isVip", "true")
    }

    const queryString = params.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    // Navigate to live chat page
    router.push(url)

    // Show different toast based on VIP status
    if (isVip) {
      toast({
        title: "VIP Canlı Destek",
        description: "VIP üyeliğiniz sayesinde öncelikli destek hattına bağlanıyorsunuz.",
        variant: "default",
      })
    } else {
      toast({
        title: "Canlı Destek",
        description: "Canlı destek hattına bağlanıyorsunuz. Lütfen bekleyin.",
        variant: "default",
      })
    }
  }

  return (
    <Button
      onClick={handleStartLiveChat}
      className={isVip ? "bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600" : ""}
    >
      <MessageSquare className="mr-2 h-4 w-4" />
      {isVip ? "VIP Canlı Destek" : "Canlı Destek"}
    </Button>
  )
}
