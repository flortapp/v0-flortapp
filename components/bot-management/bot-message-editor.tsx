"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { botMessageService, type MessageType } from "@/services/bot-message-service"

interface BotMessageEditorProps {
  botId: string
  botName: string
  botAvatar: string
  messageType: MessageType
  title: string
  description: string
  placeholder: string
  onSave?: (messages: string[]) => void
}

export function BotMessageEditor({
  botId,
  botName,
  botAvatar,
  messageType,
  title,
  description,
  placeholder,
  onSave,
}: BotMessageEditorProps) {
  const [messages, setMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Mesajları yükle
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true)
      try {
        const loadedMessages = await botMessageService.getBotMessages(botId, messageType)
        setMessages(loadedMessages)
      } catch (error) {
        console.error("Mesajlar yüklenirken hata oluştu:", error)
        toast({
          title: "Hata",
          description: "Mesajlar yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (botId) {
      loadMessages()
    }
  }, [botId, messageType, toast])

  // Yeni mesaj ekle
  const handleAddMessage = async () => {
    if (!newMessage.trim()) return

    const updatedMessages = [...messages, newMessage.trim()]
    setMessages(updatedMessages)
    setNewMessage("")

    try {
      await botMessageService.saveBotMessages(botId, messageType, updatedMessages)

      toast({
        title: "Başarılı",
        description: "Mesaj başarıyla eklendi.",
        variant: "success",
      })

      if (onSave) {
        onSave(updatedMessages)
      }
    } catch (error) {
      console.error("Mesaj eklenirken hata oluştu:", error)
      toast({
        title: "Hata",
        description: "Mesaj eklenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  // Mesaj sil
  const handleRemoveMessage = async (index: number) => {
    const updatedMessages = messages.filter((_, i) => i !== index)
    setMessages(updatedMessages)

    try {
      await botMessageService.saveBotMessages(botId, messageType, updatedMessages)

      toast({
        title: "Başarılı",
        description: "Mesaj başarıyla silindi.",
        variant: "success",
      })

      if (onSave) {
        onSave(updatedMessages)
      }
    } catch (error) {
      console.error("Mesaj silinirken hata oluştu:", error)
      toast({
        title: "Hata",
        description: "Mesaj silinirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mevcut mesajlar */}
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div key={index} className="flex items-start gap-3 group">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={botAvatar || "/placeholder.svg"} alt={botName} />
                  <AvatarFallback>{botName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="bg-[#2b2c46] text-white rounded-lg p-3 flex-1">
                  <p className="text-sm">{message}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveMessage(index)}
                >
                  &times;
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center p-4 border border-dashed rounded-lg">
              <p className="text-muted-foreground">Henüz mesaj eklenmemiş</p>
            </div>
          )}
        </div>

        {/* Yeni mesaj ekleme */}
        <div className="space-y-2">
          <Label htmlFor={`new-${messageType}-message`}>Yeni Mesaj</Label>
          <div className="flex gap-2">
            <Textarea
              id={`new-${messageType}-message`}
              placeholder={placeholder}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  e.preventDefault()
                  handleAddMessage()
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddMessage}
              className="self-end"
              disabled={isLoading || !newMessage.trim()}
            >
              Ekle
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Mesaj eklemek için yazın ve "Ekle" butonuna tıklayın veya Ctrl+Enter tuşlarına basın.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
