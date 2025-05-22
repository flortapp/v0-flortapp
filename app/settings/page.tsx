import { AdminLayout } from "@/components/layout/admin-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BotAutomationSettings } from "@/components/settings/bot-automation-settings"
import { BotUpgradeSettings } from "@/components/settings/bot-upgrade-settings"
import { MatchingAlgorithmSettings } from "@/components/settings/matching-algorithm-settings"
import { VideoCallSettings } from "@/components/settings/video-call-settings"

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Ayarlar</h1>
          <p className="text-muted-foreground">Sistem ayarlarını ve tercihlerini yönetin.</p>
        </div>

        <Tabs defaultValue="bot-automation" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bot-automation">Bot Otomasyonu</TabsTrigger>
            <TabsTrigger value="bot-upgrade">Yükseltme Ayarları</TabsTrigger>
            <TabsTrigger value="matching-algorithm">Eşleştirme Algoritması</TabsTrigger>
            <TabsTrigger value="video-call">Görüntülü Konuşma</TabsTrigger>
          </TabsList>

          <TabsContent value="bot-automation">
            <BotAutomationSettings />
          </TabsContent>

          <TabsContent value="bot-upgrade">
            <BotUpgradeSettings />
          </TabsContent>

          <TabsContent value="matching-algorithm">
            <MatchingAlgorithmSettings />
          </TabsContent>

          <TabsContent value="video-call">
            <VideoCallSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
