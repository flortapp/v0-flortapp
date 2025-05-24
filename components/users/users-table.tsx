"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MoreHorizontal,
  Trash,
  CreditCard,
  History,
  Ban,
  CheckCircle,
  Mail,
  Smartphone,
  User,
  Apple,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react"
import { UserEditDialog } from "./user-edit-dialog"
import { UserCreditsDialog } from "./user-credits-dialog"
import { VipBadge } from "./vip-badge"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { Pagination } from "@/components/ui/pagination"
import { UserSpendingHistoryCustom } from "./user-spending-history-custom"
import { format } from "date-fns"
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface UsersTableProps {
  users: any[]
  isLoading?: boolean
  onEdit?: (user: any) => void
  onDelete?: (userId: string) => void
  onBlockUser?: (userId: string) => void
  onActivateUser?: (userId: string) => void
}

type SortField = "credits" | "createdAt" | null
type SortDirection = "asc" | "desc"

export function UsersTable({ users, isLoading, onEdit, onDelete, onBlockUser, onActivateUser }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showCreditsDialog, setShowCreditsDialog] = useState(false)
  const [showSpendingHistory, setShowSpendingHistory] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const itemsPerPage = 5

  // Sort users based on the current sort field and direction
  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField) return 0

    let aValue, bValue

    if (sortField === "credits") {
      aValue = a.credits
      bValue = b.credits
    } else if (sortField === "createdAt") {
      aValue = new Date(a.createdAt).getTime()
      bValue = new Date(b.createdAt).getTime()
    } else {
      return 0
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Reset to first page when sort changes
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection("asc")
    }
    setCurrentPage(1)
  }

  // Get the appropriate sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setShowEditDialog(true)
  }

  const handleManageCredits = (user: any) => {
    setSelectedUser(user)
    setShowCreditsDialog(true)
  }

  const handleViewSpendingHistory = (user: any) => {
    setSelectedUser(user)
    setShowSpendingHistory(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Aktif</Badge>
      case "inactive":
        return <Badge variant="outline">Pasif</Badge>
      case "blocked":
        return <Badge variant="destructive">Engelli</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRegistrationMethodBadge = (method: string) => {
    if (!method)
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-gray-100 text-gray-800">
          <User className="h-3 w-3" />
          <span>Bilinmiyor</span>
        </Badge>
      )

    if (method === "google") {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200">
          <Mail className="h-3 w-3" />
          <span>Google</span>
        </Badge>
      )
    }

    if (method === "apple") {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-gray-100 text-gray-800 border-gray-300">
          <Apple className="h-3 w-3" />
          <span>Apple</span>
        </Badge>
      )
    }

    if (method.startsWith("phone:")) {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
          <Smartphone className="h-3 w-3" />
          <span>Telefon</span>
        </Badge>
      )
    }

    if (method.startsWith("guest")) {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
          <User className="h-3 w-3" />
          <span>Misafir {method.split("-")[1]}</span>
        </Badge>
      )
    }

    return <Badge variant="outline">{method}</Badge>
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kullanıcı</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Kayıt Yöntemi</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("credits")}>
                  Kredi
                  {getSortIcon("credits")}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("createdAt")}>
                  Kayıt Tarihi
                  {getSortIcon("createdAt")}
                </div>
              </TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Yükleniyor...
                </TableCell>
              </TableRow>
            ) : paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Kullanıcı bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      {user.isVip && <VipBadge />}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{getRegistrationMethodBadge(user.registrationMethod)}</TableCell>
                  <TableCell>{user.credits}</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: tr })}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Menüyü aç</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <User className="mr-2 h-4 w-4" />
                          <span>Düzenle</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManageCredits(user)}>
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Kredi Yönetimi</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewSpendingHistory(user)}>
                          <History className="mr-2 h-4 w-4" />
                          <span>Harcama Geçmişi</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "blocked" ? (
                          <DropdownMenuItem onClick={() => onActivateUser?.(user.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            <span>Engeli Kaldır</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => onBlockUser?.(user.id)}>
                            <Ban className="mr-2 h-4 w-4" />
                            <span>Engelle</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onDelete?.(user.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Sil</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) setCurrentPage(currentPage - 1)
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(page)
                  }}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {selectedUser && (
        <>
          <UserEditDialog
            user={selectedUser}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            onSave={onEdit}
          />
          <UserCreditsDialog
            user={selectedUser}
            open={showCreditsDialog}
            onOpenChange={setShowCreditsDialog}
          />
          <UserSpendingHistoryCustom
            user={selectedUser}
            open={showSpendingHistory}
            onOpenChange={setShowSpendingHistory}
          />
        </>
      )}
    </div>
  )
}
