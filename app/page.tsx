import { AdminLayout } from "@/components/layout/admin-layout"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default function Home() {
  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  )
}
