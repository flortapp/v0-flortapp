"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Bot,
  PlusCircle,
  List,
  MessageSquare,
  Settings,
  ShoppingCart,
  Send,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState("")
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Define menu items with their sub-items
  const menuItems = [
    {
      id: "dashboard",
      label: "Gösterge Paneli",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      id: "users",
      label: "Kullanıcılar",
      icon: Users,
      href: "/users",
    },
    {
      id: "dating-bot",
      label: "Dating Bot",
      icon: Bot,
      subItems: [
        {
          id: "create-bot",
          label: "Bot Oluştur",
          icon: PlusCircle,
          href: "/bot-management/create",
        },
        {
          id: "bot-list",
          label: "Bot Listesi",
          icon: List,
          href: "/bot-management",
        },
        {
          id: "bot-conversations",
          label: "Bot Konuşmaları",
          icon: MessageSquare,
          href: "/bot-conversations",
        },
      ],
    },
    {
      id: "chat",
      label: "Sohbet",
      icon: MessageSquare,
      href: "/chat",
    },
    {
      id: "in-app-purchases",
      label: "Uygulama İçi Satın Alım",
      icon: ShoppingCart,
      href: "/in-app-purchases",
    },
    {
      id: "bulk-message",
      label: "Toplu Mesaj",
      icon: Send,
      href: "/bulk-message",
    },
    {
      id: "settings",
      label: "Ayarlar",
      icon: Settings,
      href: "/settings",
    },
  ]

  // Check if the current path is in the Dating Bot category
  const isDatingBotPath = (path: string) => {
    const datingBotItem = menuItems.find((item) => item.id === "dating-bot")
    if (!datingBotItem || !("subItems" in datingBotItem)) return false

    return datingBotItem.subItems.some((subItem) => path === subItem.href || path.startsWith(subItem.href + "/"))
  }

  useEffect(() => {
    // Get the current path
    const path = pathname || "/"
    const pathSegment = path.split("/")[1] || ""
    const currentPath = pathSegment === "" ? "dashboard" : pathSegment

    // Set the active item
    setActiveItem(currentPath)

    // Check if we're in the Dating Bot section
    const datingBotPaths = ["create-bot", "bot-list", "bot-conversations"]
    const isInDatingBotSection = datingBotPaths.includes(currentPath)

    // Auto-expand the Dating Bot category if we're in its section
    if (isInDatingBotSection && !expandedItems.includes("dating-bot")) {
      setExpandedItems((prev) => [...prev, "dating-bot"])
    }
  }, [pathname, expandedItems])

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300",
        open ? "w-64" : "w-20",
        "bg-[#171829] text-white",
      )}
    >
      <div className="flex h-20 items-center justify-between px-4">
        {open ? (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-md bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center mr-2">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-medium">FlortApp</h1>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-md bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
            <Flame className="h-6 w-6 text-white" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex text-white hover:bg-[#2b2c46]"
          onClick={() => setOpen(!open)}
        >
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>
      </div>
      <div className="border-t border-[#2b2c46]"></div>
      <div className="px-3 py-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              {"subItems" in item ? (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className={cn(
                      "flex items-center w-full p-2 rounded-lg",
                      activeItem === item.id
                        ? "bg-gradient-to-r from-orange-600 to-red-500 text-white"
                        : "hover:bg-[#2b2c46]",
                      !open && "justify-center",
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", !open && "mx-auto")} />
                    {open && (
                      <>
                        <span className="ml-3 flex-1 text-left">{item.label}</span>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expandedItems.includes(item.id) && "transform rotate-90",
                          )}
                        />
                      </>
                    )}
                  </button>

                  {open && expandedItems.includes(item.id) && (
                    <ul className="pl-4 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.id}>
                          <Link
                            href={subItem.href}
                            className={cn(
                              "flex items-center p-2 rounded-lg",
                              activeItem === subItem.id
                                ? "bg-gradient-to-r from-orange-600 to-red-500 text-white"
                                : "hover:bg-[#2b2c46]",
                            )}
                            onClick={() => setActiveItem(subItem.id)}
                          >
                            <span className="ml-3">{subItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center p-2 rounded-lg",
                    activeItem === item.id
                      ? "bg-gradient-to-r from-orange-600 to-red-500 text-white"
                      : "hover:bg-[#2b2c46]",
                    !open && "justify-center",
                  )}
                  onClick={() => setActiveItem(item.id)}
                >
                  <item.icon className={cn("h-5 w-5", !open && "mx-auto")} />
                  {open && <span className="ml-3">{item.label}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
