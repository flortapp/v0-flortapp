"use client"
import {
  MoreVertical,
  Edit,
  Trash2,
  Check,
  X,
  Star,
  Clock,
  Gift,
  Package,
  Gem,
  CalendarClock,
  Heart,
  Crown,
  Trophy,
  Diamond,
  Sparkles,
} from "lucide-react"
import { format } from "date-fns"
import type { TokenPackage } from "@/types/token-package"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TokenPackagesTableProps {
  packages: TokenPackage[]
  onEdit: (pkg: TokenPackage) => void
  onDelete: (pkg: TokenPackage) => void
  onStatusChange: (pkg: TokenPackage, status: "active" | "inactive" | "promotional") => void
}

// Define a function to render the correct icon based on the name
const renderIcon = (iconName: string) => {
  switch (iconName) {
    case "Gift":
      return <Gift className="h-6 w-6 text-primary" />
    case "Package":
      return <Package className="h-6 w-6 text-primary" />
    case "Gem":
      return <Gem className="h-6 w-6 text-primary" />
    case "Star":
      return <Star className="h-6 w-6 text-amber-500" />
    case "CalendarClock":
      return <CalendarClock className="h-6 w-6 text-primary" />
    // New icons
    case "Heart":
      return <Heart className="h-6 w-6 text-rose-500" />
    case "Crown":
      return <Crown className="h-6 w-6 text-yellow-500" />
    case "Trophy":
      return <Trophy className="h-6 w-6 text-amber-600" />
    case "Diamond":
      return <Diamond className="h-6 w-6 text-blue-500" />
    case "Sparkles":
      return <Sparkles className="h-6 w-6 text-purple-500" />
    default:
      return <Gift className="h-6 w-6 text-primary" />
  }
}

export function TokenPackagesTable({ packages, onEdit, onDelete, onStatusChange }: TokenPackagesTableProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy, EEEE")
    } catch (error) {
      return "Geçersiz tarih"
    }
  }

  const formatPrice = (price: number, currency = "TL") => {
    return `${price.toLocaleString("tr-TR")} ${currency}`
  }

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
            <X className="mr-1 h-3 w-3" />
            Pasif
          </Badge>
        )
      case "promotional":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <Star className="mr-1 h-3 w-3" />
            Promosyon
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[80px]">İkon</TableHead>
            <TableHead>Başlık</TableHead>
            <TableHead className="hidden md:table-cell">Paket ID</TableHead>
            <TableHead className="hidden md:table-cell">Oluşturulma Tarihi</TableHead>
            <TableHead className="hidden md:table-cell">Fiyat</TableHead>
            <TableHead className="text-right">Jeton</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead className="w-[70px]">İşlem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Jeton paketi bulunamadı.
              </TableCell>
            </TableRow>
          ) : (
            packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    {renderIcon(pkg.icon)}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div>{pkg.title}</div>
                  {pkg.description && (
                    <div className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">{pkg.description}</div>
                  )}
                  {pkg.promotionalDetails?.validUntil && (
                    <div className="flex items-center text-xs text-amber-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Son Tarih: {format(new Date(pkg.promotionalDetails.validUntil), "d MMM yyyy")}
                    </div>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell font-mono text-xs">{pkg.id}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(pkg.createdAt)}</TableCell>
                <TableCell className="hidden md:table-cell font-medium">
                  {formatPrice(pkg.price, pkg.currency)}
                </TableCell>
                <TableCell className="text-right font-medium">{pkg.tokenAmount}</TableCell>
                <TableCell>{getStatusBadge(pkg.status)}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Menüyü aç</span>
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>İşlemler</p>
                        </TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(pkg)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {pkg.status !== "active" && (
                          <DropdownMenuItem onClick={() => onStatusChange(pkg, "active")}>
                            <Check className="mr-2 h-4 w-4" />
                            Aktif Yap
                          </DropdownMenuItem>
                        )}
                        {pkg.status !== "inactive" && (
                          <DropdownMenuItem onClick={() => onStatusChange(pkg, "inactive")}>
                            <X className="mr-2 h-4 w-4" />
                            Pasif Yap
                          </DropdownMenuItem>
                        )}
                        {pkg.status !== "promotional" && (
                          <DropdownMenuItem onClick={() => onStatusChange(pkg, "promotional")}>
                            <Star className="mr-2 h-4 w-4" />
                            Promosyon Yap
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDelete(pkg)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
