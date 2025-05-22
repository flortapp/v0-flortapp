import { AdminLayout } from "@/components/layout/admin-layout"
import { BotConversationsList } from "@/components/bot-management/bot-conversations-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BotConversationsPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bot Konuşmaları</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Konuşma Listesi</CardTitle>
            <CardDescription>Bot tarafından başlatılan tüm konuşmaları görüntüleyin</CardDescription>
          </CardHeader>
          <CardContent>
            <BotConversationsList botId={params.id} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
