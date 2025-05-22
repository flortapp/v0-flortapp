"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Clock, AlertTriangle, MessageSquare, User, Coins, KeyRound } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function BotUpgradeSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("urgent")

  const handleSave = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Ayarlar kaydedildi",
        description: "Bot yükseltme ayarları başarıyla güncellendi.",
        variant: "success",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Bot Yükseltme Ayarları</h2>
          <p className="text-muted-foreground">
            Botların otomatik yükseltme koşullarını ve bildirim ayarlarını yapılandırın.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </Button>
      </div>

      {/* Combined Upgrade Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Yükseltme Ayarları</CardTitle>
          <CardDescription>Yükseltme koşullarını ve bildirim ayarlarını yapılandırın</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Condition Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Yükseltme Koşulları ve Bildirim Türleri</h3>
            <p className="text-sm text-muted-foreground">
              Her koşul için hangi bildirim türünün tetikleneceğini belirleyin.
            </p>

            {/* VIP Membership Condition */}
            <div className="space-y-2 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="vip-condition" defaultChecked={true} />
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-amber-500" />
                    <Label htmlFor="vip-condition" className="font-medium">
                      VIP Üyelik Durumu
                    </Label>
                  </div>
                </div>
                <Select defaultValue="important">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Bildirim türü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500">Acil</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="important">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-amber-500">Önemli</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="standard">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500">Standart</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                Kullanıcı VIP üye ise, konuşma otomatik olarak yükseltilir.
              </p>
            </div>

            {/* Jeton Balance Condition */}
            <div className="space-y-2 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="jeton-condition" defaultChecked={true} />
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-green-500" />
                    <Label htmlFor="jeton-condition" className="font-medium">
                      Jeton Bakiyesi
                    </Label>
                  </div>
                </div>
                <Select defaultValue="standard">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Bildirim türü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500">Acil</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="important">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-amber-500">Önemli</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="standard">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500">Standart</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pl-6 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Kullanıcının jeton bakiyesi belirtilen eşiği aştığında, konuşma otomatik olarak yükseltilir.
                </p>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="jeton-threshold" className="whitespace-nowrap">
                    Jeton Eşiği:
                  </Label>
                  <Input id="jeton-threshold" type="number" min="0" defaultValue="1000" className="max-w-[150px]" />
                </div>
              </div>
            </div>

            {/* Keyword Condition */}
            <div className="space-y-2 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="keyword-condition" defaultChecked={false} />
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-red-500" />
                    <Label htmlFor="keyword-condition" className="font-medium">
                      Anahtar Kelimeler
                    </Label>
                  </div>
                </div>
                <Select defaultValue="urgent">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Bildirim türü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500">Acil</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="important">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-amber-500">Önemli</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="standard">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500">Standart</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pl-6 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Kullanıcı belirtilen anahtar kelimeleri kullandığında, konuşma otomatik olarak yükseltilir.
                </p>
                <Textarea
                  placeholder="Her satıra bir anahtar kelime yazın (örn: yardım, destek, canlı, insan)"
                  className="min-h-[80px]"
                  defaultValue="yardım&#10;destek&#10;canlı&#10;insan"
                />
              </div>
            </div>

            {/* Message Quota Condition */}
            <div className="space-y-2 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="message-quota-condition" defaultChecked={true} />
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-purple-500" />
                    <Label htmlFor="message-quota-condition" className="font-medium">
                      Mesaj Kotası
                    </Label>
                  </div>
                </div>
                <Select defaultValue="standard">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Bildirim türü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500">Acil</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="important">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-amber-500">Önemli</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="standard">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500">Standart</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pl-6 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Belirli bir mesaj sayısına ulaşıldığında, konuşma otomatik olarak yükseltilir.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="message-threshold" className="text-sm font-medium">
                      Mesaj Eşiği:
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input id="message-threshold" type="number" min="5" defaultValue="20" className="max-w-[150px]" />
                      <span className="text-sm text-muted-foreground">mesaj</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quota-period" className="text-sm font-medium">
                      Zaman Dilimi:
                    </Label>
                    <Select defaultValue="daily">
                      <SelectTrigger className="max-w-[200px]">
                        <SelectValue placeholder="Zaman dilimi seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Saatlik</SelectItem>
                        <SelectItem value="daily">Günlük</SelectItem>
                        <SelectItem value="weekly">Haftalık</SelectItem>
                        <SelectItem value="monthly">Aylık</SelectItem>
                        <SelectItem value="total">Toplam (Süresiz)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">Bildirim Ayarları</h3>

            <Tabs defaultValue="urgent" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="urgent" className="flex items-center gap-2">
                  <Badge className="bg-red-500">Acil</Badge>
                  <span className="hidden sm:inline">Bildirimler</span>
                </TabsTrigger>
                <TabsTrigger value="important" className="flex items-center gap-2">
                  <Badge className="bg-amber-500">Önemli</Badge>
                  <span className="hidden sm:inline">Bildirimler</span>
                </TabsTrigger>
                <TabsTrigger value="standard" className="flex items-center gap-2">
                  <Badge className="bg-blue-500">Standart</Badge>
                  <span className="hidden sm:inline">Bildirimler</span>
                </TabsTrigger>
              </TabsList>

              {/* Urgent Notifications */}
              <TabsContent value="urgent" className="space-y-4">
                {/* Notification Preview */}
                <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                  <h3 className="text-lg font-medium mb-2">Acil Bildirim Önizleme</h3>
                  <div className="bg-white dark:bg-slate-800 border border-red-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-red-600 dark:text-red-400">Acil Yükseltme</h4>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Şimdi
                          </span>
                        </div>
                        <p className="text-sm mt-1">
                          [Bot Adı] botundan bir konuşma acil olarak yükseltildi. Kullanıcı yardım talep ediyor.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800"
                          >
                            Acil
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                          >
                            Anahtar Kelime
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Content */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="urgent-notification-template">Acil Bildirim Mesajı</Label>
                    <Textarea
                      id="urgent-notification-template"
                      placeholder="Acil bildirim mesajı şablonu"
                      className="min-h-[80px]"
                      defaultValue="[Bot Adı] botundan bir konuşma acil olarak yükseltildi. Kullanıcı yardım talep ediyor."
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="urgent-sound-enabled">Sesli Uyarı</Label>
                      <Switch id="urgent-sound-enabled" defaultChecked={true} />
                    </div>
                    <p className="text-xs text-muted-foreground">Acil yükseltme olduğunda sesli uyarı çal.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="urgent-popup">Açılır Pencere</Label>
                      <Switch id="urgent-popup" defaultChecked={true} />
                    </div>
                    <p className="text-xs text-muted-foreground">Acil yükseltme olduğunda açılır pencere göster.</p>
                  </div>
                </div>
              </TabsContent>

              {/* Important Notifications */}
              <TabsContent value="important" className="space-y-4">
                {/* Notification Preview */}
                <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                  <h3 className="text-lg font-medium mb-2">Önemli Bildirim Önizleme</h3>
                  <div className="bg-white dark:bg-slate-800 border border-amber-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                        <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-amber-600 dark:text-amber-400">Önemli Yükseltme</h4>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Şimdi
                          </span>
                        </div>
                        <p className="text-sm mt-1">
                          [Bot Adı] botundan bir VIP kullanıcı konuşması yükseltildi. Lütfen kontrol edin.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                          >
                            Önemli
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                          >
                            VIP
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Content */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="important-notification-template">Önemli Bildirim Mesajı</Label>
                    <Textarea
                      id="important-notification-template"
                      placeholder="Önemli bildirim mesajı şablonu"
                      className="min-h-[80px]"
                      defaultValue="[Bot Adı] botundan bir VIP kullanıcı konuşması yükseltildi. Lütfen kontrol edin."
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="important-sound-enabled">Sesli Uyarı</Label>
                      <Switch id="important-sound-enabled" defaultChecked={true} />
                    </div>
                    <p className="text-xs text-muted-foreground">Önemli yükseltme olduğunda sesli uyarı çal.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="important-popup">Açılır Pencere</Label>
                      <Switch id="important-popup" defaultChecked={false} />
                    </div>
                    <p className="text-xs text-muted-foreground">Önemli yükseltme olduğunda açılır pencere göster.</p>
                  </div>
                </div>
              </TabsContent>

              {/* Standard Notifications */}
              <TabsContent value="standard" className="space-y-4">
                {/* Notification Preview */}
                <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                  <h3 className="text-lg font-medium mb-2">Standart Bildirim Önizleme</h3>
                  <div className="bg-white dark:bg-slate-800 border border-blue-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-blue-600 dark:text-blue-400">Standart Yükseltme</h4>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Şimdi
                          </span>
                        </div>
                        <p className="text-sm mt-1">
                          [Bot Adı] botundan bir konuşma mesaj kotasını aştığı için yükseltildi.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                          >
                            Standart
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                          >
                            Mesaj Kotası
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Content */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="standard-notification-template">Standart Bildirim Mesajı</Label>
                    <Textarea
                      id="standard-notification-template"
                      placeholder="Standart bildirim mesajı şablonu"
                      className="min-h-[80px]"
                      defaultValue="[Bot Adı] botundan bir konuşma mesaj kotasını aştığı için yükseltildi."
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="standard-sound-enabled">Sesli Uyarı</Label>
                      <Switch id="standard-sound-enabled" defaultChecked={false} />
                    </div>
                    <p className="text-xs text-muted-foreground">Standart yükseltme olduğunda sesli uyarı çal.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="standard-popup">Açılır Pencere</Label>
                      <Switch id="standard-popup" defaultChecked={false} />
                    </div>
                    <p className="text-xs text-muted-foreground">Standart yükseltme olduğunda açılır pencere göster.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Common Display Settings */}
            <div className="space-y-4 mt-6 pt-4 border-t">
              <h3 className="text-lg font-medium">Genel Görüntüleme Ayarları</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-on-homepage">Ana Sayfada Göster</Label>
                  <Switch id="show-on-homepage" defaultChecked={true} />
                </div>
                <p className="text-xs text-muted-foreground">Yeni yükseltilen konuşmaları ana sayfada göster.</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-in-header">Başlıkta Göster</Label>
                  <Switch id="show-in-header" defaultChecked={true} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Yükseltilen konuşmaları sayfa başlığında bildirim olarak göster.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-message-count">Mesaj Sayısını Göster</Label>
                  <Switch id="show-message-count" defaultChecked={true} />
                </div>
                <p className="text-xs text-muted-foreground">Yükseltilen konuşmalarda mesaj sayısını göster.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
