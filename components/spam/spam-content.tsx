"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Info, Search, Filter, RefreshCw } from "lucide-react"
import SpamTable from "./spam-table"
import BlockedTable from "./blocked-table"

const SpamContent = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Bilgilendirme</AlertTitle>
        <AlertDescription>
          Bu sayfada, sistem tarafından otomatik olarak tespit edilen spam içerikler ve engellenen kullanıcılar
          listelenmektedir. İçeriği görüntülemek için "İçeriği Görüntüle" butonuna tıklayabilirsiniz.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Spam Yönetimi</CardTitle>
          <CardDescription>
            Sistem tarafından tespit edilen spam içerikleri ve engellenen kullanıcıları yönetin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Kullanıcı adı, içerik veya ID ile ara..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="message">Mesajlar</SelectItem>
                  <SelectItem value="profile">Profiller</SelectItem>
                  <SelectItem value="photo">Fotoğraflar</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Yenile
              </Button>
            </div>
          </div>

          <Tabs defaultValue="spam">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="spam">Spam İçerikler</TabsTrigger>
              <TabsTrigger value="blocked">Engellenen Kullanıcılar</TabsTrigger>
            </TabsList>
            <TabsContent value="spam" className="mt-4">
              <SpamTable searchQuery={searchQuery} filterType={filterType} />
            </TabsContent>
            <TabsContent value="blocked" className="mt-4">
              <BlockedTable searchQuery={searchQuery} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default SpamContent
