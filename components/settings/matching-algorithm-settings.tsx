"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export function MatchingAlgorithmSettings() {
  const { toast } = useToast()
  const [minAgeGap, setMinAgeGap] = useState(-5)
  const [maxAgeGap, setMaxAgeGap] = useState(20)
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    // Simulating API call
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Ayarlar kaydedildi",
        description: "Eşleştirme algoritması ayarları başarıyla güncellendi.",
        variant: "success",
      })
    }, 1000)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Eşleştirme Parametreleri</CardTitle>
          <CardDescription>
            Kullanıcıları eşleştirmek için kullanılan algoritma parametrelerini ayarlayın.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Eşleştirme Kriteri</AlertTitle>
            <AlertDescription>
              Eşleştirmeler sadece kullanıcıların ve botların ilişki hedeflerine göre yapılmaktadır. Aynı ilişki
              hedefine sahip kullanıcılar ve botlar eşleştirilir.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Label className="text-base">Yaş Aralığı Ayarları</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-age-gap">Minimum Yaş Farkı</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="min-age-gap"
                    type="number"
                    value={minAgeGap}
                    onChange={(e) => setMinAgeGap(Number.parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">yıl</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Kullanıcıdan kaç yaş küçük botların eşleştirileceği. Negatif değer kullanıcıdan küçük demektir.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-age-gap">Maksimum Yaş Farkı</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="max-age-gap"
                    type="number"
                    value={maxAgeGap}
                    onChange={(e) => setMaxAgeGap(Number.parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">yıl</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Kullanıcıdan kaç yaş büyük botların eşleştirileceği. Pozitif değer kullanıcıdan büyük demektir.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm">
                Örnek: 30 yaşındaki bir kullanıcı için{" "}
                <span className="font-medium">
                  {30 + minAgeGap} - {30 + maxAgeGap}
                </span>{" "}
                yaş aralığındaki botlar eşleştirilecek.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Gelişmiş Ayarlar</CardTitle>
            <CardDescription>Eşleştirme algoritmasının gelişmiş ayarlarını yapılandırın.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="prioritize-active" className="flex flex-col space-y-1">
                <span>Aktif Kullanıcıları Önceliklendir</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Daha aktif kullanıcıları eşleştirmelerde öne çıkarın.
                </span>
              </Label>
              <Switch id="prioritize-active" defaultChecked />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="new-user-boost" className="flex flex-col space-y-1">
                <span>Yeni Kullanıcı Desteği</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Yeni kullanıcıları daha fazla eşleştirmeye dahil edin.
                </span>
              </Label>
              <Switch id="new-user-boost" defaultChecked />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="common-interests" className="flex flex-col space-y-1">
                <span>Ortak İlgi Alanlarını Göster</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Eşleşmelerde ortak ilgi alanlarını vurgulayın.
                </span>
              </Label>
              <Switch id="common-interests" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
          </Button>
        </div>
      </div>
    </div>
  )
}
