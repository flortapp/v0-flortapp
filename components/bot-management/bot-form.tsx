"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, InfoIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { allInterests } from "@/services/api-mock" // allInterests'i import ediyoruz

interface BotFormProps {
  editMode?: boolean
  botData?: any
}

// Sabit ilgi alanları listesini kaldırıp, api-mock'tan gelen listeyi kullanıyoruz
// const INTERESTS = ["Seyahat", "Yemek", "Yürüyüş", "Yoga", "Oyunlar", "Filmler", "Kitaplar", "Hayvanlar", "Şarap"]

// İlişki hedefleri
const RELATIONSHIP_GOALS = [
  { value: "flört", label: "Flört" },
  { value: "friendship", label: "Arkadaşlık" },
  { value: "casual", label: "Günlük" },
  { value: "serious", label: "Ciddi İlişki" },
]

// Mock data for existing profile pictures
const existingProfilePictures = [
  "/abstract-geometric-shapes.png?height=200&width=200&query=female avatar",
  "/mystical-forest-spirit.png",
  "/robot-avatar.png",
]

export function BotForm({ editMode = false, botData }: BotFormProps) {
  const { toast } = useToast()
  const router = useRouter()

  // Form verisi
  const [formData, setFormData] = useState({
    id: botData?.id || `bot-${Date.now()}`,
    name: botData?.name || "",
    age: botData?.age || 28,
    location: botData?.location || "İstanbul",
    interests: botData?.interests || [],
    bio: botData?.bio || "Merhaba! Ben yeni insanlarla tanışmayı ve sohbet etmeyi seven biriyim.",
    avatar: botData?.avatar || "/abstract-geometric-shapes.png?height=200&width=200&query=female avatar",
    isVerified: botData?.isVerified || true,
    isActive: botData?.isActive || true,
    relationshipGoal: botData?.relationshipGoal || "flört",
  })

  // Avatar doğrulama durumu
  const [isCheckingImage, setIsCheckingImage] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [isImageValid, setIsImageValid] = useState(true)
  const [originalAvatar, setOriginalAvatar] = useState(botData?.avatar || "")

  // Check if the image is a duplicate
  const checkDuplicateImage = async (imageUrl: string) => {
    // Skip validation if we're in edit mode and the image hasn't changed
    if (editMode && imageUrl === originalAvatar) {
      setIsImageValid(true)
      setImageError(null)
      return true
    }

    setIsCheckingImage(true)
    setImageError(null)

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if the image URL exists in our mock data
      const isDuplicate = existingProfilePictures.some((url) => url === imageUrl && url !== originalAvatar)

      if (isDuplicate) {
        setImageError("Bu profil fotoğrafı başka bir bot tarafından kullanılıyor. Lütfen farklı bir fotoğraf seçin.")
        setIsImageValid(false)
        return false
      } else {
        setIsImageValid(true)
        return true
      }
    } catch (error) {
      setImageError("Fotoğraf kontrolü sırasında bir hata oluştu. Lütfen tekrar deneyin.")
      setIsImageValid(false)
      return false
    } finally {
      setIsCheckingImage(false)
    }
  }

  // Validate image when avatar URL changes
  useEffect(() => {
    // Don't check empty URLs
    if (!formData.avatar) return

    // Debounce the check to avoid too many calls while typing
    const timer = setTimeout(() => {
      checkDuplicateImage(formData.avatar)
    }, 500)

    return () => clearTimeout(timer)
  }, [formData.avatar])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const currentInterests = [...prev.interests]

      if (currentInterests.includes(interest)) {
        // İlgi alanı zaten seçiliyse, kaldır
        return {
          ...prev,
          interests: currentInterests.filter((i) => i !== interest),
        }
      } else {
        // İlgi alanı seçili değilse, ekle
        return {
          ...prev,
          interests: [...currentInterests, interest],
        }
      }
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Simulate image upload and get URL
    setIsCheckingImage(true)

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would upload the file to a server and get back a URL
      // For this example, we'll just use a placeholder URL
      const uploadedImageUrl = `/placeholder.svg?height=200&width=200&query=${file.name.replace(/\.[^/.]+$/, "")}`

      // Check if the image is a duplicate
      const isValid = await checkDuplicateImage(uploadedImageUrl)

      if (isValid) {
        handleInputChange("avatar", uploadedImageUrl)
        toast({
          title: "Fotoğraf yüklendi",
          description: "Profil fotoğrafı başarıyla yüklendi.",
          variant: "success",
        })
      }
    } catch (error) {
      toast({
        title: "Yükleme hatası",
        description: "Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // İlgi alanları seçilmiş mi kontrol et
    if (formData.interests.length === 0) {
      toast({
        title: "İlgi Alanı Hatası",
        description: "Lütfen en az bir ilgi alanı seçin.",
        variant: "destructive",
      })
      return
    }

    // Validate image before submission
    const isValid = await checkDuplicateImage(formData.avatar)

    if (!isValid) {
      toast({
        title: "Profil fotoğrafı hatası",
        description: imageError,
        variant: "destructive",
      })
      return
    }

    toast({
      title: editMode ? "Bot Güncellendi" : "Bot Oluşturuldu",
      description: editMode
        ? `${formData.name} botu başarıyla güncellendi.`
        : `${formData.name} botu başarıyla oluşturuldu.`,
      variant: "success",
    })

    router.push("/bot-management")
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{editMode ? "Bot Düzenle" : "Yeni Bot Oluştur"}</h1>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              İptal
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-pink-600 to-red-500"
              disabled={!isImageValid || isCheckingImage}
            >
              {isCheckingImage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kontrol Ediliyor...
                </>
              ) : editMode ? (
                "Güncelle"
              ) : (
                "Oluştur"
              )}
            </Button>
          </div>
        </div>

        {/* Bilgilendirme mesajı */}
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Bot mesaj şablonları ve otomasyon ayarları artık <strong>Ayarlar &gt; Bot Otomasyonu</strong> bölümünden
            yönetilmektedir. Burada sadece botun temel profil bilgilerini ayarlayabilirsiniz.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Temel Bilgiler</CardTitle>
                <CardDescription>Botun profil bilgilerini düzenleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">İsim</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Yaş</Label>
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      max="65"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", Number.parseInt(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Konum</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationshipGoal">İlişki Hedefi</Label>
                    <Select
                      value={formData.relationshipGoal}
                      onValueChange={(value) => handleInputChange("relationshipGoal", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="İlişki hedefi seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATIONSHIP_GOALS.map((goal) => (
                          <SelectItem key={goal.value} value={goal.value}>
                            {goal.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biyografi</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    required
                  />
                </div>

                {/* İlgi alanları bölümünü güncelleyelim */}
                <div className="space-y-2">
                  <Label className="block mb-2">İlgi Alanları (En az bir tane seçin)</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allInterests.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={`interest-${interest}`}
                          checked={formData.interests.includes(interest)}
                          onCheckedChange={() => handleInterestToggle(interest)}
                        />
                        <label
                          htmlFor={`interest-${interest}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {interest}
                        </label>
                      </div>
                    ))}
                  </div>
                  {formData.interests.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">Lütfen en az bir ilgi alanı seçin</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Profil Fotoğrafı</CardTitle>
                <CardDescription>Botun görünümünü düzenleyin</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-40 w-40">
                    <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={formData.name} />
                    <AvatarFallback>{formData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {isCheckingImage && (
                    <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                      <Loader2 className="h-10 w-10 animate-spin text-white" />
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                    disabled={isCheckingImage}
                  >
                    {isCheckingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Yükleniyor...
                      </>
                    ) : (
                      "Fotoğraf Yükle"
                    )}
                  </Button>
                </div>

                <div className="w-full space-y-2">
                  <Label htmlFor="avatar-url" className={imageError ? "text-red-500" : ""}>
                    Fotoğraf URL
                  </Label>
                  <div className="relative">
                    <Input
                      id="avatar-url"
                      value={formData.avatar}
                      onChange={(e) => handleInputChange("avatar", e.target.value)}
                      className={imageError ? "border-red-500 pr-10" : ""}
                    />
                    {isCheckingImage && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  {imageError && <p className="text-xs text-red-500 mt-1">{imageError}</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </form>
  )
}
