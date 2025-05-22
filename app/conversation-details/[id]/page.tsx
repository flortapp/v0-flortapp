"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConversationTransitionHistory } from "@/components/live-chat/conversation-transition-history"
import { ConversationFlowDiagram } from "@/components/live-chat/conversation-flow-diagram"
import { ConversationLocationIndicator } from "@/components/live-chat/conversation-location-indicator"
import { conversationService } from "@/services/conversation-service"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ConversationMetadata } from "@/types/conversation"

export default function ConversationDetailsPage({ params }: { params: { id: string } }) {
  const [conversation, setConversation] = useState<ConversationMetadata | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchConversation = () => {
      const conversationData = conversationService.getConversation(params.id)
      if (conversationData) {
        setConversation(conversationData)
      }
    }

    fetchConversation()

    // Listen for conversation updates
    const handleConversationUpdate = () => {
      fetchConversation()
    }

    window.addEventListener("conversationTransitionComplete", handleConversationUpdate)

    return () => {
      window.removeEventListener("conversationTransitionComplete", handleConversationUpdate)
    }
  }, [params.id])

  if (!conversation) {
    return (
      <AdminLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Konuşma Bulunamadı</h1>
          </div>
          <Card>
            <CardContent className="p-6">
              <p>Belirtilen ID ile bir konuşma bulunamadı.</p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Konuşma Detayları</h1>
          <ConversationLocationIndicator conversationId={params.id} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Konuşma Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Konuşma ID</p>
                <p className="text-sm text-gray-500">{conversation.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Durum</p>
                <p className="text-sm text-gray-500">{conversation.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Kullanıcı</p>
                <p className="text-sm text-gray-500">User {conversation.userId}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Bot</p>
                <p className="text-sm text-gray-500">Bot {conversation.botId}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Oluşturulma Tarihi</p>
                <p className="text-sm text-gray-500">{new Date(conversation.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Son Güncelleme</p>
                <p className="text-sm text-gray-500">{new Date(conversation.updatedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Mesaj Sayısı</p>
                <p className="text-sm text-gray-500">{conversation.messageCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium">VIP Kullanıcı</p>
                <p className="text-sm text-gray-500">{conversation.isVipUser ? "Evet" : "Hayır"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <ConversationFlowDiagram conversationId={params.id} />

        <Tabs defaultValue="transitions">
          <TabsList>
            <TabsTrigger value="transitions">Geçiş Geçmişi</TabsTrigger>
            <TabsTrigger value="messages">Mesajlar</TabsTrigger>
            <TabsTrigger value="analytics">Analitik</TabsTrigger>
          </TabsList>
          <TabsContent value="transitions" className="mt-4">
            <ConversationTransitionHistory conversationId={params.id} />
          </TabsContent>
          <TabsContent value="messages" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Mesaj Geçmişi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Mesaj geçmişi burada görüntülenecek.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Konuşma Analizi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Konuşma analizi burada görüntülenecek.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
