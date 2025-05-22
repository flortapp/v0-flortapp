"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export function CreateBotContent() {
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Form işleme mantığı burada olacak

    // Başarılı toast mesajı
    toast({
      title: "Bot Oluşturuldu",
      description: "Sahte bot kullanıcısı başarıyla oluşturuldu.",
      variant: "success",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sahte Bot Oluşturma</h1>
        <p className="text-muted-foreground">Bu botlar uygulama kullanıcılarıyla etkileşime girecektir</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sahte Bot Kullanıcı</CardTitle>
          <CardDescription>
            Uygulama kullanıcılarıyla etkileşime girecek yeni bir sahte bot kullanıcısı oluşturun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="userCount">Kullanıcı Sayısı</Label>
                <Input id="userCount" type="number" min="1" defaultValue="1" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Ülke</Label>
                <Select defaultValue="turkey">
                  <SelectTrigger>
                    <SelectValue placeholder="Ülke seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="turkey">Türkiye</SelectItem>
                    <SelectItem value="usa">Amerika Birleşik Devletleri</SelectItem>
                    <SelectItem value="uk">Birleşik Krallık</SelectItem>
                    <SelectItem value="germany">Almanya</SelectItem>
                    <SelectItem value="france">Fransa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Cinsiyet</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Cinsiyet seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Hepsi</SelectItem>
                    <SelectItem value="male">Erkek</SelectItem>
                    <SelectItem value="female">Kadın</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Dil</Label>
                <Select defaultValue="turkish">
                  <SelectTrigger>
                    <SelectValue placeholder="Dil seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="turkish">Türkçe</SelectItem>
                    <SelectItem value="english">İngilizce</SelectItem>
                    <SelectItem value="german">Almanca</SelectItem>
                    <SelectItem value="french">Fransızca</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultPassword">Varsayılan Şifre</Label>
                <Input id="defaultPassword" defaultValue="pass241221" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ageFrom">Yaşından İtibaren</Label>
                  <Input id="ageFrom" type="number" min="18" max="80" defaultValue="18" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ageTo">Yaşa kadar</Label>
                  <Input id="ageTo" type="number" min="18" max="80" defaultValue="45" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="mb-2 block">Seçenekler</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="withPhoto" />
                    <label
                      htmlFor="withPhoto"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Fotoğraflı
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="withBio" />
                    <label
                      htmlFor="withBio"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Biyografi ile
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="verified" />
                    <label
                      htmlFor="verified"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Doğrulanmış
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto">
              Oluştur
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
