"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Clock, MessageSquare, Zap } from "lucide-react"

export function BotResponseSettings() {
  const [typingIndicator, setTypingIndicator] = useState(true)
  const [responseDelay, setResponseDelay] = useState([3]) // saniye cinsinden
  const [messageFrequency, setMessageFrequency] = useState("medium")
  const [maxMessagesPerDay, setMaxMessagesPerDay] = useState(50)
  const [randomizeResponses, setRandomizeResponses] = useState(true)

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Bot Yanıt Ayarları</h3>
        <p className="text-sm text-muted-foreground">Botların kullanıcılara nasıl yanıt vereceğini yapılandırın.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="typing-indicator" className="font-medium">
                  Yazıyor Göstergesi
                </Label>
              </div>
              <Switch id="typing-indicator" checked={typingIndicator} onCheckedChange={setTypingIndicator} />
            </div>
            <p className="text-sm text-muted-foreground pl-6">Bot yanıt verirken "yazıyor..." göstergesini göster</p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label className="font-medium">Yanıt Gecikmesi</Label>
              </div>
              <div className="pl-6 space-y-4">
                <Slider value={responseDelay} min={1} max={10} step={0.5} onValueChange={setResponseDelay} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Hızlı (1s)</span>
                  <span>Orta ({responseDelay}s)</span>
                  <span>Yavaş (10s)</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Bot yanıtları arasındaki gecikme süresi: {responseDelay} saniye
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="message-frequency" className="font-medium">
                  Mesaj Sıklığı
                </Label>
              </div>
              <Select value={messageFrequency} onValueChange={setMessageFrequency}>
                <SelectTrigger id="message-frequency">
                  <SelectValue placeholder="Mesaj sıklığı seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Düşük (Nadiren)</SelectItem>
                  <SelectItem value="medium">Orta (Normal)</SelectItem>
                  <SelectItem value="high">Yüksek (Sık)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Botun kullanıcıya ne sıklıkta mesaj göndereceğini belirler
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="max-messages" className="font-medium">
                  Günlük Maksimum Mesaj
                </Label>
              </div>
              <Input
                id="max-messages"
                type="number"
                min={1}
                max={200}
                value={maxMessagesPerDay}
                onChange={(e) => setMaxMessagesPerDay(Number(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">Bir botun günde gönderebileceği maksimum mesaj sayısı</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="randomize-responses" className="font-medium">
                  Yanıtları Rastgele Seç
                </Label>
              </div>
              <Switch id="randomize-responses" checked={randomizeResponses} onCheckedChange={setRandomizeResponses} />
            </div>
            <p className="text-sm text-muted-foreground pl-6">Şablonlar arasından rastgele yanıt seçimi yap</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
