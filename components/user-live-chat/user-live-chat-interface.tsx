"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Smile, Send, Loader2 } from "lucide-react"
import { EmojiPicker } from "@/components/live-chat/emoji-picker"
import type { Message } from "@/types/message"

interface UserLiveChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  botAvatar: string
  botName: string
  isTyping?: boolean
}

export function UserLiveChatInterface({
  messages,
  onSendMessage,
  botAvatar,
  botName,
  isTyping = false,
}: UserLiveChatInterfaceProps) {
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending message
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
      setShowEmojiPicker(false)
    }
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } ${msg.sender === "system" ? "justify-center" : ""}`}
          >
            {msg.sender === "system" ? (
              <div className="bg-muted px-4 py-2 rounded-md text-center max-w-[80%]">
                <p className="text-sm text-muted-foreground">{msg.content}</p>
              </div>
            ) : (
              <div
                className={`flex ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                } items-start gap-2 max-w-[80%]`}
              >
                {msg.sender === "bot" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={botAvatar || "/placeholder.svg"} alt={botName} />
                    <AvatarFallback>{botName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`px-4 py-2 rounded-lg ${
                    msg.sender === "user" ? "bg-[#fa2674] text-white" : "bg-[#2b2c46] text-white"
                  }`}
                >
                  <p>{msg.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      msg.sender === "user" ? "text-white/70" : "text-white/70"
                    } flex justify-between items-center`}
                  >
                    <span>{msg.time}</span>
                    {msg.sender === "user" && <span>{msg.read ? "Okundu" : "İletildi"}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 bg-[#2b2c46] px-4 py-2 rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm text-white/70">{botName} yazıyor...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t border-[#2b2c46] p-4">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Mesajınızı yazın..."
            className="min-h-[80px] pr-24"
          />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <div className="relative">
              <Button type="button" size="icon" variant="ghost" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <Smile className="h-5 w-5" />
              </Button>
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2">
                  <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                </div>
              )}
            </div>
            <Button
              type="button"
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-[#fa2674] hover:bg-[#e01e65]"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Gönder</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
