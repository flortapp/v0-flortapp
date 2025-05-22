"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Gift, Plus, Search, SlidersHorizontal, Coins, Check, Apple, Smartphone } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Gift tipi
interface GiftItem {
  id: string
  title: string
  description: string
  tokenCost: number
  imageUrl: string
  productId: {
    ios: string
    android: string
  }
  price: {
    ios: number
    android: number
  }
  status: "active" | "inactive"
  sortOrder: number
}

export function GiftsTab() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("sortOrder")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentGift, setCurrentGift] = useState<GiftItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for gifts
  const [gifts, setGifts] = useState<GiftItem[]>([
    {
      id: "gift_rose",
      title: "Gül",
      description: "Romantik bir gül hediye edin",
      tokenCost: 10,
      imageUrl: "/colorful-gift-box.png",
      productId: {
        ios: "com.dateapp.gift.rose",
        android: "com.dateapp.gift.rose",
      },
      price: {
        ios: 0,
        android: 0,
      },
      status: "active",
      sortOrder: 1,
    },
    {
      id: "gift_chocolate",
      title: "Çikolata",
      description: "Tatlı bir çikolata hediye edin",
      tokenCost: 15,
      imageUrl: "/colorful-gift-box.png",
      productId: {
        ios: "com.dateapp.gift.chocolate",
        android: "com.dateapp.gift.chocolate",
      },
      price: {
        ios: 0,
        android: 0,
      },
      status: "active",
      sortOrder: 2,
    },
    {
      id: "gift_teddy_bear",
      title: "Ayıcık",
      description: "Sevimli bir ayıcık hediye edin",
      tokenCost: 25,
      imageUrl: "/colorful-gift-box.png",
      productId: {
        ios: "com.dateapp.gift.teddy",
        android: "com.dateapp.gift.teddy",
      },
      price: {
        ios: 0,
        android: 0,
      },
      status: "active",
      sortOrder: 3,
    },
    {
      id: "gift_diamond",
      title: "Elmas",
      description: "Değerli bir elmas hediye edin",
      tokenCost: 100,
      imageUrl: "/brilliant-cut-diamond.png",
      productId: {
        ios: "com.dateapp.gift.diamond",
        android: "com.dateapp.gift.diamond",
      },
      price: {
        ios: 0,
        android: 0,
      },
      status: "active",
      sortOrder: 4,
    },
    {
      id: "gift_treasure_chest",
      title: "Hazine Sandığı",
      description: "Gizemli bir hazine sandığı hediye edin",
      tokenCost: 50,
      imageUrl: "/weathered-treasure-chest.png",
      productId: {
        ios: "com.dateapp.gift.treasure",
        android: "com.dateapp.gift.treasure",
      },
      price: {
        ios: 0,
        android: 0,
      },
      status: "active",
      sortOrder: 5,
    },
    {
      id: "gift_heart",
      title: "Kalp",
      description: "Romantik bir kalp hediye edin",
      tokenCost: 20,
      imageUrl: "/colorful-gift-box.png",
      productId: {
        ios: "com.dateapp.gift.heart",
        android: "com.dateapp.gift.heart",
      },
      price: {
        ios: 0,
        android: 0,
      },
      status: "active",
      sortOrder: 6,
    },
    {
      id: "gift_champagne",
      title: "Şampanya",
      description: "Kutlama için şampanya hediye edin",
      tokenCost: 35,
      imageUrl: "/colorful-gift-box.png",
      productId: {
        ios: "com.dateapp.gift.champagne",
        android: "com.dateapp.gift.champagne",
      },
      price: {
        ios: 0,
        android: 0,
      },
      status: "active",
      sortOrder: 7,
    },
  ])

  // Form state
  const [formData, setFormData] = useState<GiftItem>({
    id: "",
    title: "",
    description: "",
    tokenCost: 0,
    imageUrl: "/colorful-gift-box.png",
    productId: {
      ios: "",
      android: "",
    },
    price: {
      ios: 0,
      android: 0,
    },
    status: "active",
    sortOrder: 0,
  })

  // Filter and sort gifts
  const filteredGifts = gifts
    .filter((gift) => {
      const matchesSearch =
        gift.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gift.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gift.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || gift.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "tokenCost":
          comparison = a.tokenCost - b.tokenCost
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "sortOrder":
          comparison = a.sortOrder - b.sortOrder
          break
        default:
          comparison = a.sortOrder - b.sortOrder
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <Check className="mr-1 h-3 w-3" />
            Aktif
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-500">
            Pasif
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Yeni hediye ekleme
  const handleAddGift = () => {
    // Mevcut en yüksek sıra numarasını bul ve bir artır
    const maxOrder = Math.max(...gifts.map((gift) => gift.sortOrder), 0)
    setFormData({
      id: "",
      title: "",
      description: "",
      tokenCost: 0,
      imageUrl: "/colorful-gift-box.png",
      productId: {
        ios: "",
        android: "",
      },
      price: {
        ios: 0,
        android: 0,
      },
      status: "active",
      sortOrder: maxOrder + 1,
    })
    setCurrentGift(null)
    setIsDialogOpen(true)
  }

  // Hediye düzenleme
  const handleEditGift = (gift: GiftItem) => {
    setFormData({ ...gift })
    setCurrentGift(gift)
    setIsDialogOpen(true)
  }

  // Hediye silme
  const handleDeleteGift = (giftId: string) => {
    setGifts(gifts.filter((gift) => gift.id !== giftId))
  }

  // Form input değişikliği
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Product ID değişikliği
  const handleProductIdChange = (platform: "ios" | "android", value: string) => {
    setFormData((prev) => ({
      ...prev,
      productId: { ...prev.productId, [platform]: value },
    }))
  }

  // Price değişikliği
  const handlePriceChange = (platform: "ios" | "android", value: number) => {
    setFormData((prev) => ({
      ...prev,
      price: { ...prev.price, [platform]: value },
    }))
  }

  // Form gönderme işlemi
  const handleSubmitGift = () => {
    setIsLoading(true)

    // Sıra numarası kontrolü
    const isDuplicateOrder = currentGift
      ? gifts.some((g) => g.id !== currentGift.id && g.sortOrder === formData.sortOrder)
      : gifts.some((g) => g.sortOrder === formData.sortOrder)

    if (isDuplicateOrder) {
      // Sıra numarası çakışması varsa, en yüksek sıra + 1 olarak ayarla
      const maxOrder = Math.max(...gifts.map((gift) => gift.sortOrder), 0)
      setFormData((prev) => ({ ...prev, sortOrder: maxOrder + 1 }))
    }

    // ID oluştur (yeni hediye için)
    const newFormData = { ...formData }
    if (!currentGift) {
      newFormData.id = `gift_${formData.title.toLowerCase().replace(/\s+/g, "_")}_${Date.now().toString(36)}`
    }

    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setIsLoading(false)

      if (currentGift) {
        // Mevcut hediyeyi güncelle
        setGifts((prev) => prev.map((g) => (g.id === currentGift.id ? newFormData : g)))
      } else {
        // Yeni hediye ekle
        setGifts((prev) => [...prev, newFormData])
      }

      setIsDialogOpen(false)
    }, 500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Hediyeler</h2>
          <p className="text-sm text-muted-foreground">
            Kullanıcıların birbirlerine gönderebileceği jeton bazlı hediyeleri yönetin.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "cards" | "table")}>
            <TabsList>
              <TabsTrigger value="cards">Kart Görünümü</TabsTrigger>
              <TabsTrigger value="table">Tablo Görünümü</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            onClick={handleAddGift}
            className="bg-gradient-to-r from-pink-600 to-red-500 hover:from-pink-700 hover:to-red-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Yeni Hediye Ekle
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Hediyeleri ara..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Pasif</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sıralama" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sortOrder">Sıralama Önceliği</SelectItem>
              <SelectItem value="title">Başlık</SelectItem>
              <SelectItem value="tokenCost">Jeton Maliyeti</SelectItem>
              <SelectItem value="status">Durum</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            title={`Sırala ${sortOrder === "asc" ? "Azalan" : "Artan"}`}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline" className="bg-gray-100">
          <span className="font-semibold mr-1">{filteredGifts.length}</span> hediye
        </Badge>

        {statusFilter !== "all" && (
          <Badge
            variant="outline"
            className={
              statusFilter === "active"
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-gray-100 text-gray-800 border-gray-200"
            }
          >
            {statusFilter === "active" ? "Aktif" : "Pasif"}
          </Badge>
        )}
      </div>

      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGifts.length === 0 ? (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              Kriterlere uygun hediye bulunamadı.
            </div>
          ) : (
            filteredGifts.map((gift) => (
              <Card key={gift.id} className="overflow-hidden">
                <div className="aspect-square relative bg-gray-100">
                  <Image src={gift.imageUrl || "/placeholder.svg"} alt={gift.title} fill className="object-cover" />
                  <div className="absolute top-2 right-2">{getStatusBadge(gift.status)}</div>
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                      Sıra: {gift.sortOrder}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Gift className="mr-2 h-4 w-4 text-pink-500" />
                      {gift.title}
                    </span>
                    <Badge variant="outline" className="flex items-center bg-amber-50 text-amber-700 border-amber-200">
                      <Coins className="mr-1 h-3 w-3" />
                      {gift.tokenCost}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{gift.description}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 mb-1">
                      <Apple size={12} /> {gift.productId.ios || "Henüz ayarlanmadı"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Smartphone size={12} /> {gift.productId.android || "Henüz ayarlanmadı"}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleEditGift(gift)}>
                    Düzenle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleDeleteGift(gift.id)}
                  >
                    Sil
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Sıra</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Hediye Adı</TableHead>
                <TableHead>Jeton Maliyeti</TableHead>
                <TableHead className="hidden md:table-cell">Açıklama</TableHead>
                <TableHead className="hidden lg:table-cell">Product ID (iOS/Android)</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGifts.map((gift) => (
                <TableRow key={gift.id}>
                  <TableCell className="font-medium">{gift.sortOrder}</TableCell>
                  <TableCell>{getStatusBadge(gift.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-pink-500" />
                      {gift.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center bg-amber-50 text-amber-700 border-amber-200">
                      <Coins className="mr-1 h-3 w-3" />
                      {gift.tokenCost}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="max-w-[200px] truncate">{gift.description}</div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="text-xs">
                      <div className="flex items-center gap-1">
                        <Apple size={12} /> {gift.productId.ios || "—"}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Smartphone size={12} /> {gift.productId.android || "—"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditGift(gift)}>
                        Düzenle
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteGift(gift.id)}
                      >
                        Sil
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Hediye Ekleme/Düzenleme Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentGift ? `${currentGift.title} Hediyesini Düzenle` : "Yeni Hediye Ekle"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Hediye Adı</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Gül"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Romantik bir gül hediye edin"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenCost">Jeton Maliyeti</Label>
                <Input
                  id="tokenCost"
                  type="number"
                  value={formData.tokenCost}
                  onChange={(e) => handleInputChange("tokenCost", Number.parseInt(e.target.value))}
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sıra Numarası</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => handleInputChange("sortOrder", Number.parseInt(e.target.value))}
                  min={1}
                />
                <p className="text-xs text-muted-foreground">Hediyelerin görüntülenme sırası</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Durum</Label>
                <Select value={formData.status} onValueChange={(value: any) => handleInputChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Pasif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Görsel</Label>
                <div className="aspect-square relative bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={formData.imageUrl || "/placeholder.svg"}
                    alt="Hediye görseli"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Görsel değiştirme özelliği yakında eklenecek</p>
              </div>

              <div className="space-y-2">
                <Label>iOS Ayarları</Label>
                <div className="space-y-2">
                  <Label htmlFor="ios-product-id" className="text-xs">
                    Product ID
                  </Label>
                  <Input
                    id="ios-product-id"
                    value={formData.productId.ios}
                    onChange={(e) => handleProductIdChange("ios", e.target.value)}
                    placeholder="com.dateapp.gift.rose"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ios-price" className="text-xs">
                    Fiyat (StoreKit 2 için)
                  </Label>
                  <Input
                    id="ios-price"
                    type="number"
                    value={formData.price.ios}
                    onChange={(e) => handlePriceChange("ios", Number.parseFloat(e.target.value))}
                    placeholder="0"
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Android Ayarları</Label>
                <div className="space-y-2">
                  <Label htmlFor="android-product-id" className="text-xs">
                    Product ID
                  </Label>
                  <Input
                    id="android-product-id"
                    value={formData.productId.android}
                    onChange={(e) => handleProductIdChange("android", e.target.value)}
                    placeholder="com.dateapp.gift.rose"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="android-price" className="text-xs">
                    Fiyat (Google Billing için)
                  </Label>
                  <Input
                    id="android-price"
                    type="number"
                    value={formData.price.android}
                    onChange={(e) => handlePriceChange("android", Number.parseFloat(e.target.value))}
                    placeholder="0"
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSubmitGift} disabled={isLoading}>
              {isLoading ? "İşleniyor..." : currentGift ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
