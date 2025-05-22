"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [envStatus, setEnvStatus] = useState<{ hasUrl: boolean; hasKey: boolean }>({ hasUrl: false, hasKey: false })
  const { signIn } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const { user, loading } = useAuth()

  // Check environment variables on component mount
  useEffect(() => {
    const checkEnv = () => {
      const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
      const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      setEnvStatus({ hasUrl, hasKey })

      if (!hasUrl || !hasKey) {
        console.error("Missing Supabase environment variables")
      }
    }

    checkEnv()
  }, [])

  useEffect(() => {
    if (user && !loading) {
      console.log("User detected, redirecting to home")
      router.push("/")
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // For this specific admin account
    if (username === "Admin" && password === "onurapp123") {
      // Use the email format that Supabase expects
      const email = "admin@flortapp.com" // You should create this account in Supabase

      try {
        console.log("Attempting to sign in...")
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

          // Use direct window.location navigation
          window.location.href = "/"
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>FlortApp Yönetim Paneli</CardTitle>
          <CardDescription>Lütfen giriş yapın</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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

            {/* Show environment variable status for debugging */}
            {(!envStatus.hasUrl || !envStatus.hasKey) && (
              <div className="text-xs text-red-500 mt-2">
                <p>Çevre değişkenleri eksik:</p>
                <p>NEXT_PUBLIC_SUPABASE_URL: {envStatus.hasUrl ? "Mevcut" : "Eksik"}</p>
                <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {envStatus.hasKey ? "Mevcut" : "Eksik"}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
