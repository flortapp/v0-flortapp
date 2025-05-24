import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Clock, CheckCircle } from "lucide-react"

export default function EscalationsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Yükseltilmiş Konuşmalar</h1>
        <p className="text-muted-foreground">
          Bot konuşmalarından yükseltilmiş ve yönetici müdahalesi gerektiren konuşmaları yönetin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-amber-700">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              Bekleyen Yükseltmeler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-amber-700">
              Henüz atanmamış ve yanıt bekleyen yükseltilmiş konuşmalar.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-blue-700">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              Aktif Yükseltmeler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-blue-700">
              Şu anda yöneticiler tarafından yönetilen yükseltilmiş konuşmalar.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-green-700">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Çözülen Yükseltmeler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-green-700">
              Son 24 saat içinde çözülen yükseltilmiş konuşmalar.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span>Bekleyen</span>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>Aktif</span>
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            <span>Çözülen</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>Bekleyen yükseltme bulunmuyor</p>
          </div>
        </TabsContent>
        <TabsContent value="active">
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>Aktif yükseltme bulunmuyor</p>
          </div>
        </TabsContent>
        <TabsContent value="resolved">
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>Çözülen yükseltme bulunmuyor</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 