"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface UserEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any | null
  onSave: (userData: any) => void
}

export function UserEditDialog({ open, onOpenChange, user, onSave }: UserEditDialogProps) {
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    isActive: true,
  })

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phone: "",
        isActive: user.status === "active",
      })
    } else {
      setUserData({
        name: "",
        username: "",
        email: "",
        phone: "",
        isActive: true,
      })
    }
  }, [user, open])

  const handleChange = (field: string, value: any) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(userData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#171829]">
        <DialogHeader>
          <DialogTitle>{user ? "Kullanıcıyı Düzenle" : "Kullanıcı Oluştur"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Ad Soyad</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input
                  id="username"
                  value={userData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Cep Numarası</Label>
                <Input
                  id="phone"
                  value={userData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={userData.isActive}
                  onCheckedChange={(checked) => handleChange("isActive", checked)}
                />
                <Label htmlFor="isActive">Aktif</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-gradient-to-r from-pink-600 to-red-500 hover:from-pink-700 hover:to-red-600"
            >
              Güncelle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
