import { MessageSquare } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4">
        <MessageSquare className="h-8 w-8 text-orange-500" />
      </div>
      <h3 className="text-lg font-medium mb-2">Sohbet Başlatın</h3>
      <p className="text-muted-foreground max-w-md">
        Sohbet başlatmak için sol panelden bir bot ve kullanıcı seçin veya "Yeni Konuşma" butonuna tıklayın.
      </p>
    </div>
  )
}
