"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, Unlock, AlertTriangle, History } from "lucide-react"
import { Pagination } from "@/components/ui/pagination"

// Mock data for blocked users
const mockBlockedData = [
  {
    id: "BL12345",
    userId: "USR789",
    username: "suspicious_user",
    email: "suspicious@example.com",
    blockedAt: "2023-05-15T14:30:00Z",
    blockedBy: "system",
    reason: "spam_messages",
    duration: "permanent",
    violationCount: 5,
  },
  {
    id: "BL12346",
    userId: "USR456",
    username: "bot_account42",
    email: "bot42@example.com",
    blockedAt: "2023-05-14T10:15:00Z",
    blockedBy: "admin",
    reason: "fake_profile",
    duration: "30_days",
    violationCount: 3,
  },
  {
    id: "BL12347",
    userId: "USR123",
    username: "fake_profile99",
    email: "fake99@example.com",
    blockedAt: "2023-05-13T18:45:00Z",
    blockedBy: "system",
    reason: "inappropriate_content",
    duration: "7_days",
    violationCount: 2,
  },
  {
    id: "BL12348",
    userId: "USR234",
    username: "mass_messenger",
    email: "mass@example.com",
    blockedAt: "2023-05-12T09:20:00Z",
    blockedBy: "admin",
    reason: "mass_messaging",
    duration: "permanent",
    violationCount: 8,
  },
  {
    id: "BL12349",
    userId: "USR567",
    username: "scammer_2023",
    email: "scammer@example.com",
    blockedAt: "2023-05-11T16:10:00Z",
    blockedBy: "system",
    reason: "phishing_attempt",
    duration: "permanent",
    violationCount: 4,
  },
]

interface BlockedTableProps {
  searchQuery: string
}

const BlockedTable = ({ searchQuery }: BlockedTableProps) => {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter data based on search query
  const filteredData = mockBlockedData.filter((item) => {
    return (
      item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userId.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleViewUser = (user: any) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const getDurationBadge = (duration: string) => {
    switch (duration) {
      case "permanent":
        return <Badge variant="destructive">Kalıcı</Badge>
      case "30_days":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            30 Gün
          </Badge>
        )
      case "7_days":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            7 Gün
          </Badge>
        )
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Kullanıcı</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Engellenme Tarihi</TableHead>
              <TableHead>Süre</TableHead>
              <TableHead>İhlal Sayısı</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{formatDate(item.blockedAt)}</TableCell>
                  <TableCell>{getDurationBadge(item.duration)}</TableCell>
                  <TableCell>
                    <Badge variant={item.violationCount > 3 ? "destructive" : "outline"} className="rounded-full">
                      {item.violationCount}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewUser(item)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Detaylar
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center">
                            <Unlock className="h-4 w-4 mr-2 text-green-600" />
                            <span>Engeli Kaldır</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                            <span>Uyarı Gönder</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <History className="h-4 w-4 mr-2 text-blue-600" />
                            <span>İhlal Geçmişi</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Arama kriterlerinize uygun engellenen kullanıcı bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredData.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Engellenen Kullanıcı Detayı</DialogTitle>
            <DialogDescription>
              ID: {selectedUser?.userId} - Kullanıcı: {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1">E-posta:</h4>
                <p className="text-sm">{selectedUser?.email}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Engellenme Tarihi:</h4>
                <p className="text-sm">{selectedUser && formatDate(selectedUser.blockedAt)}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Engelleme Süresi:</h4>
                <p className="text-sm">
                  {selectedUser?.duration === "permanent" && "Kalıcı"}
                  {selectedUser?.duration === "30_days" && "30 Gün"}
                  {selectedUser?.duration === "7_days" && "7 Gün"}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Engelleme Nedeni:</h4>
                <p className="text-sm">{selectedUser?.reason}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Engelleme Kaynağı:</h4>
                <p className="text-sm">
                  {selectedUser?.blockedBy === "system" && "Sistem"}
                  {selectedUser?.blockedBy === "admin" && "Admin"}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">İhlal Sayısı:</h4>
                <p className="text-sm">{selectedUser?.violationCount}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Kapat
            </Button>
            <Button variant="default">
              <Unlock className="h-4 w-4 mr-1" />
              Engeli Kaldır
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default BlockedTable
