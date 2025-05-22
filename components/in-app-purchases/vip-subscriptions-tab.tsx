"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Crown, Edit, Trash2, Plus, Smartphone, Apple } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// VIP Abonelik tipi
interface VipSubscription {
  id: string
  name: string
  price: {
    ios: string
    android: string
  }
  productId: {
    ios: string
    android: string
  }
  duration: string
  durationCode: "weekly" | "monthly" | "quarterly" | "biannual" | "annual"
  features: string[]
  sortOrder: number
  status: "active" | "inactive"
}

export function VipSubscriptionsTab() {
  // State tanımlamaları
  const [subscriptionPlans, setSubscriptionPlans] = useState<VipSubscription[]>([
    {
      id: "monthly_vip",
      name: "Vip Aylık",
      price: {
        ios: "49.99",
        android: "49.99",
      },
      productId: {
        ios: "com.dateapp.vip.monthly",
        android: "com.dateapp.vip.monthly",
      },
      duration: "1 ay",
      durationCode: "monthly",
      features: ["Sınırsız mesajlaşma", "Profil vurgulama", "Görünmez mod"],
      sortOrder: 1,
      status: "active",
    },
    {
      id: "quarterly_vip",
      name: "Vip 3 Aylık",
      price: {
        ios: "129.99",
        android: "129.99",
      },
      productId: {
        ios: "com.dateapp.vip.quarterly",
        android: "com.dateapp.vip.quarterly",
      },
      duration: "3 ay",
      durationCode: "quarterly",
      features: ["Sınırsız mesajlaşma", "Profil vurgulama", "Görünmez mod", "Özel rozetler"],
      sortOrder: 2,
      status: "active",
    },
    {
      id: "annual_vip",
      name: "Vip Yıllık",
      price: {
        ios: "399.99",
        android: "399.99",
      },
      productId: {
        ios: "com.dateapp.vip.annual",
        android: "com.dateapp.vip.annual",
      },
      duration: "1 yıl",
      durationCode: "annual",
      features: ["Sınırsız mesajlaşma", "Profil vurgulama", "Görünmez mod", "Özel rozetler", "Öncelikli destek"],
      sortOrder: 3,
      status: "active",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<VipSubscription | null>(null)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  // Yeni plan için boş şablon
  const emptyPlan: VipSubscription = {
    id: "",
    name: "",
    price: {
      ios: "",
      android: "",
    },
    productId: {
      ios: "",
      android: "",
    },
    duration: "",
    durationCode: "monthly",
    features: [""],
    sortOrder: 0,
    status: "active",
  }

  // Form state'i
  const [formData, setFormData] = useState<VipSubscription>(emptyPlan)

  // Yeni plan ekleme fonksiyonu
  const handleAddPlan = () => {
    // Mevcut en yüksek sıra numarasını bul ve bir artır
    const maxOrder = Math.max(...subscriptionPlans.map((plan) => plan.sortOrder), 0)
    setFormData({ ...emptyPlan, sortOrder: maxOrder + 1 })
    setCurrentPlan(null)
    setIsDialogOpen(true)
  }

  // Plan düzenleme fonksiyonu
  const handleEditPlan = (plan: VipSubscription) => {
    setFormData({ ...plan })
    setCurrentPlan(plan)
    setIsDialogOpen(true)
  }

  // Plan silme fonksiyonu
  const handleDeletePlan = (planId: string) => {
    // UI'dan planı kaldır
    setSubscriptionPlans(subscriptionPlans.filter((plan) => plan.id !== planId))
  }

  // Form input değişikliği
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Fiyat değişikliği
  const handlePriceChange = (platform: "ios" | "android", value: string) => {
    setFormData((prev) => ({
      ...prev,
      price: { ...prev.price, [platform]: value },
    }))
  }

  // Product ID değişikliği
  const handleProductIdChange = (platform: "ios" | "android", value: string) => {
    setFormData((prev) => ({
      ...prev,
      productId: { ...prev.productId, [platform]: value },
    }))
  }

  // Özellik değişikliği
  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData((prev) => ({ ...prev, features: newFeatures }))
  }

  // Yeni özellik ekleme
  const handleAddFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }))
  }

  // Özellik silme
  const handleRemoveFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, features: newFeatures }))
  }

  // Süre kodu değişikliği
  const handleDurationCodeChange = (value: string) => {
    const durationMap: Record<string, string> = {
      weekly: "1 hafta",
      monthly: "1 ay",
      quarterly: "3 ay",
      biannual: "6 ay",
      annual: "1 yıl",
    }

    setFormData((prev) => ({
      ...prev,
      durationCode: value as any,
      duration: durationMap[value] || "",
    }))
  }

  // Form gönderme işlemi
  const handleSubmitPlan = () => {
    setIsLoading(true)

    // Sıra numarası kontrolü
    const isDuplicateOrder = currentPlan
      ? subscriptionPlans.some((p) => p.id !== currentPlan.id && p.sortOrder === formData.sortOrder)
      : subscriptionPlans.some((p) => p.sortOrder === formData.sortOrder)

    if (isDuplicateOrder) {
      // Sıra numarası çakışması varsa, en yüksek sıra + 1 olarak ayarla
      const maxOrder = Math.max(...subscriptionPlans.map((plan) => plan.sortOrder), 0)
      setFormData((prev) => ({ ...prev, sortOrder: maxOrder + 1 }))
    }

    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setIsLoading(false)

      if (currentPlan) {
        // Mevcut planı güncelle
        setSubscriptionPlans((prev) => prev.map((p) => (p.id === currentPlan.id ? formData : p)))
      } else {
        // Yeni plan ekle
        setSubscriptionPlans((prev) => [...prev, formData])
      }

      setIsDialogOpen(false)
    }, 500)
  }

  // Süre seçenekleri
  const durationOptions = [
    { value: "weekly", label: "Haftalık" },
    { value: "monthly", label: "Aylık" },
    { value: "quarterly", label: "3 Aylık" },
    { value: "biannual", label: "6 Aylık" },
    { value: "annual", label: "Yıllık" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">VIP Abonelikler</h2>
        <div className="flex items-center gap-4">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "cards" | "table")}>
            <TabsList>
              <TabsTrigger value="cards">Kart Görünümü</TabsTrigger>
              <TabsTrigger value="table">Tablo Görünümü</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleAddPlan} className="flex items-center gap-2">
            <Plus size={16} />
            Yeni Plan Ekle
          </Button>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant={plan.status === "active" ? "default" : "secondary"} className="mb-2">
                      {plan.status === "active" ? "Aktif" : "Pasif"}
                    </Badge>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-purple-500" />
                      {plan.name}
                    </CardTitle>
                  </div>
                  <Badge variant="outline">Sıra: {plan.sortOrder}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between items-center mb-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Süre</div>
                    <div className="font-medium">{plan.duration}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                      <Apple size={14} /> iOS
                    </div>
                    <div className="text-xl font-bold">{plan.price.ios} ₺</div>
                    <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground mt-1">
                      <Smartphone size={14} /> Android
                    </div>
                    <div className="text-xl font-bold">{plan.price.android} ₺</div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Özellikler:</h4>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <span className="mr-2 text-green-500">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-2 border-t text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 mb-1">
                    <Apple size={12} /> {plan.productId.ios}
                  </div>
                  <div className="flex items-center gap-1">
                    <Smartphone size={12} /> {plan.productId.android}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan)}>
                  <Edit className="h-4 w-4 mr-1" /> Düzenle
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeletePlan(plan.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Sil
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Sıra</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Plan Adı</TableHead>
                <TableHead>Süre</TableHead>
                <TableHead>iOS Fiyat</TableHead>
                <TableHead>Android Fiyat</TableHead>
                <TableHead>Özellikler</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptionPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.sortOrder}</TableCell>
                  <TableCell>
                    <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                      {plan.status === "active" ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-purple-500" />
                      {plan.name}
                    </div>
                  </TableCell>
                  <TableCell>{plan.duration}</TableCell>
                  <TableCell>{plan.price.ios} ₺</TableCell>
                  <TableCell>{plan.price.android} ₺</TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate">{plan.features.join(", ")}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditPlan(plan)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeletePlan(plan.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Plan Ekleme/Düzenleme Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentPlan ? `${currentPlan.name} Planını Düzenle` : "Yeni VIP Abonelik Planı Ekle"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">Plan ID</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => handleInputChange("id", e.target.value)}
                  placeholder="monthly_vip"
                />
                <p className="text-xs text-muted-foreground">Benzersiz tanımlayıcı (örn: monthly_vip)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Plan Adı</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Vip Aylık"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sıra Numarası</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => handleInputChange("sortOrder", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Planların görüntülenme sırası</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Süre</Label>
                <Select value={formData.durationCode} onValueChange={handleDurationCodeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Süre seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Durum</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
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
                <Label>iOS Ayarları</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="ios-price" className="text-xs">
                      Fiyat (₺)
                    </Label>
                    <Input
                      id="ios-price"
                      value={formData.price.ios}
                      onChange={(e) => handlePriceChange("ios", e.target.value)}
                      placeholder="49.99"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ios-product-id" className="text-xs">
                      Product ID
                    </Label>
                    <Input
                      id="ios-product-id"
                      value={formData.productId.ios}
                      onChange={(e) => handleProductIdChange("ios", e.target.value)}
                      placeholder="com.app.vip.monthly"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Android Ayarları</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="android-price" className="text-xs">
                      Fiyat (₺)
                    </Label>
                    <Input
                      id="android-price"
                      value={formData.price.android}
                      onChange={(e) => handlePriceChange("android", e.target.value)}
                      placeholder="49.99"
                    />
                  </div>
                  <div>
                    <Label htmlFor="android-product-id" className="text-xs">
                      Product ID
                    </Label>
                    <Input
                      id="android-product-id"
                      value={formData.productId.android}
                      onChange={(e) => handleProductIdChange("android", e.target.value)}
                      placeholder="com.app.vip.monthly"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Özellikler</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddFeature}>
                    <Plus className="h-4 w-4 mr-1" /> Ekle
                  </Button>
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder="Özellik açıklaması"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFeature(index)}
                        disabled={formData.features.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSubmitPlan} disabled={isLoading}>
              {isLoading ? "İşleniyor..." : currentPlan ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
