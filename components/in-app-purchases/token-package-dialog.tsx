"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Apple, SmartphoneIcon as Android, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { TokenPackage, TokenPackageFormData } from "@/types/in-app-purchase"

interface TokenPackageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: TokenPackage) => void
  title: string
  defaultValues?: TokenPackage
  nextSortOrder?: number
}

export function TokenPackageDialog({
  open,
  onOpenChange,
  onSave,
  title,
  defaultValues,
  nextSortOrder,
}: TokenPackageDialogProps) {
  const [formData, setFormData] = useState<TokenPackageFormData>({
    title: defaultValues?.title || "",
    description: defaultValues?.description || "",
    icon: defaultValues?.icon || "Gift",
    tokenAmount: defaultValues?.tokenAmount || 0,
    type: "token_package",
    productId: {
      ios: defaultValues?.productId?.ios || "",
      android: defaultValues?.productId?.android || "",
    },
    price: {
      ios: defaultValues?.price?.ios || 0,
      android: defaultValues?.price?.android || 0,
    },
    currency: {
      ios: defaultValues?.currency?.ios || "TL",
      android: defaultValues?.currency?.android || "TL",
    },
    status: defaultValues?.status || "active",
    sortOrder: defaultValues?.sortOrder || nextSortOrder || 1,
  })

  // Dialog açıldığında sıralama değerini güncelle (yeni oluşturma için)
  useEffect(() => {
    if (open && !defaultValues && nextSortOrder) {
      setFormData((prev) => ({
        ...prev,
        sortOrder: nextSortOrder,
      }))
    }
  }, [open, defaultValues, nextSortOrder])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: defaultValues?.id || "",
      createdAt: defaultValues?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <form id="token-package-form" onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Temel Bilgiler</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tokenAmount">Jeton Miktarı</Label>
                  <Input
                    id="tokenAmount"
                    type="number"
                    min="1"
                    value={formData.tokenAmount}
                    onChange={(e) => handleChange("tokenAmount", Number.parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">İkon</Label>
                  <Select value={formData.icon} onValueChange={(value) => handleChange("icon", value)}>
                    <SelectTrigger id="icon">
                      <SelectValue placeholder="İkon seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gift">Hediye</SelectItem>
                      <SelectItem value="Package">Paket</SelectItem>
                      <SelectItem value="Gem">Mücevher</SelectItem>
                      <SelectItem value="Diamond">Elmas</SelectItem>
                      <SelectItem value="Coins">Jeton</SelectItem>
                      <SelectItem value="Heart">Kalp</SelectItem>
                      <SelectItem value="Crown">Taç</SelectItem>
                      <SelectItem value="Trophy">Kupa</SelectItem>
                      <SelectItem value="Sparkles">Parıltı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <Select value={formData.status} onValueChange={(value: any) => handleChange("status", value)}>
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

              <div className="space-y-2">
                <Label htmlFor="sortOrder" className="flex items-center">
                  Sıralama Önceliği
                  {nextSortOrder && !defaultValues && (
                    <span className="ml-2 text-xs text-muted-foreground">(Önerilen: {nextSortOrder})</span>
                  )}
                </Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min="1"
                  value={formData.sortOrder}
                  onChange={(e) => handleChange("sortOrder", Number.parseInt(e.target.value))}
                  required
                />
                <Alert variant="warning" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Sıralama değeri benzersiz olmalıdır. Bu değer, mobil uygulamada paketlerin görüntülenme sırasını
                    belirler. Düşük değerler daha önce gösterilir.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <Tabs defaultValue="ios" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ios" className="flex items-center">
                  <Apple className="h-4 w-4 mr-2 text-blue-600" />
                  iOS Yapılandırması
                </TabsTrigger>
                <TabsTrigger value="android" className="flex items-center">
                  <Android className="h-4 w-4 mr-2 text-green-600" />
                  Android Yapılandırması
                </TabsTrigger>
              </TabsList>
              <TabsContent value="ios" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="ios-product-id">Ürün ID</Label>
                  <Input
                    id="ios-product-id"
                    value={formData.productId.ios}
                    onChange={(e) => handleNestedChange("productId", "ios", e.target.value)}
                    placeholder="com.flortapp.tokens.small"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor="ios-price">Fiyat</Label>
                    <Input
                      id="ios-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price.ios}
                      onChange={(e) => handleNestedChange("price", "ios", Number.parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ios-currency">Para Birimi</Label>
                    <Select
                      value={formData.currency.ios}
                      onValueChange={(value) => handleNestedChange("currency", "ios", value)}
                    >
                      <SelectTrigger id="ios-currency">
                        <SelectValue placeholder="Para Birimi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TL">TL</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="android" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="android-product-id">Ürün ID</Label>
                  <Input
                    id="android-product-id"
                    value={formData.productId.android}
                    onChange={(e) => handleNestedChange("productId", "android", e.target.value)}
                    placeholder="com.flortapp.tokens.small"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor="android-price">Fiyat</Label>
                    <Input
                      id="android-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price.android}
                      onChange={(e) => handleNestedChange("price", "android", Number.parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="android-currency">Para Birimi</Label>
                    <Select
                      value={formData.currency.android}
                      onValueChange={(value) => handleNestedChange("currency", "android", value)}
                    >
                      <SelectTrigger id="android-currency">
                        <SelectValue placeholder="Para Birimi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TL">TL</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </ScrollArea>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button type="submit" form="token-package-form">
            Kaydet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
