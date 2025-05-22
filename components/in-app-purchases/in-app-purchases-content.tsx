"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TokenPackagesTab } from "@/components/in-app-purchases/token-packages-tab"
import { VipSubscriptionsTab } from "@/components/in-app-purchases/vip-subscriptions-tab"
import { GiftsTab } from "@/components/in-app-purchases/gifts-tab"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Crown, Gift } from "lucide-react"

export function InAppPurchasesContent() {
  const [activeTab, setActiveTab] = useState("token-packages")

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Uygulama İçi Satın Alım Yönetimi</h1>
        <p className="text-muted-foreground">
          Jeton paketleri, VIP üyelikler ve hediyeler gibi uygulama içi satın alım seçeneklerini yönetin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-amber-700">
              <Coins className="mr-2 h-5 w-5 text-amber-500" />
              Jeton Paketleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-amber-700">
              Kullanıcıların satın alabileceği farklı miktarlarda jeton paketleri. iOS ve Android için ayrı
              fiyatlandırma.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-purple-700">
              <Crown className="mr-2 h-5 w-5 text-purple-500" />
              VIP Üyelikler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-purple-700">
              Aylık ve yıllık abonelik seçenekleri. Özel ayrıcalıklar ve avantajlar sunan VIP üyelik planları.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-pink-700">
              <Gift className="mr-2 h-5 w-5 text-pink-500" />
              Hediyeler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-pink-700">
              Kullanıcıların birbirlerine gönderebileceği jeton bazlı hediyeler. Farklı kategoriler ve değerler.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="token-packages" className="flex items-center">
            <Coins className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Jeton Paketleri</span>
            <span className="sm:hidden">Jetonlar</span>
          </TabsTrigger>
          <TabsTrigger value="vip-subscriptions" className="flex items-center">
            <Crown className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">VIP Üyelikler</span>
            <span className="sm:hidden">VIP</span>
          </TabsTrigger>
          <TabsTrigger value="gifts" className="flex items-center">
            <Gift className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Hediyeler</span>
            <span className="sm:hidden">Hediyeler</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="token-packages">
          <TokenPackagesTab />
        </TabsContent>
        <TabsContent value="vip-subscriptions">
          <VipSubscriptionsTab />
        </TabsContent>
        <TabsContent value="gifts">
          <GiftsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
