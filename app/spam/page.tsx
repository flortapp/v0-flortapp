// Fix both imports to match their export types
import { AdminLayout } from "@/components/layout/admin-layout"
import SpamContent from "@/components/spam/spam-content"

export default function SpamPage() {
  return (
    <AdminLayout>
      <SpamContent />
    </AdminLayout>
  )
}
