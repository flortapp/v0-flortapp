"use client"

import { Button } from "@/components/ui/button"
import { Menu, User, Bell, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Menüyü Aç/Kapat</span>
      </Button>
      <div className="w-full flex-1">
        {/* 
          Arama çubuğu kaldırıldı.
          
          İşlevi:
          - Uygulama içerisindeki kullanıcılar, botlar, konuşmalar ve diğer içerikleri aramak için kullanılıyordu
          - Mobil cihazlarda gizleniyor, orta ve büyük ekranlarda görünüyordu (hidden md:block)
          - Arama sonuçları gerçek zamanlı olarak filtreleniyordu
          - Kullanıcı deneyimini iyileştirmek için hızlı erişim sağlıyordu
        */}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Bildirimler</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full border border-muted-foreground/40">
              <User className="h-5 w-5" />
              <span className="sr-only">Kullanıcı Menüsü</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user ? user.username : "Hesap"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                console.log("Logout clicked")
                signOut()
              }}
              className="cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
