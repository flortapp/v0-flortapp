"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { conversationTransitionService, type TransitionHistoryEntry } from "@/services/conversation-transition-service"
import { Bot, MessageSquare, ArrowRight } from "lucide-react"
import { format } from "date-fns"

interface ConversationFlowDiagramProps {
  conversationId: string
}

export function ConversationFlowDiagram({ conversationId }: ConversationFlowDiagramProps) {
  const [history, setHistory] = useState<TransitionHistoryEntry[]>([])
  const [currentLocation, setCurrentLocation] = useState(
    conversationTransitionService.getConversationLocation(conversationId),
  )

  useEffect(() => {
    // Get initial history
    const initialHistory = conversationTransitionService.getTransitionHistory(conversationId)
    setHistory(initialHistory)

    // Listen for new transitions
    const handleTransitionComplete = (event: CustomEvent<{ event: any }>) => {
      if (event.detail.event.conversationId === conversationId) {
        const updatedHistory = conversationTransitionService.getTransitionHistory(conversationId)
        setHistory(updatedHistory)
        setCurrentLocation(conversationTransitionService.getConversationLocation(conversationId))
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
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Konuşma Akışı</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
              <Bot className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-sm text-gray-500 ml-3">Bu konuşma henüz aktarılmamış.</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Konuşma Akışı</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
              <Bot className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm mt-2">Bot</span>
          </div>

          <div className="flex-1 mx-4">
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>

              {history.map((entry, index) => {
                const position = ((index + 1) / (history.length + 1)) * 100
                const isToLiveChat = entry.event.toType === "live_chat"

                return (
                  <div key={index} className="absolute top-1/2 -translate-y-1/2" style={{ left: `${position}%` }}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          entry.success ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </div>
                      <div className="text-xs mt-1 whitespace-nowrap">
                        {format(new Date(entry.event.timestamp), "HH:mm")}
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        {isToLiveChat ? "Bot → Canlı" : "Canlı → Bot"}
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Current location indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 animate-pulse"
                style={{
                  left: currentLocation === "live_chat" ? "100%" : "0%",
                  transform: "translate(-50%, -50%)",
                }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm mt-2">Canlı Sohbet</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
