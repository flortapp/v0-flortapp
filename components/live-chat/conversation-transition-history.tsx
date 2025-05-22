"use client"

import { useState, useEffect } from "react"
import { conversationTransitionService, type TransitionHistoryEntry } from "@/services/conversation-transition-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, MessageSquare, Archive, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"

interface ConversationTransitionHistoryProps {
  conversationId: string
}

export function ConversationTransitionHistory({ conversationId }: ConversationTransitionHistoryProps) {
  const [history, setHistory] = useState<TransitionHistoryEntry[]>([])

  useEffect(() => {
    // Get initial history
    const initialHistory = conversationTransitionService.getTransitionHistory(conversationId)
    setHistory(initialHistory)

    // Listen for new transitions
    const handleTransitionComplete = (event: CustomEvent<{ event: any }>) => {
      if (event.detail.event.conversationId === conversationId) {
        const updatedHistory = conversationTransitionService.getTransitionHistory(conversationId)
        setHistory(updatedHistory)
      }
    }

    // Add event listener
    window.addEventListener("conversationTransitionComplete", handleTransitionComplete as EventListener)

    // Clean up
    return () => {
      window.removeEventListener("conversationTransitionComplete", handleTransitionComplete as EventListener)
    }
  }, [conversationId])

  if (history.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Konuşma Geçiş Geçmişi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((entry, index) => (
            <div key={index} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {entry.event.toType === "live_chat" ? (
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                  ) : entry.event.toType === "bot" ? (
                    <Bot className="h-4 w-4 text-green-500" />
                  ) : (
                    <Archive className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="font-medium">
                    {entry.event.toType === "live_chat"
                      ? "Canlı Sohbete Aktarıldı"
                      : entry.event.toType === "bot"
                        ? "Bot'a Aktarıldı"
                        : "Arşivlendi"}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={
                    entry.success
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  }
                >
                  {entry.success ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                  {entry.success ? "Başarılı" : "Başarısız"}
                </Badge>
              </div>
              <div className="text-sm text-gray-500 flex flex-col gap-1">
                <div>
                  <span className="font-medium">Tarih:</span>{" "}
                  {format(new Date(entry.event.timestamp), "dd MMM yyyy HH:mm:ss")}
                </div>
                <div>
                  <span className="font-medium">Başlatan:</span> {entry.event.initiatedBy}
                </div>
                {entry.event.reason && (
                  <div>
                    <span className="font-medium">Sebep:</span> {entry.event.reason}
                  </div>
                )}
                {entry.error && (
                  <div className="text-red-500">
                    <span className="font-medium">Hata:</span> {entry.error}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
