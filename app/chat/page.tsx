import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
  title: "Sohbet | Flortapp Admin",
  description: "Kullanıcı sohbetlerini yönetin",
}

export default function ChatPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Sohbet</h1>
      
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Aktif</TabsTrigger>
          <TabsTrigger value="archived">Arşivlenmiş</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Aktif Sohbetler</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Henüz aktif sohbet bulunmuyor.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="archived">
          <Card>
            <CardHeader>
              <CardTitle>Arşivlenmiş Sohbetler</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Henüz arşivlenmiş sohbet bulunmuyor.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 