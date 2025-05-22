"use client"

import { AlertCircle, CheckCircle, Clock, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface BotRedirectionStatusProps {
  status: "idle" | "selecting" | "redirecting" | "completed" | "failed"
  error: string | null
  onRetry: () => void
  onDismiss: () => void
  elapsedTime: number
}

export function BotRedirectionStatus({ status, error, onRetry, onDismiss, elapsedTime }: BotRedirectionStatusProps) {
  if (status === "idle") return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Alert
      variant={
        status === "completed"
          ? "success"
          : status === "failed"
            ? "destructive"
            : status === "redirecting"
              ? "default"
              : "outline"
      }
      className={`mb-4 ${
        status === "completed"
          ? "bg-green-50 border-green-200 text-green-800"
          : status === "failed"
            ? "bg-red-50 border-red-200"
            : status === "redirecting"
              ? "bg-yellow-50 border-yellow-200 text-yellow-800"
              : "bg-gray-50 border-gray-200"
      }`}
    >
      {status === "selecting" && (
        <>
          <AlertCircle className="h-4 w-4 text-gray-500" />
          <AlertTitle className="text-gray-900">Bot Seçimi</AlertTitle>
          <AlertDescription className="text-gray-700">
            Lütfen konuşmayı yönlendirmek istediğiniz botu seçin.
          </AlertDescription>
        </>
      )}

      {status === "redirecting" && (
        <>
          <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />
          <AlertTitle className="text-yellow-800">Yönlendiriliyor...</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span className="text-yellow-700">
              Konuşma yönlendiriliyor, lütfen bekleyin. Bu işlem birkaç saniye sürebilir.
            </span>
            <span className="text-yellow-700 font-mono">
              <Clock className="h-3 w-3 inline-block mr-1" />
              {formatTime(elapsedTime)}
            </span>
          </AlertDescription>
        </>
      )}

      {status === "completed" && (
        <>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Yönlendirme Başarılı</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span className="text-green-700">
              Konuşma başarıyla yönlendirildi. Yeni konuşma sayfasına yönlendiriliyorsunuz.
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-green-700 hover:bg-green-100"
              onClick={onDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </>
      )}

      {status === "failed" && (
        <>
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Yönlendirme Başarısız</AlertTitle>
          <AlertDescription className="text-red-700">
            {error || "Konuşma yönlendirilirken bir hata oluştu. Lütfen tekrar deneyin."}
            <div className="mt-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white border-red-200 text-red-700 hover:bg-red-50"
                onClick={onRetry}
              >
                Tekrar Dene
              </Button>
              <Button variant="ghost" size="sm" className="text-red-700 hover:bg-red-50" onClick={onDismiss}>
                Kapat
              </Button>
            </div>
          </AlertDescription>
        </>
      )}
    </Alert>
  )
}
