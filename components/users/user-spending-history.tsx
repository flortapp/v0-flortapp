"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface UserSpendingHistoryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any | null
}

export function UserSpendingHistory({ open, onOpenChange, user }: UserSpendingHistoryProps) {
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false)

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
    {
      id: "3",
      date: "05.03.2024",
      package: "50 Jeton",
      quantity: 2,
      amount: "49.98₺",
      paymentMethod: "Kredi Kartı",
    },
    {
      id: "4",
      date: "28.02.2024",
      package: "Premium Üyelik",
      quantity: 1,
      amount: "149.99₺",
      paymentMethod: "Apple Pay",
    },
    {
      id: "5",
      date: "15.02.2024",
      package: "200 Jeton",
      quantity: 1,
      amount: "89.99₺",
      paymentMethod: "Kredi Kartı",
    },
    {
      id: "6",
      date: "10.02.2024",
      package: "VIP Paket",
      quantity: 1,
      amount: "299.99₺",
      paymentMethod: "Banka Transferi",
    },
    {
      id: "7",
      date: "05.02.2024",
      package: "100 Jeton",
      quantity: 1,
      amount: "49.99₺",
      paymentMethod: "Google Pay",
    },
    {
      id: "8",
      date: "28.01.2024",
      package: "50 Jeton",
      quantity: 1,
      amount: "24.99₺",
      paymentMethod: "Kredi Kartı",
    },
    {
      id: "9",
      date: "15.01.2024",
      package: "Premium Üyelik",
      quantity: 1,
      amount: "149.99₺",
      paymentMethod: "Apple Pay",
    },
    {
      id: "10",
      date: "10.01.2024",
      package: "200 Jeton",
      quantity: 1,
      amount: "89.99₺",
      paymentMethod: "Kredi Kartı",
    },
    {
      id: "11",
      date: "05.01.2024",
      package: "VIP Paket",
      quantity: 1,
      amount: "299.99₺",
      paymentMethod: "Banka Transferi",
    },
    {
      id: "12",
      date: "28.12.2023",
      package: "100 Jeton",
      quantity: 1,
      amount: "49.99₺",
      paymentMethod: "Google Pay",
    },
  ]

  // Sayfalama işlemi
  const totalPages = Math.ceil(spendingHistory.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedHistory = spendingHistory.slice(startIndex, startIndex + itemsPerPage)

  const itemsPerPageOptions = [10, 25, 50, 100]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0 bg-[#171829] text-white overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex flex-row items-center justify-between">
          <h2 className="text-xl font-medium">Harcama Geçmişi</h2>
        </div>

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
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowItemsPerPageDropdown(!showItemsPerPageDropdown)}
              className="bg-[#171829] border-gray-700 text-gray-300"
            >
              {itemsPerPage}
              {showItemsPerPageDropdown ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </Button>
            {showItemsPerPageDropdown && (
              <div className="absolute bottom-full mb-1 bg-[#1a1b2e] border border-gray-700 rounded-md overflow-hidden">
                {itemsPerPageOptions.map((option) => (
                  <div
                    key={option}
                    className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-gray-300"
                    onClick={() => {
                      setItemsPerPage(option)
                      setShowItemsPerPageDropdown(false)
                      setCurrentPage(1)
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
            <span className="ml-4 text-gray-400">Satır Gösteriliyor</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="bg-[#171829] border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Önceki
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="bg-[#171829] border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Sonraki
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
