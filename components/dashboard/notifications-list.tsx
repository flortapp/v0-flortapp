import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export function NotificationsList() {
  const notifications = [
    {
      id: "1",
      title: "Yeni Kullanıcı Kaydı",
      description: "Mehmet Yılmaz uygulamaya kaydoldu",
      time: "5 dakika önce",
      type: "user",
      read: false,
    },
    {
      id: "2",
      title: "Premium Abonelik",
      description: "Ayşe Demir premium abonelik satın aldı",
      time: "30 dakika önce",
      type: "payment",
      read: false,
    },
    {
      id: "3",
      title: "Sistem Güncellemesi",
      description: "Sistem bakımı tamamlandı, yeni özellikler aktif",
      time: "2 saat önce",
      type: "system",
      read: true,
    },
    {
      id: "4",
      title: "Bildirim Gönderildi",
      description: "Toplu bildirim tüm kullanıcılara gönderildi",
      time: "5 saat önce",
      type: "notification",
      read: true,
    },
    {
      id: "5",
      title: "Yeni Bot Oluşturuldu",
      description: "Yeni bot başarıyla oluşturuldu ve aktif edildi",
      time: "1 gün önce",
      type: "bot",
      read: true,
    },
  ]

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4 pr-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start space-x-4 rounded-md p-3 transition-colors ${
              notification.read ? "" : "bg-muted/50"
            }`}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={`/abstract-geometric-shapes.png?height=36&width=36&query=${notification.type}`} alt="" />
              <AvatarFallback>
                {notification.type === "user"
                  ? "U"
                  : notification.type === "payment"
                    ? "P"
                    : notification.type === "system"
                      ? "S"
                      : notification.type === "notification"
                        ? "N"
                        : "B"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{notification.title}</p>
                {!notification.read && <Badge variant="outline">Yeni</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">{notification.description}</p>
              <p className="text-xs text-muted-foreground">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
