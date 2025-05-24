"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { mockApi } from "@/services/api-mock"
import { Loader2, MessageSquare } from "lucide-react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { BotConversationsContent } from "@/components/bot-conversations/bot-conversations-content"

interface BotStats {
  id: string
  name: string
  avatar: string
  activeConversations: number
  totalMessages: number
}

export default function BotConversationsPage() {
  return (
    <AdminLayout>
      <BotConversationsContent />
    </AdminLayout>
  )
} 