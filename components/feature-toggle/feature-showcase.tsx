import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { isFeatureEnabled } from "@/config/feature-flags"

export function FeatureShowcase() {
  const features = [
    {
      name: "Analitik",
      path: "ENABLE_ANALYTICS",
      description: "Kullanıcı davranışlarını ve uygulama performansını izleme",
    },
    {
      name: "Bildirimler",
      path: "ENABLE_NOTIFICATIONS",
      description: "Kullanıcılara önemli olaylar hakkında bildirim gönderme",
    },
    {
      name: "Toplu Kullanıcı İşlemleri",
      path: "USER_MANAGEMENT.ENABLE_BULK_OPERATIONS",
      description: "Birden fazla kullanıcıya aynı anda işlem yapabilme",
    },
    {
      name: "Kullanıcı Verisi Dışa Aktarma",
      path: "USER_MANAGEMENT.ENABLE_USER_EXPORT",
      description: "Kullanıcı verilerini CSV veya Excel formatında dışa aktarma",
    },
    {
      name: "Gelişmiş Kullanıcı Filtreleme",
      path: "USER_MANAGEMENT.ENABLE_ADVANCED_FILTERS",
      description: "Karmaşık kriterlerle kullanıcıları filtreleme",
    },
    {
      name: "Bot AI Önerileri",
      path: "BOT_MANAGEMENT.ENABLE_AI_SUGGESTIONS",
      description: "Botlar için AI destekli yanıt önerileri",
    },
    {
      name: "Bot Şablon Kütüphanesi",
      path: "BOT_MANAGEMENT.ENABLE_TEMPLATE_LIBRARY",
      description: "Önceden hazırlanmış bot şablonları",
    },
    {
      name: "Bot Performans Metrikleri",
      path: "BOT_MANAGEMENT.ENABLE_PERFORMANCE_METRICS",
      description: "Botların performansını ölçme ve analiz etme",
    },
    {
      name: "Dosya Paylaşımı",
      path: "CHAT.ENABLE_FILE_SHARING",
      description: "Sohbetlerde dosya paylaşımı",
    },
    {
      name: "Video Sohbet",
      path: "CHAT.ENABLE_VIDEO_CHAT",
      description: "Kullanıcılar arasında video sohbeti",
    },
    {
      name: "Yazma Göstergeleri",
      path: "CHAT.ENABLE_TYPING_INDICATORS",
      description: "Kullanıcının yazma durumunu gösterme",
    },
    {
      name: "Karanlık Mod",
      path: "UI.ENABLE_DARK_MODE",
      description: "Karanlık tema desteği",
    },
    {
      name: "Animasyonlar",
      path: "UI.ENABLE_ANIMATIONS",
      description: "UI animasyonları ve geçişleri",
    },
    {
      name: "Özel Temalar",
      path: "UI.ENABLE_CUSTOM_THEMES",
      description: "Kullanıcı tanımlı temalar",
    },
    {
      name: "Supabase Realtime Jeton Senkronizasyonu",
      path: "SUPABASE.ENABLE_REALTIME_TOKEN_SYNC",
      description: "Supabase Realtime ile jeton değişikliklerini gerçek zamanlı senkronize etme",
      highlight: true, // Özellikle vurgulanacak
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <Card
          key={feature.path}
          className={feature.highlight && !isFeatureEnabled(feature.path) ? "border-red-500" : ""}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{feature.name}</CardTitle>
              <Badge
                variant={isFeatureEnabled(feature.path) ? "default" : "outline"}
                className={
                  isFeatureEnabled(feature.path)
                    ? "bg-green-500"
                    : feature.highlight
                      ? "bg-red-100 text-red-800 border-red-200"
                      : ""
                }
              >
                {isFeatureEnabled(feature.path) ? "Aktif" : "Devre Dışı"}
              </Badge>
            </div>
            <CardDescription>{feature.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Feature Flag: <code>{feature.path}</code>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
