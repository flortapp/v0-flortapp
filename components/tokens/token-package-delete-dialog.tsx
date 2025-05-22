"use client"

import { AlertTriangle } from "lucide-react"
import type { TokenPackage } from "@/types/token-package"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TokenPackageDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  packageData: TokenPackage
}

export function TokenPackageDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  packageData,
}: TokenPackageDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Jeton Paketini Sil
          </AlertDialogTitle>
          <div className="text-sm text-muted-foreground">
            <div className="mb-2">
              <strong>{packageData.title}</strong> paketini silmek istediğinizden emin misiniz?
            </div>
            <div className="mb-2">
              Bu paket <strong>{packageData.tokenAmount} jeton</strong> içeriyor ve fiyatı{" "}
              <strong>
                {packageData.price} {packageData.currency || "TL"}
              </strong>
              .
            </div>
            <div className="text-red-500">Bu işlem geri alınamaz.</div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Sil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
