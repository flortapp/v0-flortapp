"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface UserSpendingHistoryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any | null
}

export function UserSpendingHistoryCustom({ open, onOpenChange, user }: UserSpendingHistoryProps) {
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false)

  // Reset page when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentPage(1)
    }
  }, [open])

  if (!user) return null

  // Örnek harcama geçmişi verileri
  const spendingHistory = [
    {
      id: "1",
      date: "15.03.2024",
      package: "Premium Üyelik",
      quantity: 1,
      amount: "149.99₺",
      paymentMethod: "Kredi Kartı",
    },
    {
      id: "2",
      date: "10.03.2024",
      package: "100 Jeton",
      quantity: 1,
      amount: "49.99₺",
      paymentMethod: "Google Pay",
    },
    // ... diğer veriler
  ]

  // Sayfalama işlemi
  const totalPages = Math.ceil(spendingHistory.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedHistory = spendingHistory.slice(startIndex, startIndex + itemsPerPage)

  const itemsPerPageOptions = [10, 25, 50, 100]

  const handleClose = () => {
    // Directly set open to false
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[900px] p-0 bg-[#171829] text-white overflow-hidden border-none"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault()
          handleClose()
        }}
      >
        <div className="p-4 border-b border-gray-800 flex flex-row items-center justify-between">
          <h2 className="text-xl font-medium">Harcama Geçmişi</h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={handleClose}
            type="button"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Kapat</span>
          </Button>
        </div>

        {/* Tablo ve diğer içerikler */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#1a1b2e]">
              <TableRow className="border-none">
                <TableHead className="font-semibold text-gray-300">İşlem tarihi</TableHead>
                <TableHead className="font-semibold text-gray-300">Paket</TableHead>
                <TableHead className="font-semibold text-gray-300">Adet</TableHead>
                <TableHead className="font-semibold text-gray-300">Tutar</TableHead>
                <TableHead className="font-semibold text-gray-300">Ödeme Yöntemi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedHistory.map((item) => (
                <TableRow key={item.id} className="border-b border-gray-800">
                  <TableCell className="text-gray-300">{item.date}</TableCell>
                  <TableCell className="text-gray-300">{item.package}</TableCell>
                  <TableCell className="text-gray-300">{item.quantity}</TableCell>
                  <TableCell className="text-gray-300">{item.amount}</TableCell>
                  <TableCell className="text-gray-300">{item.paymentMethod}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-gray-800">
          {/* Sayfalama kontrolleri */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
