"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreVertical, PhoneCall, Video, UserPlus, ChevronLeft, ChevronRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChatHeaderProps {
  user: any
  bot: any
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export function ChatHeader({ user, bot, onToggleSidebar, sidebarOpen }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={onToggleSidebar}>
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>

        <Button variant="ghost" size="icon" className="mr-2 hidden md:flex" onClick={onToggleSidebar}>
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>

        <div className="flex items-center">
          <div className="relative mr-3">
            <Avatar className="h-10 w-10 border-2 border-orange-500">
              <AvatarImage
                src={user.avatar || `/abstract-geometric-shapes.png?height=40&width=40&query=${user.name}`}
                alt={user.name}
              />
              <AvatarFallback className="bg-blue-500 text-white">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {user.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>

          <div>
            <div className="flex items-center">
              <h2 className="text-sm font-medium text-gray-900">{user.name}</h2>
              <span className="ml-2 text-xs text-gray-500">
                {user.online ? "Çevrimiçi" : `Son görülme: ${user.lastActive}`}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Bot: {bot.name} ({bot.location})
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
          <PhoneCall className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
          <UserPlus className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Kullanıcı Profilini Görüntüle</DropdownMenuItem>
            <DropdownMenuItem>Konuşma Geçmişini Dışa Aktar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Konuşmayı Sil</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
