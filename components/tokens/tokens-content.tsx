"use client"

import { useState } from "react"
import { Plus, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TokenPackagesTable } from "@/components/tokens/token-packages-table"
import { TokenPackageDialog } from "@/components/tokens/token-package-dialog"
import { TokenPackageDeleteDialog } from "@/components/tokens/token-package-delete-dialog"
import type { TokenPackage } from "@/types/token-package"
import { useToast } from "@/components/ui/use-toast"

export function TokensContent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPackage, setCurrentPackage] = useState<TokenPackage | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const { toast } = useToast()

  // Mock data for token packages
  const [tokenPackages, setTokenPackages] = useState<TokenPackage[]>([
    {
      id: "63b391d9_cb2b_4389_b368_a1b88938d0e4",
      title: "Jeton Çantası",
      description: "Yeni kullanıcılar için küçük bir jeton paketi",
      icon: "Gift",
      tokenAmount: 20,
      price: 25,
      currency: "TL",
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
      price: 100,
      currency: "TL",
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
      price: 200,
      currency: "TL",
      status: "active",
      createdAt: "2020-03-03T14:00:00Z",
      sortOrder: 3,
    },
    {
      id: "a1b2c3d4_e5f6_7890_abcd_ef1234567890",
      title: "Elmas Jetonlar",
      description: "Bonus özellikli premium jeton paketi",
      icon: "Diamond",
      tokenAmount: 800,
      price: 500,
      currency: "TL",
      status: "active",
      createdAt: "2020-04-15T10:30:00Z",
      sortOrder: 4,
    },
    {
      id: "b2c3d4e5_f6a7_8901_bcde_f23456789012",
      title: "Hafta Sonu Özel",
      description: "Bonus jetonlu sınırlı süreli teklif",
      icon: "Heart",
      tokenAmount: 200,
      price: 120,
      currency: "TL",
      status: "promotional",
      createdAt: "2020-05-01T09:00:00Z",
      promotionalDetails: {
        validUntil: "2025-05-31T23:59:59Z",
      },
      sortOrder: 5,
    },
    {
      id: "c3d4e5f6_a7b8_9012_cdef_345678901234",
      title: "Eski Paket",
      description: "Artık sunulmayan eski jeton paketi",
      icon: "Crown",
      tokenAmount: 50,
      price: 40,
      currency: "TL",
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
      price: 350,
      currency: "TL",
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
      price: 250,
      currency: "TL",
      status: "active",
      createdAt: "2020-07-20T14:45:00Z",
      sortOrder: 8,
    },
  ])

  const handleCreatePackage = (packageData: TokenPackage) => {
    const newPackage: TokenPackage = {
      ...packageData,
      id: `pkg_${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    }

    setTokenPackages([...tokenPackages, newPackage])
    setIsCreateDialogOpen(false)
    toast({
      title: "Paket Oluşturuldu",
      description: `${packageData.title} başarıyla oluşturuldu.`,
    })
  }

  const handleEditPackage = (packageData: TokenPackage) => {
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

  const handleStatusChange = (pkg: TokenPackage, newStatus: "active" | "inactive" | "promotional") => {
    const statusMap = {
      active: "Aktif",
      inactive: "Pasif",
      promotional: "Promosyon",
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

      return matchesSearch && matchesStatus
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
          comparison = a.price - b.price
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "createdAt":
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Jeton Paketlerini Yönet</h1>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-gradient-to-r from-pink-600 to-red-500 hover:from-pink-700 hover:to-red-600"
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
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Duruma göre filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Pasif</SelectItem>
              <SelectItem value="promotional">Promosyon</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sıralama" />
            </SelectTrigger>
            <SelectContent>
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
