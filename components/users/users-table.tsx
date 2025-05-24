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
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("createdAt")}>
                <div className="flex items-center">
                  Kayıt Tarihi
                  {getSortIcon("createdAt")}
                </div>
              </TableHead>
              <TableHead>Son Aktif</TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("credits")}>
                <div className="flex items-center">
                  Jetonlar
                  {getSortIcon("credits")}
                </div>
              </TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{user.name}</span>
                        {user.isVip && <VipBadge className="ml-2" />}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.registrationMethod === "google" && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {user.email?.split("@")[0]}@gmail.com
                          </span>
                        )}
                        {user.registrationMethod === "apple" && (
                          <span className="flex items-center gap-1">
                            <Apple className="h-3 w-3" /> {user.email?.split("@")[0]}@icloud.com
                          </span>
                        )}
                        {user.registrationMethod?.startsWith("phone:") && (
                          <span className="flex items-center gap-1">
                            <Smartphone className="h-3 w-3" /> {user.registrationMethod.replace("phone:", "")}
                          </span>
                        )}
                        {user.registrationMethod?.startsWith("guest") && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> Misafir ID: {user.id.substring(0, 8)}
                          </span>
                        )}
                        {!user.registrationMethod && user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{getRegistrationMethodBadge(user.registrationMethod)}</TableCell>
                <TableCell>{format(new Date(user.createdAt), "dd/MM/yyyy")}</TableCell>
                <TableCell>
                  {user.lastActive
                    ? formatDistanceToNow(new Date(user.lastActive), { addSuffix: true, locale: tr })
                    : "Bilinmiyor"}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{user.credits}</div>
                </TableCell>
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
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleManageCredits(user)}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Jeton Yönetimi
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewSpendingHistory(user)}>
                        <History className="mr-2 h-4 w-4" />
                        Harcama Geçmişi
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === "blocked" ? (
                        <DropdownMenuItem onClick={() => onActivateUser?.(user.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Aktifleştir
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onBlockUser?.(user.id)}>
                          <Ban className="mr-2 h-4 w-4" />
                          Engelle
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onDelete?.(user.id)} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {selectedUser && (
        <>
          <UserEditDialog user={selectedUser} open={showEditDialog} onOpenChange={setShowEditDialog} />
          <UserCreditsDialog user={selectedUser} open={showCreditsDialog} onOpenChange={setShowCreditsDialog} />
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
