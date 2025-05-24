"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function BulkMessageContent() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Toplu Mesaj</h1>
      
      <Tabs defaultValue="new" className="space-y-4">
        <TabsList>
          <TabsTrigger value="new">Yeni Mesaj</TabsTrigger>
          <TabsTrigger value="history">Geçmiş</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Yeni Toplu Mesaj</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Toplu mesaj gönderme özelliği yakında eklenecek.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Gönderilen Mesajlar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Henüz gönderilmiş mesaj bulunmuyor.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 