"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { mockApi } from "@/services/api-mock"
import { Loader2 } from "lucide-react"

export function CreateBotContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    avatar: "",
    personality: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await mockApi.bots.create({
        ...formData,
        status: "active",
        createdAt: new Date().toISOString(),
      })

      router.push("/bot-management")
    } catch (error) {
      console.error("Error creating bot:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Yeni Bot Oluştur</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bot Bilgileri</CardTitle>
          <CardDescription>Yeni bir bot oluşturmak için aşağıdaki bilgileri doldurun</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Bot Adı</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Bot adını girin"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Bot açıklamasını girin"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="Bot avatar URL'sini girin"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personality">Kişilik</Label>
              <Textarea
                id="personality"
                name="personality"
                value={formData.personality}
                onChange={handleChange}
                placeholder="Bot kişiliğini tanımlayın"
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/bot-management")}
              >
                İptal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Bot Oluştur
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 