import type React from "react"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AppStateProvider } from "@/contexts/app-state-context"
import { MockDataProvider } from "@/components/mock-data-provider"
import { FeatureFlagsDebug } from "@/components/debug/feature-flags-debug"
import { EnvironmentDebug } from "@/components/debug/environment-debug"
import { AuthProvider } from "@/contexts/auth-context"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata = {
  title: "FlortApp Yönetim Paneli",
  description: "Flört uygulamasını yönetmek için admin paneli",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${montserrat.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AppStateProvider>
              <MockDataProvider>
                {children}
                <Toaster />
                <FeatureFlagsDebug />
                <EnvironmentDebug />
              </MockDataProvider>
            </AppStateProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
