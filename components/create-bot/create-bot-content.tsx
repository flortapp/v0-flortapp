"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Upload } from "lucide-react"

export function CreateBotContent() {
  const { toast } = useToast()
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Dosya tipini kontrol et
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir resim dosyası seçin.",
        variant: "destructive",
      })
      return
    }

    // Dosya boyutunu kontrol et (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Hata",
        description: "Resim dosyası 5MB'dan küçük olmalıdır.",
        variant: "destructive",
      })
      return
    }

    // Resmi önizle
    const reader = new FileReader()
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    setPhoto(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      // Form verilerini al
      const formData = new FormData(e.target as HTMLFormElement)
      const userCount = formData.get("userCount")
      const country = formData.get("country")
      const gender = formData.get("gender")
      const language = formData.get("language")
      const ageFrom = formData.get("ageFrom")
      const ageTo = formData.get("ageTo")
      const withPhoto = formData.get("withPhoto") === "on"
      const withBio = formData.get("withBio") === "on"
      const verified = formData.get("verified") === "on"

      // Fotoğraf kontrolü
      if (withPhoto && !photo) {
        toast({
          title: "Hata",
          description: "Lütfen bir fotoğraf yükleyin.",
          variant: "destructive",
        })
        return
      }

      // API çağrısı burada yapılacak
      // const response = await mockApi.bots.create({
      //   userCount,
      //   country,
      //   gender,
      //   language,
      //   ageFrom,
      //   ageTo,
      //   withPhoto,
      //   withBio,
      //   verified,
      //   photo,
      // })

      // Başarılı toast mesajı
      toast({
        title: "Bot Oluşturuldu",
        description: "Sahte bot kullanıcısı başarıyla oluşturuldu.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Bot oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
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
                <Input id="userCount" name="userCount" type="number" min="1" defaultValue="1" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Ülke</Label>
                <Select name="country" defaultValue="turkey">
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
                <Select name="gender" defaultValue="all">
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
                <Select name="language" defaultValue="turkish">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ageFrom">Yaşından İtibaren</Label>
                  <Input id="ageFrom" name="ageFrom" type="number" min="18" max="80" defaultValue="18" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ageTo">Yaşa kadar</Label>
                  <Input id="ageTo" name="ageTo" type="number" min="18" max="80" defaultValue="45" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="mb-2 block">Seçenekler</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="withPhoto" name="withPhoto" />
                    <label
                      htmlFor="withPhoto"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Fotoğraflı
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="withBio" name="withBio" />
                    <label
                      htmlFor="withBio"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Biyografi ile
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="verified" name="verified" />
                    <label
                      htmlFor="verified"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Doğrulanmış
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Fotoğraf</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={photoPreview || undefined} />
                    <AvatarFallback>
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maksimum dosya boyutu: 5MB. Desteklenen formatlar: JPG, PNG, GIF
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                "Oluştur"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
