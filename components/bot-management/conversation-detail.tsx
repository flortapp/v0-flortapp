"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, MessageSquare, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  sender: "bot" | "user"
  content: string
  timestamp: string
  read: boolean
}

interface ConversationDetailProps {
  botId: string
  userId: string
}

export function ConversationDetail({ botId, userId }: ConversationDetailProps) {
  const { toast } = useToast()
  const router = useRouter()

  // Mock data for the conversation
  const [conversation, setConversation] = useState({
    id: "conv-123",
    botId,
    userId,
    status: "active",
    messageCount: 8,
    startedAt: "15 Mart 2024, 14:32",
    lastMessageAt: "15 Mart 2024, 15:47",
    bot: {
      id: botId,
      name: "Sophia",
      avatar: "/abstract-geometric-shapes.png?height=40&width=40&query=female avatar",
      gender: "Kadın",
      age: 28,
    },
    user: {
      id: userId,
      name: "Ahmet Yılmaz",
      avatar: "/abstract-geometric-shapes.png?height=40&width=40&query=male user",
      gender: "Erkek",
      age: 32,
      location: "İstanbul",
    },
    messages: [
      {
        id: "msg-1",
        sender: "bot",
        content: "Merhaba! Profilini inceledim ve çok ilgimi çekti. Nasılsın?",
        timestamp: "14:32",
        read: true,
      },
      {
        id: "msg-2",
        sender: "user",
        content: "Merhaba! Teşekkür ederim, iyiyim. Sen nasılsın?",
        timestamp: "14:35",
        read: true,
      },
      {
        id: "msg-3",
        sender: "bot",
        content: "Ben de iyiyim, teşekkürler! İstanbul'da yaşıyorsun sanırım. Hangi semtte oturuyorsun?",
        timestamp: "14:38",
        read: true,
      },
      {
        id: "msg-4",
        sender: "user",
        content: "Kadıköy'de oturuyorum. Sen nerelisin?",
        timestamp: "14:42",
        read: true,
      },
      {
        id: "msg-5",
        sender: "bot",
        content: "Ben de İstanbul'dayım, Beşiktaş'ta yaşıyorum. Hobilerin neler?",
        timestamp: "14:45",
        read: true,
      },
      {
        id: "msg-6",
        sender: "user",
        content: "Fotoğrafçılık, yüzme ve seyahat etmeyi seviyorum. Sen nelerden hoşlanırsın?",
        timestamp: "15:01",
        read: true,
      },
      {
        id: "msg-7",
        sender: "bot",
        content:
          "Yoga yapmayı, kitap okumayı ve yeni yerler keşfetmeyi seviyorum. Fotoğrafçılıkla profesyonel olarak mı ilgileniyorsun?",
        timestamp: "15:10",
        read: true,
      },
      {
        id: "msg-8",
        sender: "user",
        content:
          "Hayır, sadece hobi olarak. Ama birkaç sergiye katıldım. Belki bir gün birlikte fotoğraf çekmeye çıkabiliriz?",
        timestamp: "15:47",
        read: true,
      },
    ] as Message[],
  })

  const handleEscalateConversation = () => {
    toast({
      title: "Konuşma Yükseltildi",
      description: "Konuşma canlı sohbete yükseltildi. Şimdi devam edebilirsiniz.",
      variant: "success",
    })

    router.push("/live-chat")
  }

  const handleSendSystemMessage = () => {
    const updatedMessages = [
      ...conversation.messages,
      {
        id: `msg-${conversation.messages.length + 1}`,
        sender: "bot",
        content:
          "Sistem Mesajı: Uygulamamız üzerinde, ceptelefonu, adres ve kişisel bilgilerinizi vermenizi tavsiye etmiyoruz. Bu tarz bilgileri paylaştığınız durumda oluşabilecek sorunlardan sorumlu değildir.",
        timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
        read: false,
      } as Message,
    ]

    setConversation({
      ...conversation,
      messages: updatedMessages,
      messageCount: updatedMessages.length,
      lastMessageAt: new Date().toLocaleString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    })

    toast({
      title: "Sistem Mesajı Gönderildi",
      description: "Sistem mesajı başarıyla gönderildi.",
      variant: "success",
    })
  }

  // Check if conversation has reached 5 user replies
  const userRepliesCount = conversation.messages.filter((msg) => msg.sender === "user").length
  const canEscalate = userRepliesCount >= 5

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Konuşma Detayı</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleSendSystemMessage}>
            <AlertTriangle className="h-4 w-4" />
            <span>Sistem Mesajı Gönder</span>
          </Button>
          <Button
            className={`flex items-center gap-2 ${canEscalate ? "bg-gradient-to-r from-pink-600 to-red-500" : "bg-gray-400"}`}
            onClick={handleEscalateConversation}
            disabled={!canEscalate}
          >
            <ArrowUpRight className="h-4 w-4" />
            <span>Canlı Sohbete Yükselt</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bot Info */}
        <Card>
          <CardHeader>
            <CardTitle>Bot Bilgileri</CardTitle>
            <CardDescription>Konuşmayı başlatan bot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={conversation.bot.avatar || "/placeholder.svg"} alt={conversation.bot.name} />
                <AvatarFallback>{conversation.bot.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{conversation.bot.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {conversation.bot.gender}, {conversation.bot.age} yaşında
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Kullanıcı Bilgileri</CardTitle>
            <CardDescription>Konuşmanın diğer tarafı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} alt={conversation.user.name} />
                <AvatarFallback>{conversation.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{conversation.user.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {conversation.user.gender}, {conversation.user.age} yaşında
                </p>
                <p className="text-sm text-muted-foreground">{conversation.user.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversation Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Konuşma İstatistikleri</CardTitle>
            <CardDescription>Konuşma durumu ve metrikleri</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Durum:</span>
                <Badge variant="success">Aktif</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Mesaj Sayısı:</span>
                <span>{conversation.messageCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Başlangıç:</span>
                <span>{conversation.startedAt}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Son Mesaj:</span>
                <span>{conversation.lastMessageAt}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Kullanıcı Yanıtları:</span>
                <span>
                  {userRepliesCount}/5 {canEscalate && "✓"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversation Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Mesajlar</CardTitle>
          <CardDescription>Konuşma geçmişi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[500px] overflow-y-auto p-2">
            {conversation.messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "bot" ? "justify-start" : "justify-end"}`}>
                {message.sender === "bot" && (
                  <Avatar className="h-8 w-8 mr-2 mt-1">
                    <AvatarImage src={conversation.bot.avatar || "/placeholder.svg"} alt={conversation.bot.name} />
                    <AvatarFallback>{conversation.bot.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === "bot"
                      ? message.content.startsWith("Sistem Mesajı")
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        : "bg-[#2b2c46] text-white"
                      : "bg-[#404157] text-white"
                  }`}
                >
                  {message.content.startsWith("Sistem Mesajı") && (
                    <div className="flex items-center mb-1">
                      <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                      <span className="font-medium text-xs">Sistem Mesajı</span>
                    </div>
                  )}
                  <p className="text-sm">
                    {message.content.startsWith("Sistem Mesajı")
                      ? message.content.replace("Sistem Mesajı: ", "")
                      : message.content}
                  </p>
                  <p className="text-xs mt-1 opacity-70 text-right">{message.timestamp}</p>
                </div>

                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 ml-2 mt-1">
                    <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} alt={conversation.user.name} />
                    <AvatarFallback>{conversation.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>

          {canEscalate && (
            <div className="mt-6 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-pink-500" />
                <p className="text-sm font-medium text-pink-700 dark:text-pink-300">
                  Bu konuşma canlı sohbete yükseltilebilir
                </p>
              </div>
              <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">
                Kullanıcı 5 veya daha fazla yanıt gönderdi. Bu konuşmayı canlı sohbete yükseltebilirsiniz.
              </p>
              <Button
                className="mt-3 bg-gradient-to-r from-pink-600 to-red-500 w-full"
                onClick={handleEscalateConversation}
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Canlı Sohbete Yükselt
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
