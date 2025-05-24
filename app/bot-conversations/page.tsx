"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { BotConversationsContent } from "@/components/bot-conversations/bot-conversations-content"

export default function BotConversationsPage() {
  return (
    <AdminLayout>
      <BotConversationsContent />
    </AdminLayout>
  )
} 