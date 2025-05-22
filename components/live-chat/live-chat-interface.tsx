"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Smile, MapPin, Pin, MessageSquare, Settings, Info, Bot } from "lucide-react"
import { EmojiPicker } from "./emoji-picker"
import { useToast } from "@/hooks/use-toast"
import { StaticLocationMap } from "./static-location-map"
import { generateRandomLocation } from "@/utils/location-generator"
import { UserInfoPanel } from "./user-info-panel"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BotRedirectionHandler } from "./bot-redirection-handler"
import { BotSelectionDialog } from "./bot-selection-dialog"
import { BotRedirectionStatus } from "./bot-redirection-status"
import { ConversationLocationIndicator } from "@/components/live-chat/conversation-location-indicator"

// Define the User interface
interface User {
  id: string
  name: string
  email: string
  birthDate?: string
  location?: string
  coins?: string
  lastActive?: string
  online: boolean
  profileData?: {
    birthDate: string
    location: string
    coins: string
  }
}

// Define the BotType interface
interface BotType {
  id: string
  name: string
  email: string
  online: boolean
  location?: string
}

// Define the Message interface
interface Message {
  id: string
  sender: "user" | "bot" | "system"
  content: string
  time: string
  read: boolean
  image?: string
  location?: {
    lat: number
    lng: number
    placeName: string
    city: string
    neighborhood?: string
    placeType?: string
    googleMapsUrl?: string
  }
}

interface LiveChatInterfaceProps {
  user: User
  bot: BotType
  isPinned?: boolean
  onTogglePin?: () => void
  messages: Message[]
  onSendSystemMessage: () => void
  onSendBotMessage: (content: string, image?: string, location?: Message["location"]) => void
  conversationId: string
}

