"use client"

import { useState, useEffect, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { useUsers } from "@/hooks/use-api-data"
import type { User } from "@/types/user"

interface VipUsersTableProps {
  filter?: string
}

type SortField = "spentAmount" | "vipEndDate" | null
type SortDirection = "asc" | "desc"

export function VipUsersTable({ filter }: VipUsersTableProps) {
  const { users, isLoading, error } = useUsers()
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // VIP kullanıcıları filtrele
  const vipUsers = useMemo(() => {
    return users
      .filter((user) => user.isVip)
      .map((user) => ({
        ...user,
        // Eğer kullanıcıda VIP bilgileri yoksa varsayılan değerler ata
        vipPlan: user.vipPlan || "Vip Aylık", // Changed from "Aylık Premium" to "Vip Aylık"
        vipStartDate: user.vipStartDate || new Date(user.joinDate).toLocaleDateString(),
        vipEndDate:
          user.vipEndDate ||
          new Date(new Date(user.joinDate).setMonth(new Date(user.joinDate).getMonth() + 1)).toLocaleDateString(),
        vipStatus: user.vipStatus || "active",
        spentAmount: user.spentAmount || user.credits * 2, // Örnek bir hesaplama
        spentAmountFormatted: user.spentAmountFormatted || `${user.credits * 2}₺`,
      }))
  }, [users])

  // Filtreleme işlemi
  const filteredUsers = useMemo(() => {
    if (!filter) return vipUsers

    return vipUsers.filter((user) => {
      if (filter === "active") return user.vipStatus === "active"
      if (filter === "expired") return user.vipStatus === "expired"
      return true
    })
  }, [vipUsers, filter])

  // Sıralama fonksiyonu
  const sortUsers = (usersToSort: User[]) => {
    if (!sortField) return usersToSort

    return [...usersToSort].sort((a, b) => {
      let aValue, bValue

      if (sortField === "spentAmount") {
        aValue = a.spentAmount || 0
        bValue = b.spentAmount || 0
      } else if (sortField === "vipEndDate") {
        aValue = a.vipEndDate ? new Date(a.vipEndDate).getTime() : 0
        bValue = b.vipEndDate ? new Date(b.vipEndDate).getTime() : 0
      } else {
        return 0
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Aynı alana tekrar tıklandığında sıralama yönünü değiştir
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Farklı bir alana tıklandığında, o alanı sırala ve artan sıralama yap
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Sıralama ikonu
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
  }

  // Sıralama ve sayfalama uygulanmış kullanıcılar
  const sortedUsers = sortUsers(filteredUsers)
  const itemsPerPage = 20 // Sayfa başına 20 kullanıcı
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Sıralama değiştiğinde ilk sayfaya dön
  useEffect(() => {
    setCurrentPage(1)
  }, [sortField, sortDirection])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error loading VIP users: {error}
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kullanıcı</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Başlangıç</TableHead>
            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("vipEndDate")}>
              <div className="flex items-center">
                Bitiş
                {getSortIcon("vipEndDate")}
              </div>
            </TableHead>
            <TableHead>Durum</TableHead>
            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("spentAmount")}>
              <div className="flex items-center">
                Toplam Harcama
                {getSortIcon("spentAmount")}
              </div>
            </TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                VIP kullanıcı bulunamadı
              </TableCell>
            </TableRow>
          ) : (
            paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={user.avatar || `/abstract-geometric-shapes.png?height=32&width=32&query=${user.name}`}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.vipPlan}</TableCell>
                <TableCell>{user.vipStartDate}</TableCell>
                <TableCell>{user.vipEndDate}</TableCell>
                <TableCell>
                  <Badge variant={user.vipStatus === "active" ? "success" : "secondary"}>
                    {user.vipStatus === "active" ? "Aktif" : "Süresi Dolmuş"}
                  </Badge>
                </TableCell>
                <TableCell>{user.spentAmountFormatted}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menüyü Aç</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Detayları Görüntüle</DropdownMenuItem>
                      <DropdownMenuItem>Üyeliği Uzat</DropdownMenuItem>
                      <DropdownMenuItem>Üyeliği Durdur</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Üyeliği İptal Et</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </>
  )
}
