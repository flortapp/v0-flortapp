"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, CheckCircle, XCircle, Ban, AlertTriangle } from "lucide-react"
import { Pagination } from "@/components/ui/pagination"

// Mock data for spam content
const mockSpamData = [
  {
    id: "SP12345",
    userId: "USR789",
    username: "suspicious_user",
    contentType: "message",
    content: "Hemen bu linke tıklayın ve bedava tokenler kazanın! https://scam-link.com",
    detectedAt: "2023-05-15T14:30:00Z",
    status: "pending",
    reason: "suspicious_link",
    confidence: 0.89,
  },
  {
    id: "SP12346",
    userId: "USR456",
    username: "bot_account42",
    contentType: "profile",
    content: "Profil açıklaması içinde yasak kelimeler ve reklamlar içeriyor.",
    detectedAt: "2023-05-14T10:15:00Z",
    status: "rejected",
    reason: "prohibited_words",
    confidence: 0.95,
  },
  {
    id: "SP12347",
    userId: "USR123",
    username: "fake_profile99",
    contentType: "photo",
    content: "Uygunsuz içerikli fotoğraf yüklendi.",
    detectedAt: "2023-05-13T18:45:00Z",
    status: "approved",
    reason: "inappropriate_content",
    confidence: 0.78,
  },
  {
    id: "SP12348",
    userId: "USR234",
    username: "mass_messenger",
    contentType: "message",
    content: "Aynı mesajı 50'den fazla kullanıcıya gönderdi.",
    detectedAt: "2023-05-12T09:20:00Z",
    status: "pending",
    reason: "mass_messaging",
    confidence: 0.92,
  },
  {
    id: "SP12349",
    userId: "USR567",
    username: "scammer_2023",
    contentType: "message",
    content: "Kullanıcılardan banka bilgilerini isteyen mesajlar gönderiyor.",
    detectedAt: "2023-05-11T16:10:00Z",
    status: "rejected",
    reason: "phishing_attempt",
    confidence: 0.97,
  },
]

interface SpamTableProps {
  searchQuery: string
  filterType: string
}

const SpamTable = ({ searchQuery, filterType }: SpamTableProps) => {
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter data based on search query and filter type
  const filteredData = mockSpamData.filter((item) => {
    const matchesSearch =
      item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filterType === "all" || item.contentType === filterType

    return matchesSearch && matchesFilter
  })

  const handleViewContent = (content: any) => {
    setSelectedContent(content)
    setIsDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            İnceleniyor
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Onaylandı
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Reddedildi
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
              <TableHead>İçerik Türü</TableHead>
              <TableHead>Tespit Tarihi</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Güven Oranı</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>
                    {item.contentType === "message" && "Mesaj"}
                    {item.contentType === "profile" && "Profil"}
                    {item.contentType === "photo" && "Fotoğraf"}
                  </TableCell>
                  <TableCell>{formatDate(item.detectedAt)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{`%${Math.round(item.confidence * 100)}`}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewContent(item)}>
                        <Eye className="h-4 w-4 mr-1" />
                        İçeriği Görüntüle
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            <span>Onayla</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <XCircle className="h-4 w-4 mr-2 text-red-600" />
                            <span>Reddet</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <Ban className="h-4 w-4 mr-2 text-red-600" />
                            <span>Kullanıcıyı Engelle</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                            <span>İncelemeye Al</span>
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
                  Arama kriterlerinize uygun spam içerik bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end mt-4">
        <Pagination>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Önceki
          </Button>
          <div className="flex items-center mx-2">Sayfa {currentPage}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={filteredData.length < itemsPerPage}
          >
            Sonraki
          </Button>
        </Pagination>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Spam İçerik Detayı</DialogTitle>
            <DialogDescription>
              ID: {selectedContent?.id} - Kullanıcı: {selectedContent?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">İçerik:</h4>
              <div className="rounded-md bg-muted p-3 text-sm">{selectedContent?.content}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1">Tespit Nedeni:</h4>
                <p className="text-sm">{selectedContent?.reason}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Güven Oranı:</h4>
                <p className="text-sm">{selectedContent && `%${Math.round(selectedContent.confidence * 100)}`}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Kapat
            </Button>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm">
                <XCircle className="h-4 w-4 mr-1" />
                Reddet
              </Button>
              <Button variant="default" size="sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                Onayla
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SpamTable