export function LiveChatInterface({
  user,
  bot,
  isPinned,
  onTogglePin,
  messages,
  onSendSystemMessage,
  onSendBotMessage,
  conversationId,
}: LiveChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showLocationMap, setShowLocationMap] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<Message["location"]>()
  const [showUserInfo, setShowUserInfo] = useState(true)
  const [adminControlsEnabled, setAdminControlsEnabled] = useState(true)
  const [redirectionStatus, setRedirectionStatus] = useState<
    "idle" | "selecting" | "redirecting" | "completed" | "failed"
  >("idle")
  const [showBotSelectionDialog, setShowBotSelectionDialog] = useState(false)
  const [redirectionError, setRedirectionError] = useState<string | null>(null)
  const [redirectionStartTime, setRedirectionStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Reset redirection status when conversation changes
  useEffect(() => {
    setRedirectionStatus("idle")
    setRedirectionError(null)
    setRedirectionStartTime(null)
    setElapsedTime(0)
  }, [conversationId])

  // Update elapsed time during redirection
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (redirectionStatus === "redirecting" && redirectionStartTime) {
      intervalId = setInterval(() => {
        const elapsed = Math.floor((Date.now() - redirectionStartTime) / 1000)
        setElapsedTime(elapsed)
      }, 1000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [redirectionStatus, redirectionStartTime])

  // Handle sending a message from the bot
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    // Send the message with current location if available
    onSendBotMessage(inputValue, undefined, currentLocation)

    // Clear the input and location after sending
    setInputValue("")
    if (currentLocation) {
      setCurrentLocation(undefined)
      setShowLocationMap(false)
    }
  }

  // Handle emoji selection
  const handleEmojiSelect = (emoji: any) => {
    setInputValue((prev) => prev + (emoji.native || emoji))
    setShowEmojiPicker(false)
  }

  // Generate random location for the bot
  const handleGenerateLocation = () => {
    // Use the bot's city if available, otherwise select a random city
    const botCity = bot.location || "Istanbul"

    // Generate a random location within the bot's city
    const location = generateRandomLocation(botCity)

    // Set current location
    setCurrentLocation(location)

    // Show the location map
    setShowLocationMap(true)
  }

  // Regenerate location for the bot
  const handleRegenerateLocation = () => {
    if (!currentLocation) return

    // Use the same city as the current location
    const botCity = currentLocation.city

    // Generate a new random location within the same city
    const location = generateRandomLocation(botCity)

    // Set current location
    setCurrentLocation(location)
  }

  // Send location only
  const handleSendLocationOnly = () => {
    if (!currentLocation) return

    // Send an empty message with the location
    onSendBotMessage("Konumum:", undefined, currentLocation)

    // Clear the location after sending
    setCurrentLocation(undefined)
    setShowLocationMap(false)
  }

  // Open bot selection dialog
  const handleOpenBotSelection = () => {
    if (!adminControlsEnabled || redirectionStatus === "redirecting" || redirectionStatus === "completed") return

    setShowBotSelectionDialog(true)
    setRedirectionStatus("selecting")
  }

  // Route the conversation to a specific bot
  const handleRouteToBot = (targetBotId: string) => {
    if (!adminControlsEnabled) return

    setRedirectionStatus("redirecting")
    setRedirectionError(null)
    setRedirectionStartTime(Date.now())
    setElapsedTime(0)

    // Dispatch a custom event to trigger the bot redirection
    const event = new CustomEvent("botRedirection", {
      detail: {
        userId: user.id,
        botId: targetBotId,
        messages: messages,
        originalConversationId: conversationId,
        preserveContext: true, // Always preserve context for admin-initiated redirections
      },
    })

    window.dispatchEvent(event)
  }

  // Route to a random bot
  const handleRouteToRandomBot = () => {
    if (!adminControlsEnabled) return

    setRedirectionStatus("redirecting")
    setRedirectionError(null)
    setRedirectionStartTime(Date.now())
    setElapsedTime(0)

    // Dispatch a custom event to trigger the bot redirection
    const event = new CustomEvent("botRedirection", {
      detail: {
        userId: user.id,
        botId: "random", // Special value to indicate random bot selection
        messages: messages,
        originalConversationId: conversationId,
        preserveContext: true,
      },
    })

    window.dispatchEvent(event)
  }

  // Handle redirection start
  const handleRedirectionStart = (userId: string, botId: string) => {
    setRedirectionStatus("redirecting")
    setRedirectionStartTime(Date.now())
    setElapsedTime(0)
    console.log(`Starting redirection from user ${userId} to bot ${botId}`)
  }

  // Handle redirection completion
  const handleRedirectionComplete = (newConversationId: string) => {
    setRedirectionStatus("completed")
    console.log(`Redirection completed. New conversation ID: ${newConversationId}`)
  }

  // Handle redirection error
  const handleRedirectionError = (error: Error) => {
    setRedirectionStatus("failed")
    setRedirectionError(error.message || "Yönlendirme sırasında bir hata oluştu.")
    console.error("Redirection failed:", error)
  }

  // Retry failed redirection
  const handleRetryRedirection = () => {
    setShowBotSelectionDialog(true)
    setRedirectionStatus("selecting")
    setRedirectionError(null)
  }

  // Dismiss redirection error
  const handleDismissRedirection = () => {
    setRedirectionStatus("idle")
    setRedirectionError(null)
  }

  // Toggle admin controls
  const toggleAdminControls = () => {
    setAdminControlsEnabled(!adminControlsEnabled)

    toast({
      title: adminControlsEnabled ? "Admin Kontrolleri Devre Dışı" : "Admin Kontrolleri Etkin",
      description: adminControlsEnabled
        ? "Admin kontrolleri devre dışı bırakıldı."
        : "Admin kontrolleri etkinleştirildi.",
      variant: adminControlsEnabled ? "default" : "success",
    })
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Bot Redirection Handler */}
      <BotRedirectionHandler
        onRedirectionComplete={handleRedirectionComplete}
        onRedirectionStart={handleRedirectionStart}
        onRedirectionError={handleRedirectionError}
      />

      {/* Bot Selection Dialog */}
      <BotSelectionDialog
        open={showBotSelectionDialog}
        onOpenChange={setShowBotSelectionDialog}
        onBotSelect={handleRouteToBot}
        currentBotId={bot.id}
      />

      {/* Chat header */}
      <div className="border-b border-gray-200 p-4 bg-white flex flex-wrap justify-between items-center gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-700">{user.name.substring(0, 1)}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium text-gray-900">{user.name}</h2>
              {isPinned && <Pin className="h-4 w-4 text-kisstagram-pink rotate-45" />}
              <ConversationLocationIndicator conversationId={conversationId} />
            </div>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
                <Settings className="mr-2 h-4 w-4" />
                <span>Admin Kontrolleri</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200">
              <DropdownMenuLabel>Sohbet Kontrolleri</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSendSystemMessage} disabled={!adminControlsEnabled}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Sistem Mesajı Gönder</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Bot Yönlendirme</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={handleOpenBotSelection}
                disabled={
                  !adminControlsEnabled || redirectionStatus === "redirecting" || redirectionStatus === "completed"
                }
              >
                <Bot className="mr-2 h-4 w-4" />
                <span>Belirli Bot'a Yönlendir</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleRouteToRandomBot}
                disabled={
                  !adminControlsEnabled || redirectionStatus === "redirecting" || redirectionStatus === "completed"
                }
              >
                <Bot className="mr-2 h-4 w-4" />
                <span>Rastgele Bot'a Yönlendir</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleGenerateLocation} disabled={!adminControlsEnabled}>
                <MapPin className="mr-2 h-4 w-4" />
                <span>Konum Oluştur</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowUserInfo(!showUserInfo)} disabled={!adminControlsEnabled}>
                <Info className="mr-2 h-4 w-4" />
                <span>{showUserInfo ? "Kullanıcı Bilgilerini Gizle" : "Kullanıcı Bilgilerini Göster"}</span>
              </DropdownMenuItem>
              {onTogglePin && (
                <DropdownMenuItem onClick={onTogglePin} disabled={!adminControlsEnabled}>
                  <Pin className={`mr-2 h-4 w-4 ${isPinned ? "rotate-45" : ""}`} />
                  <span>{isPinned ? "Sabitlemeyi Kaldır" : "Sohbeti Sabitle"}</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleAdminControls}>
                <Settings className="mr-2 h-4 w-4" />
                <span>
                  {adminControlsEnabled ? "Admin Kontrollerini Devre Dışı Bırak" : "Admin Kontrollerini Etkinleştir"}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            className={`bg-white border-gray-200 text-gray-700 hover:bg-gray-50 ${
              redirectionStatus === "completed"
                ? "border-green-500"
                : redirectionStatus === "failed"
                  ? "border-red-500"
                  : ""
            }`}
            onClick={handleOpenBotSelection}
            disabled={!adminControlsEnabled || redirectionStatus === "redirecting" || redirectionStatus === "completed"}
          >
            <Bot className="mr-2 h-4 w-4" />
            <span>Bot'a Yönlendir</span>
          </Button>

          <Button
            variant={isPinned ? "default" : "outline"}
            className={
              isPinned
                ? "bg-kisstagram-pink hover:bg-kisstagram-pink_dark text-white"
                : "text-gray-700 hover:text-kisstagram-pink border-gray-200"
            }
            onClick={onTogglePin}
            disabled={!adminControlsEnabled}
          >
            <Pin className={`mr-2 h-4 w-4 ${isPinned ? "rotate-45" : ""}`} />
            {isPinned ? "Sabitlemeyi Kaldır" : "Sohbeti Sabitle"}
          </Button>
        </div>
      </div>

      {/* User info panel (collapsible) */}
      {showUserInfo && <UserInfoPanel user={user} />}

      {/* Redirection status */}
      {redirectionStatus !== "idle" && (
        <div className="px-4 pt-4">
          <BotRedirectionStatus
            status={redirectionStatus}
            error={redirectionError}
            onRetry={handleRetryRedirection}
            onDismiss={handleDismissRedirection}
            elapsedTime={elapsedTime}
          />
        </div>
      )}

      {/* Location map preview */}
      {showLocationMap && currentLocation && (
        <div className="px-4 pt-4">
          <StaticLocationMap
            lat={currentLocation.lat}
            lng={currentLocation.lng}
            placeName={currentLocation.placeName}
            city={currentLocation.city}
            onClose={() => {
              setShowLocationMap(false)
              setCurrentLocation(undefined)
            }}
            onRegenerate={handleRegenerateLocation}
            onSend={handleSendLocationOnly}
            showControls={true}
          />
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : message.sender === "system" ? "justify-center" : "justify-start"}`}
          >
            {message.sender === "bot" && (
              <Avatar className="h-8 w-8 mr-2 mt-1">
                <AvatarImage
                  src={`/abstract-geometric-shapes.png?height=32&width=32&query=${bot.name}`}
                  alt={bot.name}
                />
                <AvatarFallback>{bot.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}

            <div
              className={`max-w-[70%] rounded-lg p-3 shadow-sm ${
                message.sender === "user"
                  ? "bg-kisstagram-pink_light text-gray-800"
                  : message.sender === "system"
                    ? "bg-yellow-50 text-yellow-800 border border-yellow-200 max-w-[90%]"
                    : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              <p className="text-sm">{message.content}</p>

              {message.image && (
                <div className="mt-2">
                  <img src={message.image || "/placeholder.svg"} alt="Shared image" className="rounded-lg max-w-full" />
                </div>
              )}

              {message.location && (
                <div className="mt-2">
                  <StaticLocationMap
                    lat={message.location.lat}
                    lng={message.location.lng}
                    placeName={message.location.placeName}
                    city={message.location.city}
                    neighborhood={message.location.neighborhood}
                    googleMapsUrl={message.location.googleMapsUrl}
                    onClose={() => {}} // This is just a display in message, can't be closed
                    interactive={true}
                    inMessage={true}
                  />
                </div>
              )}

              <p className="text-xs mt-1 opacity-70 text-right">{message.time}</p>
            </div>

            {message.sender === "user" && (
              <Avatar className="h-8 w-8 ml-2 mt-1">
                <AvatarImage
                  src={`/abstract-geometric-shapes.png?height=32&width=32&query=${user.name}`}
                  alt={user.name}
                />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Admin controls for sending messages */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
            onClick={handleGenerateLocation}
            disabled={!adminControlsEnabled}
          >
            <MapPin className="h-4 w-4 mr-1" />
            Konum Oluştur
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
            onClick={onSendSystemMessage}
            disabled={!adminControlsEnabled}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Sistem Mesajı
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`text-xs ${
              redirectionStatus === "completed"
                ? "bg-green-50 text-green-700 border-green-200"
                : redirectionStatus === "redirecting"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
            }`}
            onClick={handleOpenBotSelection}
            disabled={!adminControlsEnabled || redirectionStatus === "redirecting" || redirectionStatus === "completed"}
          >
            <Bot className="h-4 w-4 mr-1" />
            {redirectionStatus === "completed"
              ? "Yönlendirildi"
              : redirectionStatus === "redirecting"
                ? "Yönlendiriliyor..."
                : "Bot'a Yönlendir"}
          </Button>
        </div>
        <div className="relative">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Bot olarak bir mesaj yazın..."
            className="min-h-[80px] w-full bg-white border-gray-200 focus:border-kisstagram-pink focus:ring-kisstagram-pink resize-none pr-24"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={!adminControlsEnabled}
          />
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={!adminControlsEnabled}
            >
              <Smile className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-full bg-kisstagram-pink hover:bg-kisstagram-pink_dark"
              onClick={handleSendMessage}
              disabled={inputValue.trim() === "" || !adminControlsEnabled}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2 z-50">
              <EmojiPicker onEmojiSelect={handleEmojiSelect} onClickOutside={() => setShowEmojiPicker(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
