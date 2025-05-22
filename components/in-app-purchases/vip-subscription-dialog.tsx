"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface VipSubscriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (selectedPlan: string) => void
  isLoading: boolean
}

export function VipSubscriptionDialog({ open, onOpenChange, onSubmit, isLoading }: VipSubscriptionDialogProps) {
  const [selectedPlan, setSelectedPlan] = React.useState<string>("monthly")

  const handleSubmit = () => {
    onSubmit(selectedPlan)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>VIP Aboneliği</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plan">Abonelik Planı Seçin</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger id="plan">
                  <SelectValue placeholder="Plan seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Vip Aylık</SelectItem>
                  <SelectItem value="quarterly">Vip 3 Aylık</SelectItem>
                  <SelectItem value="yearly">Vip Yıllık</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "İşleniyor..." : "Onayla"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
