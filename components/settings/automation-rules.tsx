"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Clock, MessageSquare, User, AlertTriangle } from "lucide-react"

export function AutomationRules() {
  const [autoInitiateConversation, setAutoInitiateConversation] = useState(true)
  const [autoEscalateKeywords, setAutoEscalateKeywords] = useState("yardım\ndestek\ncanlı\ninsan")
  const [autoEscalateAfterMessages, setAutoEscalateAfterMessages] = useState(20)
  const [autoRespondToKeywords, setAutoRespondToKeywords] = useState(true)

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Otomasyon Kuralları</h3>
        <p className="text-sm text-muted-foreground">
          Botların otomatik davranışlarını ve yükseltme kurallarını yapılandırın.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="auto-initiate" className="font-medium">
                  Otomatik Konuşma Başlatma
                </Label>
              </div>
              <Switch
                id="auto-initiate"
                checked={autoInitiateConversation}
                onCheckedChange={setAutoInitiateConversation}
              />
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              Botların yeni kullanıcılarla otomatik olarak konuşma başlatmasına izin ver
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="cooldown-period" className="font-medium">
                  Bekleme Süresi (Dakika)
                </Label>
              </div>
              <Input id="cooldown-period" type="number" min={1} max={120} defaultValue={15} />
              <p className="text-sm text-muted-foreground">Bir konuşma başlattıktan sonra beklenecek süre</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="daily-limit" className="font-medium">
                  Günlük Başlatma Limiti
                </Label>
              </div>
              <Input id="daily-limit" type="number" min={1} max={100} defaultValue={20} />
              <p className="text-sm text-muted-foreground">Botun günde başlatabileceği maksimum konuşma sayısı</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="auto-escalate-keywords" className="font-medium">
                  Otomatik Yükseltme Anahtar Kelimeleri
                </Label>
              </div>
            </div>
            <Textarea
              id="auto-escalate-keywords"
              placeholder="Her satıra bir anahtar kelime yazın"
              value={autoEscalateKeywords}
              onChange={(e) => setAutoEscalateKeywords(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-sm text-muted-foreground">
              Kullanıcı bu kelimeleri kullandığında, konuşma otomatik olarak yükseltilir
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="auto-escalate-messages" className="font-medium">
                  Mesaj Sayısı Sonrası Yükselt
                </Label>
              </div>
              <Input
                id="auto-escalate-messages"
                type="number"
                min={5}
                max={100}
                value={autoEscalateAfterMessages}
                onChange={(e) => setAutoEscalateAfterMessages(Number(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Belirtilen mesaj sayısına ulaşıldığında konuşmayı otomatik olarak yükselt
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="auto-respond-keywords" className="font-medium">
                  Anahtar Kelimelere Otomatik Yanıt
                </Label>
              </div>
              <Switch
                id="auto-respond-keywords"
                checked={autoRespondToKeywords}
                onCheckedChange={setAutoRespondToKeywords}
              />
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              Belirli anahtar kelimelere özel yanıtlar ver (fiyat, ödeme, yardım vb.)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
