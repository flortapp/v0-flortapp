"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockApi } from "@/services/api-mock"
import { Loader2 } from "lucide-react"

interface Bot {
  id: string
  name: string
  avatar: string
  status: string
}

export function BotsList() {
  const [bots, setBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBots = async () => {
      try {
        setLoading(true)
        const response = await mockApi.bots.getAll()
        // Sadece aktif botları filtrele
        const activeBots = response.data.filter((bot) => bot.status === "active")
        setBots(activeBots)
      } catch (err) {
        console.error("Error fetching bots:", err)
        setError("Botlar yüklenirken bir hata oluştu.")
      } finally {
        setLoading(false)
      }
    }

    fetchBots()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Botlar yükleniyor...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-primary">
            Yeniden Dene
          </button>
        </div>
      </div>
    )
  }

  if (bots.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aktif bot bulunamadı</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bots.map((bot) => (
        <Card key={bot.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={bot.avatar} alt={bot.name} />
              <AvatarFallback>{bot.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-xl">{bot.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end">
              <span className="text-sm text-muted-foreground">Aktif</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 