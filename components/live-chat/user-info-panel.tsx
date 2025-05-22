"use client"

import { Calendar, MapPin, Coins, Clock, User, Mail } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  birthDate?: string
  location?: string
  coins?: string
  lastActive?: string
  online: boolean
  profileData?: {
    birthDate: string
    location: string
    coins: string
  }
  phone?: string
}

interface UserInfoPanelProps {
  user: User
}

export function UserInfoPanel({ user }: UserInfoPanelProps) {
  // Kullanıcı profil bilgilerini al (eski veya yeni format)
  const birthDate = user.profileData?.birthDate || user.birthDate || "Belirtilmemiş"
  const location = user.profileData?.location || user.location || "Belirtilmemiş"
  const coins = user.profileData?.coins || user.coins || "0 Coin"
  const phone = user.phone || "Belirtilmemiş"

  return (
    <div className="border-b border-gray-200 p-3 bg-gray-50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-gray-500" />
        <div>
          <span className="text-gray-500 block text-xs">Kullanıcı</span>
          <span className="font-medium text-gray-900">{user.name}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-gray-500" />
        <div>
          <span className="text-gray-500 block text-xs">E-posta</span>
          <span className="font-medium text-gray-900">{user.email}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <div>
          <span className="text-gray-500 block text-xs">Doğum Tarihi</span>
          <span className="font-medium text-gray-900">{birthDate}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-gray-500" />
        <div>
          <span className="text-gray-500 block text-xs">Konum</span>
          <span className="font-medium text-gray-900">{location}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Coins className="h-4 w-4 text-gray-500" />
        <div>
          <span className="text-gray-500 block text-xs">Coin</span>
          <span className="font-medium text-gray-900">{coins}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-gray-500" />
        <div>
          <span className="text-gray-500 block text-xs">Son Aktif</span>
          <span className="font-medium text-gray-900">{user.lastActive || "Belirtilmemiş"}</span>
        </div>
      </div>
    </div>
  )
}
