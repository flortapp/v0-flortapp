"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import type { VipSubscription } from "@/types/in-app-purchase"

interface VipSubscriptionDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  subscription: VipSubscription | null
}

export function VipSubscriptionDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  subscription,
}: VipSubscriptionDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!subscription) return

    setIsDeleting(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      console.error("VIP üyelik silinirken hata oluştu:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!subscription) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            VIP Üyelik Paketini Sil
          </DialogTitle>
          <DialogDescription>
            Bu işlem geri alınamaz. Bu VIP üyelik paketini silmek istediğinizden emin misiniz?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-md bg-red-50 p-4 border border-red-100">
            <h3 className="text-sm font-medium text-red-800">{subscription.title}</h3>
            <p className="mt-1 text-sm text-red-700">{subscription.description || "Açıklama bulunmuyor."}</p>
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                {subscription.subscriptionPeriod === "monthly"
                  ? "Aylık"
                  : subscription.subscriptionPeriod === "quarterly"
                    ? "3 Aylık"
                    : subscription.subscriptionPeriod === "biannual"
                      ? "6 Aylık"
                      : subscription.subscriptionPeriod === "annual"
                        ? "Yıllık"
                        : subscription.subscriptionPeriod}
              </span>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p>Bu VIP üyelik paketini sildiğinizde:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Paket mobil uygulamada artık görüntülenmeyecek</li>
              <li>Mevcut aboneler etkilenmeyecek, ancak yenileme sırasında sorun yaşayabilirler</li>
              <li>Paket istatistikleri ve geçmiş veriler korunacak</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            İptal
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Siliniyor..." : "Evet, Sil"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
