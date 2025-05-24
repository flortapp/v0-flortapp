import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { AppStateProvider } from "@/contexts/app-state-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FlortApp Admin Panel",
  description: "FlortApp Admin Panel",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AppStateProvider>
            {children}
            <Toaster />
          </AppStateProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
