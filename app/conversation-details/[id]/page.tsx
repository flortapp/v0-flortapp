import { Metadata } from "next"
import { ConversationDetailsContent } from "@/components/bot-management/conversation-details-content"

export const metadata: Metadata = {
  title: "Konuşma Detayları - FlortApp Admin",
  description: "Bot konuşması detayları",
}

export default function ConversationDetailsPage({ params }: { params: { id: string } }) {
  return <ConversationDetailsContent conversationId={params.id} />
}
