import { ConsolidatedBotPanel } from "@/components/bot-management/consolidated-bot-panel"
import { AdminLayout } from "@/components/layout/admin-layout"

export default function BotManagementPage() {
  return (
    <AdminLayout>
      <ConsolidatedBotPanel />
    </AdminLayout>
  )
}
