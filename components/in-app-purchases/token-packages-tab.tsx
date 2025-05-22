"use client"

import { useState } from "react"
import { Plus, Search, SlidersHorizontal, Apple, SmartphoneIcon as Android } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TokenPackagesTable } from "@/components/in-app-purchases/token-packages-table"
import { TokenPackageDialog } from "@/components/in-app-purchases/token-package-dialog"
import { TokenPackageDeleteDialog } from "@/components/tokens/token-package-delete-dialog"
import type { TokenPackage } from "@/types/in-app-purchase"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export function TokenPackagesTab() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPackage, setCurrentPackage] = useState<TokenPackage | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [platformFilter, setPlatformFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("sortOrder") // Varsayılan sıralama alanını sortOrder olarak değiştirdik
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc") // Varsayılan sıralama yönünü asc olarak değiştirdik
  const { toast } = useToast()

  // Mock data for token packages
  const [tokenPackages, setTokenPackages] = useState<TokenPackage[]>([
    {
      id: "63b391d9_cb2b_4389_b368_a1b88938d0e4",
      title: "Jeton Çantası",
      description: "Yeni kullanıcılar için küçük bir jeton paketi",
      icon: "Gift",
      tokenAmount: 20,
      type: "token_package",
      productId: {
        ios: "com.flortapp.tokens.small",
        android: "com.flortapp.tokens.small",
      },
      price: {
        ios: 24.99,
        android: 22.99,
      },
      currency: {
        ios: "TL",
        android: "TL",
      },
      status: "active",
      createdAt: "2020-02-26T12:00:00Z",
      sortOrder: 1,
    },
    {
      id: "47fef8a4_134c_425d_b61a_14aadd8aa190",
      title: "Jeton Kasası",
      description: "Düzenli kullanıcılar için orta boy jeton paketi",
      icon: "Package",
      tokenAmount: 125,
      type: "token_package",
      productId: {
        ios: "com.flortapp.tokens.medium",
        android: "com.flortapp.tokens.medium",
      },
      price: {
        ios: 99.99,
        android: 94.99,
      },
      currency: {
        ios: "TL",
        android: "TL",
      },
      status: "active",
      createdAt: "2020-03-03T12:00:00Z",
      sortOrder: 2,
    },
    {
      id: "f78585df_1750_410c_9a5d_2f870fe2263c",
      title: "Jeton Hazinesi",
      description: "Güçlü kullanıcılar için büyük jeton paketi",
      icon: "Gem",
      tokenAmount: 300,
      type: "token_package",
      productId: {
        ios: "com.flortapp.tokens.large",
        android: "com.flortapp.tokens.large",
      },
      price: {
        ios: 199.99,
        android: 189.99,
      },
      currency: {
        ios: "TL",
        android: "TL",
      },
      status: "active",
      createdAt: "2020-03-03T14:00:00Z",
      sortOrder: 3,
    },
    {
      id: "a1b2c3d4_e5f6_7890_abcd_ef1234567890",
      title: "Elmas Jetonlar",
      description: "Premium jeton paketi",
      icon: "Diamond",
      tokenAmount: 800,
      type: "token_package",
      productId: {
        ios: "com.flortapp.tokens.premium",
        android: "com.flortapp.tokens.premium",
      },
      price: {
        ios: 499.99,
        android: 479.99,
      },
      currency: {
        ios: "TL",
        android: "TL",
      },
      status: "active",
      createdAt: "2020-04-15T10:30:00Z",
      sortOrder: 4,
    },
    {
      id: "b2c3d4e5_f6a7_8901_bcde_f23456789012",
      title: "Hafta Sonu Paketi",
      description: "Bonus jetonlu özel paket",
      icon: "Heart",
      tokenAmount: 200,
      type: "token_package",
      productId: {
        ios: "com.flortapp.tokens.weekend",
        android: "com.flortapp.tokens.weekend",
      },
      price: {
        ios: 119.99,
        android: 114.99,
      },
      currency: {
        ios: "TL",
        android: "TL",
      },
      status: "active",
      createdAt: "2020-05-01T09:00:00Z",
      sortOrder: 5,
    },
    {
      id: "c3d4e5f6_a7b8_9012_cdef_345678901234",
      title: "Eski Paket",
      description: "Artık sunulmayan eski jeton paketi",
      icon: "Crown",
      tokenAmount: 50,
      type: "token_package",
      productId: {
        ios: "com.flortapp.tokens.old",
        android: "com.flortapp.tokens.old",
      },
      price: {
        ios: 39.99,
        android: 37.99,
      },
      currency: {
        ios: "TL",
        android: "TL",
      },
      status: "inactive",
      createdAt: "2019-11-10T11:15:00Z",
      sortOrder: 6,
    },
    {
      id: "d4e5f6a7_b8c9_0123_defg_456789012345",
      title: "Şampiyonluk Paketi",
      description: "Özel etkinlikler için şampiyonluk jeton paketi",
      icon: "Trophy",
      tokenAmount: 500,
      type: "token_package",
      productId: {
        ios: "com.flortapp.tokens.champion",
        android: "com.flortapp.tokens.champion",
      },
      price: {
        ios: 349.99,
        android: 339.99,
      },
      currency: {
        ios: "TL",
        android: "TL",
      },
      status: "active",
      createdAt: "2020-06-15T08:30:00Z",
      sortOrder: 7,
    },
    {
      id: "e5f6a7b8_c9d0_1234_efgh_567890123456",
      title: "Sihirli Jetonlar",
      description: "Özel efektli sihirli jeton paketi",
      icon: "Sparkles",
      tokenAmount: 350,
      type: "token_package",
      productId: {
        ios: "com.flortapp.tokens.magic",
        android: "com.flortapp.tokens.magic",
      },
      price: {
        ios: 249.99,
        android: 239.99,
      },
      currency: {
        ios: "TL",
        android: "TL",
      },
      status: "active",
      createdAt: "2020-07-20T14:45:00Z",
      sortOrder: 8,
    },
  ])

  // Sıralama değerinin benzersiz olup olmadığını kontrol eden fonksiyon
  const isSortOrderUnique = (sortOrderValue: number, packageId?: string): boolean => {
    return !tokenPackages.some((pkg) => pkg.sortOrder === sortOrderValue && (!packageId || pkg.id !== packageId))
  }

  const handleCreatePackage = (packageData: TokenPackage) => {
    // Sıralama değeri kontrolü
    if (!isSortOrderUnique(packageData.sortOrder)) {
      toast({
        title: "Sıralama Hatası",
        description: `${packageData.sortOrder} sıralama değeri zaten başka bir pakette kullanılıyor. Lütfen benzersiz bir değer girin.`,
        variant: "destructive",
      })
      return
    }

    const newPackage: TokenPackage = {
      ...packageData,
      id: `pkg_${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      type: "token_package",
    }

    setTokenPackages([...tokenPackages, newPackage])
    setIsCreateDialogOpen(false)
    toast({
      title: "Paket Oluşturuldu",
      description: `${packageData.title} başarıyla oluşturuldu.`,
    })
  }

  const handleEditPackage = (packageData: TokenPackage) => {
    // Sıralama değeri kontrolü (kendi ID'si hariç)
    if (!isSortOrderUnique(packageData.sortOrder, packageData.id)) {
      toast({
        title: "Sıralama Hatası",
        description: `${packageData.sortOrder} sıralama değeri zaten başka bir pakette kullanılıyor. Lütfen benzersiz bir değer girin.`,
        variant: "destructive",
      })
      return
    }

    const updatedPackages = tokenPackages.map((pkg) =>
      pkg.id === packageData.id ? { ...packageData, updatedAt: new Date().toISOString() } : pkg,
    )

    setTokenPackages(updatedPackages)
    setIsEditDialogOpen(false)
    setCurrentPackage(null)
    toast({
      title: "Paket Güncellendi",
      description: `${packageData.title} başarıyla güncellendi.`,
    })
  }

  const handleDeletePackage = (id: string) => {
    setTokenPackages(tokenPackages.filter((pkg) => pkg.id !== id))
    setIsDeleteDialogOpen(false)
    setCurrentPackage(null)
    toast({
      title: "Paket Silindi",
      description: "Jeton paketi başarıyla silindi.",
    })
  }

  const handleEditClick = (pkg: TokenPackage) => {
    setCurrentPackage(pkg)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (pkg: TokenPackage) => {
    setCurrentPackage(pkg)
    setIsDeleteDialogOpen(true)
  }

  const handleStatusChange = (pkg: TokenPackage, newStatus: "active" | "inactive") => {
    const statusMap = {
      active: "Aktif",
      inactive: "Pasif",
    }

    const updatedPackages = tokenPackages.map((p) =>
      p.id === pkg.id ? { ...p, status: newStatus, updatedAt: new Date().toISOString() } : p,
    )

    setTokenPackages(updatedPackages)
    toast({
      title: "Durum Güncellendi",
      description: `${pkg.title} artık ${statusMap[newStatus]}.`,
    })
  }

  // Filter and sort packages
  const filteredPackages = tokenPackages
    .filter((pkg) => {
      const matchesSearch =
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || pkg.status === statusFilter

      const matchesPlatform =
        platformFilter === "all" ||
        (platformFilter === "ios" && pkg.productId.ios) ||
        (platformFilter === "android" && pkg.productId.android)

      return matchesSearch && matchesStatus && matchesPlatform
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "tokenAmount":
          comparison = a.tokenAmount - b.tokenAmount
          break
        case "price":
          // Sort by iOS price if available, otherwise Android price
          const aPrice = a.price.ios || a.price.android || 0
          const bPrice = b.price.ios || b.price.android || 0
          comparison = aPrice - bPrice
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "sortOrder":
          comparison = a.sortOrder - b.sortOrder
          break
        case "createdAt":
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

  // Kullanılabilir sonraki sıralama değerini hesapla
  const getNextAvailableSortOrder = (): number => {
    if (tokenPackages.length === 0) return 1
    const maxSortOrder = Math.max(...tokenPackages.map((pkg) => pkg.sortOrder))
    return maxSortOrder + 1
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Jeton Paketleri</h2>
          <p className="text-sm text-muted-foreground">Kullanıcıların satın alabileceği jeton paketlerini yönetin.</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yeni Jeton Paketi Ekle
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Paketleri ara..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Platformlar</SelectItem>
              <SelectItem value="ios">
                <div className="flex items-center">
                  <Apple className="mr-2 h-4 w-4" />
                  iOS
                </div>
              </SelectItem>
              <SelectItem value="android">
                <div className="flex items-center">
                  <Android className="mr-2 h-4 w-4" />
                  Android
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

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
              <SelectItem value="createdAt">Oluşturma Tarihi</SelectItem>
              <SelectItem value="title">Başlık</SelectItem>
              <SelectItem value="tokenAmount">Jeton Miktarı</SelectItem>
              <SelectItem value="price">Fiyat</SelectItem>
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
          <span className="font-semibold mr-1">{filteredPackages.length}</span> paket
        </Badge>

        {platformFilter !== "all" && (
          <Badge
            variant="outline"
            className={
              platformFilter === "ios"
                ? "bg-blue-100 text-blue-800 border-blue-200"
                : "bg-green-100 text-green-800 border-green-200"
            }
          >
            {platformFilter === "ios" ? (
              <>
                <Apple className="mr-1 h-3 w-3" /> iOS
              </>
            ) : (
              <>
                <Android className="mr-1 h-3 w-3" /> Android
              </>
            )}
          </Badge>
        )}

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

      <TokenPackagesTable
        packages={filteredPackages}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onStatusChange={handleStatusChange}
      />

      <TokenPackageDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleCreatePackage}
        title="Jeton Paketi Oluştur"
        nextSortOrder={getNextAvailableSortOrder()}
      />

      {currentPackage && (
        <>
          <TokenPackageDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSave={handleEditPackage}
            title="Jeton Paketi Düzenle"
            defaultValues={currentPackage}
          />

          <TokenPackageDeleteDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={() => handleDeletePackage(currentPackage.id)}
            packageData={currentPackage}
          />
        </>
      )}
    </div>
  )
}
