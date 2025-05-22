import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BotAutomationSettings } from "./bot-automation-settings"
import { BotUpgradeSettings } from "./bot-upgrade-settings"

export function SettingsContent() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Ayarlar</h1>
        <p className="text-muted-foreground">Sistem ayarlarını ve tercihlerini yönetin.</p>
      </div>

      <Tabs defaultValue="bot-automation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bot-automation">Bot Otomasyonu</TabsTrigger>
          <TabsTrigger value="bot-upgrade">Yükseltme Ayarları</TabsTrigger>
        </TabsList>

        <TabsContent value="bot-automation">
          <BotAutomationSettings />
        </TabsContent>

        <TabsContent value="bot-upgrade">
          <BotUpgradeSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
