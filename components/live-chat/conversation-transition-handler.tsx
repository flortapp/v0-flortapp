"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import type { ConversationTransitionEvent } from "@/services/conversation-transition-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Bot, MessageSquare, CheckCircle2 } from "lucide-react"

interface ConversationTransitionHandlerProps {
  onTransitionStart?: (event: ConversationTransitionEvent) => void
  onTransitionComplete?: (conversationId: string, success: boolean) => void
}

export function ConversationTransitionHandler({
  onTransitionStart,
  onTransitionComplete,
}: ConversationTransitionHandlerProps) {
  const [activeTransitions, setActiveTransitions] = useState<Record<string, ConversationTransitionEvent>>({})
  const [completedTransitions, setCompletedTransitions] = useState<string[]>([])
  const [progress, setProgress] = useState<Record<string, number>>({})
  const { toast } = useToast()

  // Set up event listeners for transitions
  useEffect(() => {
    const handleTransitionStart = (event: CustomEvent<ConversationTransitionEvent>) => {
      const transitionEvent = event.detail

      // Call the callback if provided
      if (onTransitionStart) {
        onTransitionStart(transitionEvent)
      }

      // Add to active transitions
      setActiveTransitions((prev) => ({
        ...prev,
        [transitionEvent.conversationId]: transitionEvent,
      }))

      // Initialize progress
      setProgress((prev) => ({
        ...prev,
        [transitionEvent.conversationId]: 0,
      }))

      // Start progress animation
      let currentProgress = 0
      const interval = setInterval(() => {
        currentProgress += 5
        if (currentProgress >= 100) {
          clearInterval(interval)
        } else {
          setProgress((prev) => ({
            ...prev,
            [transitionEvent.conversationId]: currentProgress,
          }))
        }
      }, 100)

      // Clean up interval on unmount
      return () => clearInterval(interval)
    }

    const handleTransitionComplete = (event: CustomEvent<{ event: ConversationTransitionEvent }>) => {
      const { event: transitionEvent } = event.detail
      const { conversationId } = transitionEvent

      // Set progress to 100%
      setProgress((prev) => ({
        ...prev,
        [conversationId]: 100,
      }))

      // Remove from active transitions after a delay
      setTimeout(() => {
        setActiveTransitions((prev) => {
          const newTransitions = { ...prev }
          delete newTransitions[conversationId]
          return newTransitions
        })

        // Add to completed transitions
        setCompletedTransitions((prev) => [...prev, conversationId])

        // Call the callback if provided
        if (onTransitionComplete) {
          onTransitionComplete(conversationId, true)
        }

        // Remove from completed transitions after a delay
        setTimeout(() => {
          setCompletedTransitions((prev) => prev.filter((id) => id !== conversationId))
        }, 5000)
      }, 1000)
    }

    const handleTransitionError = (event: CustomEvent<{ event: ConversationTransitionEvent; error: Error }>) => {
      const { event: transitionEvent, error } = event.detail
      const { conversationId } = transitionEvent

      // Show error toast
      toast({
        title: "Konuşma Aktarımı Başarısız",
        description: error.message || "Konuşma aktarılırken bir hata oluştu.",
        variant: "destructive",
      })

      // Remove from active transitions
      setActiveTransitions((prev) => {
        const newTransitions = { ...prev }
        delete newTransitions[conversationId]
        return newTransitions
      })

      // Call the callback if provided
      if (onTransitionComplete) {
        onTransitionComplete(conversationId, false)
      }
    }

    // Add event listeners
    window.addEventListener("conversationTransitionStart", handleTransitionStart as EventListener)
    window.addEventListener("conversationTransitionComplete", handleTransitionComplete as EventListener)
    window.addEventListener("conversationTransitionError", handleTransitionError as EventListener)

    // Clean up event listeners
    return () => {
      window.removeEventListener("conversationTransitionStart", handleTransitionStart as EventListener)
      window.removeEventListener("conversationTransitionComplete", handleTransitionComplete as EventListener)
      window.removeEventListener("conversationTransitionError", handleTransitionError as EventListener)
    }
  }, [onTransitionStart, onTransitionComplete, toast])

  // Render active transitions
  return (
    <>
      {Object.entries(activeTransitions).map(([conversationId, event]) => (
        <Alert
          key={conversationId}
          className={`mb-4 ${
            event.toType === "live_chat" ? "border-blue-500 bg-blue-50/10" : "border-green-500 bg-green-50/10"
          }`}
        >
          <div className="flex items-center">
            {event.toType === "live_chat" ? (
              <MessageSquare className="h-4 w-4 text-blue-500 mr-2" />
            ) : (
              <Bot className="h-4 w-4 text-green-500 mr-2" />
            )}
            <AlertTitle>
              {event.toType === "live_chat" ? "Konuşma Canlı Sohbete Aktarılıyor" : "Konuşma Bot'a Aktarılıyor"}
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2">
            <div className="text-sm mb-2">
              {event.toType === "live_chat"
                ? "Konuşma geçmişi ve bağlam korunarak canlı sohbete aktarılıyor..."
                : "Konuşma geçmişi ve bağlam korunarak bot'a aktarılıyor..."}
            </div>
            <Progress value={progress[conversationId]} className="h-2" />
          </AlertDescription>
        </Alert>
      ))}

      {completedTransitions.map((conversationId) => (
        <Alert key={`completed-${conversationId}`} className="mb-4 border-green-500 bg-green-50/10">
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
            <AlertTitle>Konuşma Başarıyla Aktarıldı</AlertTitle>
          </div>
          <AlertDescription className="mt-2">
            <div className="text-sm">Konuşma geçmişi ve bağlam korunarak aktarıldı.</div>
          </AlertDescription>
        </Alert>
      ))}
    </>
  )
}
