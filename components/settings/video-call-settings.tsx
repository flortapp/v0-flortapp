"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Check, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"

export function VideoCallSettings() {
  const [appId, setAppId] = useState("")
  const [appCertificate, setAppCertificate] = useState("")
  const [primaryKey, setPrimaryKey] = useState("")
  const [secondaryKey, setSecondaryKey] = useState("")
  const [enableVideoCall, setEnableVideoCall] = useState(true)
  const [videoQuality, setVideoQuality] = useState("standard")
  const [maxDuration, setMaxDuration] = useState(30)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [testSuccess, setTestSuccess] = useState(false)

  const handleSaveSettings = () => {
    // Simulate saving settings
    setTimeout(() => {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1000)
  }

  const handleTestConnection = () => {
    // Simulate testing connection
    setTimeout(() => {
      setTestSuccess(true)
      setTimeout(() => setTestSuccess(false), 3000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Görüntülü Konuşma Ayarları</h2>
          <p className="text-muted-foreground">Agora.io bağlantı ve görüntülü konuşma ayarlarını yapılandırın.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="enable-video-call" className="font-medium">
            Görüntülü Konuşma Aktif
          </Label>
          <Switch id="enable-video-call" checked={enableVideoCall} onCheckedChange={setEnableVideoCall} />
        </div>
      </div>

      {saveSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Başarılı</AlertTitle>
          <AlertDescription className="text-green-700">Ayarlar başarıyla kaydedildi.</AlertDescription>
        </Alert>
      )}

      {testSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Bağlantı Başarılı</AlertTitle>
          <AlertDescription className="text-green-700">Agora.io bağlantısı başarıyla test edildi.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="credentials" className="space-y-4">
        <TabsList>
          <TabsTrigger value="credentials">Kimlik Bilgileri</TabsTrigger>
          <TabsTrigger value="quality">Kalite Ayarları</TabsTrigger>
          <TabsTrigger value="limits">Sınırlamalar</TabsTrigger>
        </TabsList>

        <TabsContent value="credentials">
          <Card>
            <CardHeader>
              <CardTitle>Agora.io Kimlik Bilgileri</CardTitle>
              <CardDescription>
                Görüntülü konuşma özelliği için Agora.io API kimlik bilgilerinizi girin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-id">App ID</Label>
                <Input
                  id="app-id"
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="app-certificate">App Sertifikası</Label>
                <Input
                  id="app-certificate"
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={appCertificate}
                  onChange={(e) => setAppCertificate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary-key">Birincil Anahtar</Label>
                <Input
                  id="primary-key"
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={primaryKey}
                  onChange={(e) => setPrimaryKey(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary-key">İkincil Anahtar</Label>
                <Input
                  id="secondary-key"
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={secondaryKey}
                  onChange={(e) => setSecondaryKey(e.target.value)}
                />
              </div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Bilgi</AlertTitle>
                <AlertDescription>
                  Bu bilgileri Agora.io kontrol panelinizden alabilirsiniz. Güvenlik için bu bilgileri kimseyle
                  paylaşmayın.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleTestConnection}>
                Bağlantıyı Test Et
              </Button>
              <Button onClick={handleSaveSettings}>Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle>Video Kalite Ayarları</CardTitle>
              <CardDescription>
                Görüntülü konuşma kalitesini ve bant genişliği kullanımını yapılandırın.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video-quality">Video Kalitesi</Label>
                <Select value={videoQuality} onValueChange={setVideoQuality}>
                  <SelectTrigger id="video-quality">
                    <SelectValue placeholder="Video kalitesini seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Düşük (480p, 15fps)</SelectItem>
                    <SelectItem value="standard">Standart (720p, 30fps)</SelectItem>
                    <SelectItem value="high">Yüksek (1080p, 30fps)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audio-quality">Ses Kalitesi</Label>
                <Select defaultValue="standard">
                  <SelectTrigger id="audio-quality">
                    <SelectValue placeholder="Ses kalitesini seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Düşük (16 kHz)</SelectItem>
                    <SelectItem value="standard">Standart (32 kHz)</SelectItem>
                    <SelectItem value="high">Yüksek (48 kHz)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bandwidth-limit">Bant Genişliği Sınırı</Label>
                <Select defaultValue="auto">
                  <SelectTrigger id="bandwidth-limit">
                    <SelectValue placeholder="Bant genişliği sınırını seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Otomatik</SelectItem>
                    <SelectItem value="low">Düşük (500 Kbps)</SelectItem>
                    <SelectItem value="medium">Orta (1 Mbps)</SelectItem>
                    <SelectItem value="high">Yüksek (2 Mbps)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="ml-auto">
                Kaydet
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="limits">
          <Card>
            <CardHeader>
              <CardTitle>Görüntülü Konuşma Sınırlamaları</CardTitle>
              <CardDescription>Görüntülü konuşma süre ve kullanım sınırlamalarını yapılandırın.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="max-duration">Maksimum Konuşma Süresi (dakika)</Label>
                  <span className="text-sm font-medium">{maxDuration} dakika</span>
                </div>
                <Slider
                  id="max-duration"
                  min={5}
                  max={60}
                  step={5}
                  value={[maxDuration]}
                  onValueChange={(value) => setMaxDuration(value[0])}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="concurrent-calls">Eş Zamanlı Görüntülü Konuşma Limiti</Label>
                <Select defaultValue="50">
                  <SelectTrigger id="concurrent-calls">
                    <SelectValue placeholder="Eş zamanlı konuşma limitini seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 konuşma</SelectItem>
                    <SelectItem value="25">25 konuşma</SelectItem>
                    <SelectItem value="50">50 konuşma</SelectItem>
                    <SelectItem value="100">100 konuşma</SelectItem>
                    <SelectItem value="unlimited">Sınırsız</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="record-calls" />
                  <Label htmlFor="record-calls">Görüntülü Konuşmaları Kaydet</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Etkinleştirildiğinde, tüm görüntülü konuşmalar Agora.io bulut depolama alanında saklanacaktır.
                </p>
              </div>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Dikkat</AlertTitle>
                <AlertDescription>
                  Görüntülü konuşma kayıtları ek maliyet gerektirebilir ve kullanıcılarınızı bilgilendirmeniz
                  gerekebilir.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="ml-auto">
                Kaydet
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
