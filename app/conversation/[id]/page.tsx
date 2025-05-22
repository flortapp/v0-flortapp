import { AdminLayout } from "@/components/layout/admin-layout"
import { ConversationDetail } from "@/components/bot-management/conversation-detail"

export default function ConversationDetailPage({ params }: { params: { id: string } }) {
  // For demonstration, we'll use mock IDs
  // In a real application, you would fetch the conversation details from an API
  const botId = "1"
  const userId = "user-1"

  return (
    <AdminLayout>
      <ConversationDetail botId={botId} userId={userId} />
    </AdminLayout>
  )
}
