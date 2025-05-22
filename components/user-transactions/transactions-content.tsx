"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LiveChatButton } from "./live-chat-button"
import { Button } from "@/components/ui/button"
import { CreditCard, Download, History } from "lucide-react"

// Mock transaction data
const transactions = [
  {
    id: "1",
    date: "2023-05-15",
    amount: "250 TL",
    description: "Jeton Paketi - 500 Jeton",
    status: "completed",
  },
  {
    id: "2",
    date: "2023-04-28",
    amount: "100 TL",
    description: "Jeton Paketi - 200 Jeton",
    status: "completed",
  },
  {
    id: "3",
    date: "2023-03-10",
    amount: "500 TL",
    description: "VIP Üyelik - 1 Ay",
    status: "completed",
  },
]

export function TransactionsContent() {
  const [isVip] = useState(true) // In a real app, this would come from user data
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)

  const handleTransactionClick = (id: string) => {
    setSelectedTransaction(id === selectedTransaction ? null : id)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">İşlemlerim</h1>
        <div className="flex gap-2">
          <LiveChatButton
            isVip={isVip}
            context={selectedTransaction ? `İşlem #${selectedTransaction} hakkında yardım` : undefined}
          />
          <Button variant="outline">
            <History className="mr-2 h-4 w-4" />
            Geçmiş İşlemler
          </Button>
        </div>
      </div>

      <Tabs defaultValue="purchases">
        <TabsList className="mb-4">
          <TabsTrigger value="purchases">Satın Alımlar</TabsTrigger>
          <TabsTrigger value="subscriptions">Abonelikler</TabsTrigger>
          <TabsTrigger value="credits">Jeton Bakiyesi</TabsTrigger>
        </TabsList>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Satın Alım Geçmişi</CardTitle>
              <CardDescription>Tüm satın alımlarınızın listesi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTransaction === transaction.id ? "border-[#fa2674] bg-[#fa2674]/5" : ""
                    }`}
                    onClick={() => handleTransactionClick(transaction.id)}
                  >
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold">{transaction.amount}</p>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedTransaction && (
                <div className="mt-4 p-4 border border-[#fa2674] rounded-lg bg-[#fa2674]/5">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">İşlem #{selectedTransaction} hakkında yardıma mı ihtiyacınız var?</p>
                    <LiveChatButton
                      isVip={isVip}
                      context={`İşlem #${selectedTransaction} hakkında yardım`}
                      conversationId={`trans-${selectedTransaction}`}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Aktif Abonelikler</CardTitle>
              <CardDescription>Mevcut abonelikleriniz ve yenileme tarihleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center">
                {isVip ? (
                  <div className="space-y-4">
                    <div className="inline-block p-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full">
                      <CreditCard className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">VIP Üyelik</h3>
                    <p>Bitiş Tarihi: 10 Haziran 2023</p>
                    <div className="flex justify-center gap-4">
                      <Button>Aboneliği Yenile</Button>
                      <LiveChatButton
                        isVip={true}
                        context="VIP üyelik hakkında bilgi"
                        conversationId="vip-subscription"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">Aktif aboneliğiniz bulunmamaktadır.</p>
                    <div className="flex justify-center gap-4">
                      <Button>VIP Üyelik Satın Al</Button>
                      <LiveChatButton context="VIP üyelik satın alma hakkında bilgi" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits">
          <Card>
            <CardHeader>
              <CardTitle>Jeton Bakiyesi</CardTitle>
              <CardDescription>Mevcut jeton bakiyeniz ve satın alma seçenekleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 space-y-6">
                <div className="inline-block p-6 bg-[#2b2c46] rounded-full">
                  <h3 className="text-3xl font-bold">1250</h3>
                  <p className="text-sm text-muted-foreground">Jeton</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-[#2b2c46]">
                    <CardContent className="p-4 text-center space-y-2">
                      <h4 className="font-bold">200 Jeton</h4>
                      <p className="text-2xl font-bold">100 TL</p>
                      <Button className="w-full">Satın Al</Button>
                    </CardContent>
                  </Card>

                  <Card className="border-[#2b2c46] bg-gradient-to-b from-[#2b2c46] to-[#171829]">
                    <CardContent className="p-4 text-center space-y-2">
                      <h4 className="font-bold">500 Jeton</h4>
                      <p className="text-2xl font-bold">250 TL</p>
                      <p className="text-xs text-green-400">%10 Bonus</p>
                      <Button className="w-full bg-[#fa2674] hover:bg-[#e01e65]">Satın Al</Button>
                    </CardContent>
                  </Card>

                  <Card className="border-[#2b2c46]">
                    <CardContent className="p-4 text-center space-y-2">
                      <h4 className="font-bold">1000 Jeton</h4>
                      <p className="text-2xl font-bold">450 TL</p>
                      <p className="text-xs text-green-400">%20 Bonus</p>
                      <Button className="w-full">Satın Al</Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <LiveChatButton context="Jeton satın alma hakkında bilgi" isVip={isVip} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
