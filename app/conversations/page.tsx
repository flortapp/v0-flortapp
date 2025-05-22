import { AdminLayout } from "@/components/layout/admin-layout"
import { BotConversationsList } from "@/components/bot-management/bot-conversations-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ConversationsPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tüm Konuşmalar</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Konuşma Listesi</CardTitle>
            <CardDescription>Tüm botlar tarafından başlatılan konuşmaları görüntüleyin</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Tüm Konuşmalar</TabsTrigger>
                <TabsTrigger value="active">Aktif</TabsTrigger>
                <TabsTrigger value="escalated">Yükseltilmiş</TabsTrigger>
                <TabsTrigger value="inactive">Pasif</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <BotConversationsList filter="all" />
              </TabsContent>
              <TabsContent value="active">
                <BotConversationsList filter="active" />
              </TabsContent>
              <TabsContent value="escalated">
                <BotConversationsList filter="escalated" />
              </TabsContent>
              <TabsContent value="inactive">
                <BotConversationsList filter="inactive" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
