"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    console.log("Login attempt started")

    if (username === "Admin" && password === "onurapp123") {
      const email = "admin@flortapp.com"

      try {
        console.log("Calling signIn...")
        const { error } = await signIn(email, password)

        if (error) {
          console.error("Sign in error:", error)
          toast({
            title: "Giriş başarısız",
            description: "Kullanıcı adı veya şifre hatalı.",
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
    } else {
      toast({
        title: "Giriş başarısız",
        description: "Kullanıcı adı veya şifre hatalı.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Giriş</h1>
        <p className="text-gray-500 dark:text-gray-400">Yönetim paneline erişmek için giriş yapın</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Kullanıcı Adı</Label>
          <Input
            id="username"
            placeholder="Kullanıcı adınızı girin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Şifre</Label>
          <Input
            id="password"
            type="password"
            placeholder="Şifrenizi girin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>
    </div>
  )
}
