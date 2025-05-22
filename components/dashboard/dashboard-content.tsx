"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentUsersTable } from "@/components/dashboard/recent-users-table"
import { AnalyticsChart } from "@/components/dashboard/analytics-chart"
import { Users, AlertCircle, Ban, Clock, Calendar, DollarSign } from "lucide-react"
import { FaUserCheck, FaUsers, FaMale, FaFemale, FaRobot } from "react-icons/fa"

export function DashboardContent() {
  // Mock data for escalation metrics - keeping for reference but not displaying
  const escalationMetrics = {
    pendingEscalations: 6,
    activeEscalations: 4,
    resolvedToday: 12,
    avgResponseTime: "8 dakika",
    avgResolutionTime: "24 dakika",
  }

  return (
    <div className="flex flex-col gap-6 p-2">
      {/* Removed escalation banner */}

      <h1 className="text-2xl font-bold mb-2">Durum</h1>

      {/* Escalation metrics - keeping the cards but removing the explicit escalation card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          title="Aktif Kullanıcılar"
          value="248"
          icon={<Users className="h-6 w-6" />}
          color="text-blue-500"
          bgColor="bg-blue-100"
        />
        <StatusCard
          title="Aktif Konuşmalar"
          value="156"
          icon={<Clock className="h-6 w-6" />}
          color="text-green-500"
          bgColor="bg-green-100"
        />
        <StatusCard
          title="Bugün Çözülen"
          value={escalationMetrics.resolvedToday.toString()}
          icon={<Clock className="h-6 w-6" />}
          color="text-green-500"
          bgColor="bg-green-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          title="Çevrimiçi"
          value="4186"
          icon={<FaUserCheck className="h-6 w-6" />}
          color="text-emerald-500"
          bgColor="bg-emerald-100"
        />
        <StatusCard
          title="Spam"
          value="126"
          icon={<AlertCircle className="h-6 w-6" />}
          color="text-orange-500"
          bgColor="bg-orange-100"
        />
        <StatusCard
          title="Engellenen"
          value="345"
          icon={<Ban className="h-6 w-6" />}
          color="text-pink-500"
          bgColor="bg-pink-100"
        />
      </div>

      <h1 className="text-2xl font-bold mt-4 mb-2">Yeni Kullanıcılar</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Günlük"
          value="184"
          icon={<Clock className="h-6 w-6" />}
          color="text-emerald-500"
          bgColor="bg-emerald-100"
        />
        <StatusCard
          title="Haftalık"
          value="1288"
          icon={<Calendar className="h-6 w-6" />}
          color="text-orange-500"
          bgColor="bg-orange-100"
        />
        <StatusCard
          title="Aylık"
          value="5152"
          icon={<Users className="h-6 w-6" />}
          color="text-blue-500"
          bgColor="bg-blue-100"
        />
        <StatusCard
          title="Toplam"
          value="8416"
          icon={<FaUsers className="h-6 w-6" />}
          color="text-purple-500"
          bgColor="bg-purple-100"
        />
      </div>

      <h1 className="text-2xl font-bold mt-4 mb-2">Kullanıcı Sayısı</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Erkek"
          value="5127"
          icon={<FaMale className="h-6 w-6" />}
          color="text-emerald-500"
          bgColor="bg-emerald-100"
        />
        <StatusCard
          title="Kadın"
          value="2489"
          icon={<FaFemale className="h-6 w-6" />}
          color="text-orange-500"
          bgColor="bg-orange-100"
        />
        <StatusCard
          title="Bot"
          value="3548"
          icon={<FaRobot className="h-6 w-6" />}
          color="text-blue-500"
          bgColor="bg-blue-100"
        />
        <StatusCard
          title="Toplam"
          value="10624"
          icon={<FaUsers className="h-6 w-6" />}
          color="text-purple-500"
          bgColor="bg-purple-100"
        />
      </div>

      <h1 className="text-2xl font-bold mt-4 mb-2">Satışlar</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Günlük Satış"
          value="3248₺"
          icon={<DollarSign className="h-6 w-6" />}
          color="text-emerald-500"
          bgColor="bg-emerald-100"
        />
        <StatusCard
          title="Haftalık Satış"
          value="22876₺"
          icon={<DollarSign className="h-6 w-6" />}
          color="text-orange-500"
          bgColor="bg-orange-100"
        />
        <StatusCard
          title="Aylık Satış"
          value="91437₺"
          icon={<DollarSign className="h-6 w-6" />}
          color="text-blue-500"
          bgColor="bg-blue-100"
        />
        <StatusCard
          title="Toplam Satış"
          value="104617₺"
          icon={<DollarSign className="h-6 w-6" />}
          color="text-purple-500"
          bgColor="bg-purple-100"
        />
      </div>

      <div className="mt-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Analiz Özeti</h2>
            <AnalyticsChart />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="all">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Son Kullanıcılar</h2>
                <TabsList>
                  <TabsTrigger value="all">Tüm Kullanıcılar</TabsTrigger>
                  <TabsTrigger value="active">Aktif</TabsTrigger>
                  <TabsTrigger value="inactive">Pasif</TabsTrigger>
                  <TabsTrigger value="premium">Premium</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="all">
                <RecentUsersTable />
              </TabsContent>
              <TabsContent value="active">
                <RecentUsersTable filter="active" />
              </TabsContent>
              <TabsContent value="inactive">
                <RecentUsersTable filter="inactive" />
              </TabsContent>
              <TabsContent value="premium">
                <RecentUsersTable filter="premium" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface StatusCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

function StatusCard({ title, value, icon, color, bgColor }: StatusCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{title}</span>
              <div className={`rounded-full p-2 ${bgColor} ${color}`}>{icon}</div>
            </div>
          </div>
          <div className="p-4">
            <span className="text-2xl font-bold">{value}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
