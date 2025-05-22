"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

interface EscalationBannerProps {
  pendingEscalations: number
  disabled?: boolean // Add disabled prop
}

export function EscalationBanner({ pendingEscalations, disabled = true }: EscalationBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Show the banner if there are pending escalations and it's not disabled
    setIsVisible(pendingEscalations > 0 && !disabled)
  }, [pendingEscalations, disabled])

  if (!isVisible) return null

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-amber-100 p-2 rounded-full">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h3 className="font-medium text-amber-800">Dikkat: Bekleyen Yükseltmeler</h3>
          <p className="text-amber-700">
            {pendingEscalations} adet bekleyen yükseltilmiş konuşma bulunmaktadır. Lütfen en kısa sürede kontrol edin.
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        className="bg-white hover:bg-amber-50 border-amber-200 text-amber-700"
        onClick={() => router.push("/escalations")}
      >
        Yükseltmeleri Görüntüle
      </Button>
    </div>
  )
}
