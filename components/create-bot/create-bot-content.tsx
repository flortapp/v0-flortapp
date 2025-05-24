"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Upload } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { mockApi } from "@/services/api-mock"

export function CreateBotContent() {
  const { toast } = useToast()
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isCheckingPhoto, setIsCheckingPhoto] = useState(false)

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

    setIsCheckingPhoto(true)

    try {
      // Resmi önizle
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string

        // Fotoğrafın eşsizliğini kontrol et
        const response = await mockApi.bots.checkPhotoUniqueness(base64Image)
        
        if (!response.isUnique) {
          toast({
            title: "Hata",
            description: "Bu fotoğraf daha önce kullanılmış. Lütfen başka bir fotoğraf seçin.",
            variant: "destructive",
          })
          setPhoto(null)
          setPhotoPreview(null)
          return
        }

        setPhotoPreview(base64Image)
        setPhoto(file)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast({
        title: "Hata",
        description: "Fotoğraf kontrolü sırasında bir hata oluştu.",
        variant: "destructive",
      })
      setPhoto(null)
      setPhotoPreview(null)
    } finally {
      setIsCheckingPhoto(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      // Form verilerini al
      const formData = new FormData(e.target as HTMLFormElement)
      const userCount = formData.get("userCount")
      const language = formData.get("language")
      const bio = formData.get("bio")

      // Fotoğraf kontrolü
      if (!photo) {
        toast({
          title: "Hata",
          description: "Lütfen bir fotoğraf yükleyin.",
          variant: "destructive",
        })
        return
      }

      // Biyografi kontrolü
      if (!bio) {
        toast({
          title: "Hata",
          description: "Lütfen bir biyografi girin.",
          variant: "destructive",
        })
        return
      }

      // API çağrısı burada yapılacak
      // const response = await mockApi.bots.create({
      //   userCount,
      //   language,
      //   photo,
      //   bio,
      //   country: "turkey", // Sabit değer
      //   gender: "female", // Sabit değer
      //   verified: true, // Sabit değer
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

              <div className="space-y-2">
                <Label htmlFor="photo">Fotoğraf</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={photoPreview || undefined} />
                    <AvatarFallback>
                      {isCheckingPhoto ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      ) : (
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="cursor-pointer"
                      disabled={isCheckingPhoto}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maksimum dosya boyutu: 5MB. Desteklenen formatlar: JPG, PNG, GIF
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Biyografi</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Bot için biyografi girin..."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto" disabled={isUploading || isCheckingPhoto}>
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
