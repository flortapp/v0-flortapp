import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Bot, MessageSquare, Archive } from "lucide-react"
import { conversationTransitionService } from "@/services/conversation-transition-service"

interface ConversationLocationIndicatorProps {
  conversationId: string
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function ConversationLocationIndicator({
  conversationId,
  showLabel = true,
  size = "md",
}: ConversationLocationIndicatorProps) {
  const location = conversationTransitionService.getConversationLocation(conversationId)

  const getIcon = () => {
    switch (location) {
      case "live_chat":
        return <MessageSquare className={`${getIconSize()} text-blue-500`} />
      case "bot":
        return <Bot className={`${getIconSize()} text-green-500`} />
      case "archived":
        return <Archive className={`${getIconSize()} text-gray-500`} />
      default:
        return <Bot className={`${getIconSize()} text-green-500`} />
    }
  }

  const getLabel = () => {
    switch (location) {
      case "live_chat":
        return "Canlı Sohbet"
      case "bot":
        return "Bot"
      case "archived":
        return "Arşivlenmiş"
      default:
        return "Bot"
    }
  }

  const getColor = () => {
    switch (location) {
      case "live_chat":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "bot":
        return "bg-green-100 text-green-800 border-green-200"
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "h-3 w-3"
      case "md":
        return "h-4 w-4"
      case "lg":
        return "h-5 w-5"
      default:
        return "h-4 w-4"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${getColor()} flex items-center gap-1`}>
            {getIcon()}
            {showLabel && <span>{getLabel()}</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Bu konuşma şu anda {getLabel().toLowerCase()} alanında.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
