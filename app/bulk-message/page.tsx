import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send } from "lucide-react"

export default function BulkMessagePage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Toplu Mesaj</h1>
        <p className="text-muted-foreground">
          Seçili kullanıcı gruplarına toplu mesaj gönderin.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yeni Toplu Mesaj</CardTitle>
          <CardDescription>
            Mesajınızı göndermek istediğiniz kullanıcı grubunu seçin ve mesajınızı yazın.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipients">Alıcılar</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Alıcı grubunu seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kullanıcılar</SelectItem>
                <SelectItem value="vip">VIP Üyeler</SelectItem>
                <SelectItem value="active">Aktif Kullanıcılar</SelectItem>
                <SelectItem value="inactive">Pasif Kullanıcılar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Konu</Label>
            <Input id="subject" placeholder="Mesaj konusu" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mesaj</Label>
            <Textarea
              id="message"
              placeholder="Mesajınızı yazın..."
              className="min-h-[200px]"
            />
          </div>

          <div className="flex justify-end">
            <Button className="bg-gradient-to-r from-orange-600 to-red-500">
              <Send className="mr-2 h-4 w-4" />
              Gönder
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gönderilen Mesajlar</CardTitle>
          <CardDescription>
            Son 30 gün içinde gönderilen toplu mesajların listesi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Send className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>Henüz toplu mesaj gönderilmemiş</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 