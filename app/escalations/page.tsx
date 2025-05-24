import { AdminLayout } from "@/components/layout/admin-layout"
import { EscalationQueue } from "@/components/live-chat/escalation-queue"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EscalationsPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Yükseltilmiş Konuşmalar</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">4</CardTitle>
              <CardDescription>Aktif Yükseltilmiş</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Son 24 saatte <span className="text-green-500">+2</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">6</CardTitle>
              <CardDescription>Bekleyen Yükseltmeler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Son 24 saatte <span className="text-yellow-500">+3</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">12</CardTitle>
              <CardDescription>Çözülen Konuşmalar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Son 24 saatte <span className="text-green-500">+5</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <EscalationQueue />
      </div>
    </AdminLayout>
  )
}
