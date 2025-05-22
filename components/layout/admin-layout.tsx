"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-[#f6f8fc] dark:bg-[#171829]">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div
        className={cn("flex flex-col flex-1 w-full transition-all duration-300", sidebarOpen ? "md:ml-64" : "md:ml-20")}
      >
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f6f8fc] dark:bg-[#171829] relative">{children}</main>
      </div>
    </div>
  )
}
