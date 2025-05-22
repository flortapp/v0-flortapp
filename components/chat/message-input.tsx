"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send, Smile, Paperclip, MapPin } from "lucide-react"
import { EmojiPicker } from "@/components/live-chat/emoji-picker"

export function MessageInput() {
  const [inputValue, setInputValue] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mesaj gönderme işlevi
  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Mesaj gönderme işlemleri burada yapılacak
    console.log("Mesaj gönderildi:", inputValue)

    // Input'u temizle
    setInputValue("")
  }

  // Emoji seçme işlevi
  const handleEmojiSelect = (emoji: any) => {
    setInputValue((prev) => prev + (emoji.native || emoji))
    setShowEmojiPicker(false)
  }

  // Dosya yükleme işlevi
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    // Dosya yükleme işlemleri burada yapılacak
    console.log("Dosya yükleniyor:", files[0].name)

    // Yükleme tamamlandıktan sonra
    setTimeout(() => {
      setIsUploading(false)
      if (event.target) {
        event.target.value = ""
      }
    }, 2000)
  }

  return (
    <div className="p-4">
      <div className="relative">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Bot olarak bir mesaj yazın..."
          className="min-h-[80px] w-full bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 resize-none pr-24"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
        />

        <div className="absolute bottom-2 right-2 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100"
            onClick={() => {
              /* Konum oluşturma işlevi */
            }}
          >
            <MapPin className="h-5 w-5" />
          </Button>

          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {showEmojiPicker && (
          <div className="absolute bottom-full right-0 mb-2 z-50">
            <EmojiPicker onEmojiSelect={handleEmojiSelect} onClickOutside={() => setShowEmojiPicker(false)} />
          </div>
        )}

        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*" />
      </div>
    </div>
  )
}
