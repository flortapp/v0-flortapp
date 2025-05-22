"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface UserCreditsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any | null
  onSave: (jetons: number) => void
}

export function UserCreditsDialog({ open, onOpenChange, user, onSave }: UserCreditsDialogProps) {
  const [jetons, setJetons] = useState(0)
  const [jetonType, setJetonType] = useState("add")
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      setJetons(0)
      setJetonType("add")
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!onSave || typeof onSave !== "function") {
      toast({
        title: "Hata",
        description: "Jeton tahsis işlemi şu anda kullanılamıyor.",
        variant: "destructive",
      })
      return
    }

    const finalJetons = jetonType === "add" ? jetons : -jetons
    onSave(finalJetons)
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#171829]">
        <DialogHeader>
          <DialogTitle>
            <span className="text-gradient-flortapp">{user.name}</span>'a Jeton Tahsis Et
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="jetonType">İşlem Türü</Label>
                <Select value={jetonType} onValueChange={setJetonType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="İşlem türü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Jeton Ekle</SelectItem>
                    <SelectItem value="remove">Jeton Çıkar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="jetons">Jeton Miktarı</Label>
                <Input
                  id="jetons"
                  type="number"
                  min="1"
                  value={jetons}
                  onChange={(e) => setJetons(Number.parseInt(e.target.value) || 0)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="currentJetons">Mevcut Jetonlar</Label>
                <Input
                  id="currentJetons"
                  value={user.credits || 0}
                  disabled
                  className="mt-1 bg-gray-100 dark:bg-gray-800"
                />
              </div>
              <div>
                <Label htmlFor="newJetons">Yeni Jeton Bakiyesi</Label>
                <Input
                  id="newJetons"
                  value={jetonType === "add" ? (user.credits || 0) + jetons : (user.credits || 0) - jetons}
                  disabled
                  className="mt-1 bg-gray-100 dark:bg-gray-800"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Jetonları Tahsis Et
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
