"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async () => {
    setIsLoading(true)

    // Use predefined credentials from Supabase
    const email = "admin@flortapp.com"
    const password = "onurapp123"

    try {
      console.log("Attempting to sign in with predefined credentials...")
      const { error } = await signIn(email, password)

      if (error) {
        console.error("Sign in error:", error)
        toast({
          title: "Giriş başarısız",
          description: "Kimlik doğrulama hatası oluştu.",
          variant: "destructive",
        })
      } else {
        console.log("Sign in successful")
        toast({
          title: "Giriş başarılı",
          description: "Yönetim paneline yönlendiriliyorsunuz.",
        })

        // Force navigation with window.location after a delay
        setTimeout(() => {
          console.log("Forcing navigation to dashboard")
          window.location.href = "/"
        }, 1500)
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Giriş hatası",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">FlortApp Yönetim Paneli</h1>
        <p className="text-gray-500 dark:text-gray-400">Yönetim paneline erişmek için giriş yapın</p>
      </div>
      <div className="space-y-4">
        <Button onClick={handleLogin} className="w-full" disabled={isLoading} size="lg">
          {isLoading ? "Giriş yapılıyor..." : "Yönetim Paneline Giriş Yap"}
        </Button>
        <p className="text-xs text-center text-gray-500">Kimlik bilgileri otomatik olarak kullanılacaktır</p>
      </div>
    </div>
  )
}
