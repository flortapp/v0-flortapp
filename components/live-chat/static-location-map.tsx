"use client"

import { useState } from "react"
import { MapPin, X, RefreshCw, Send, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

interface StaticLocationMapProps {
  lat: number
  lng: number
  placeName: string
  city: string
  neighborhood?: string
  googleMapsUrl?: string
  onClose: () => void
  onRegenerate?: () => void
  onSend?: () => void
  showControls?: boolean
  interactive?: boolean
  inMessage?: boolean
}

export function StaticLocationMap({
  lat,
  lng,
  placeName,
  city,
  neighborhood = "Merkez",
  googleMapsUrl,
  onClose,
  onRegenerate,
  onSend,
  showControls = false,
  interactive = false,
  inMessage = false,
}: StaticLocationMapProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Base map component
  const MapDisplay = () => (
    <div className="w-full h-full bg-gradient-to-b from-[#0c2135] to-[#051019] flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 opacity-20">
        {/* Create a starry background effect */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-1/3 left-3/4 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/5 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-1/5 right-1/4 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-white rounded-full"></div>
        {/* Add more "stars" randomly */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          ></div>
        ))}
      </div>

      {/* Location content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-[#fa2674]/20 flex items-center justify-center mb-4">
          <MapPin className="h-8 w-8 text-[#fa2674]" />
        </div>
        <h3 className="font-bold text-lg text-white text-center">{placeName}</h3>
        <p className="text-gray-300">
          {neighborhood}, {city}
        </p>
        <div className="mt-3 px-3 py-1 bg-[#0c2135] rounded-full text-xs text-gray-400">
          {lat.toFixed(6)}, {lng.toFixed(6)}
        </div>
      </div>

      {/* Interactive map styling */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-[#fa2674]/20 rounded-full"></div>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-[#fa2674]/10 rounded-full"></div>
      </div>
    </div>
  )

  // If this is in a message and should be interactive
  if (inMessage && interactive) {
    return (
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogTrigger asChild>
          <div className="relative w-full h-[200px] rounded-lg overflow-hidden border border-gray-700 mb-3 cursor-pointer hover:opacity-90 transition-opacity">
            <MapDisplay />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="bg-[#fa2674] text-white px-3 py-1 rounded-full text-sm opacity-0 hover:opacity-100 transition-opacity">
                Konumu Görüntüle
              </div>
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px] p-0 bg-[#171829] border-gray-700">
          <DialogHeader className="p-4 border-b border-gray-700">
            <DialogTitle className="text-xl flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-[#fa2674]" />
              {placeName}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {neighborhood}, {city}
            </DialogDescription>
          </DialogHeader>

          <div className="h-[400px] relative">
            <MapDisplay />
          </div>

          <DialogFooter className="p-4 border-t border-gray-700 flex flex-row justify-between">
            <div className="text-sm text-gray-400">
              {lat.toFixed(6)}, {lng.toFixed(6)}
            </div>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline" size="sm">
                  Kapat
                </Button>
              </DialogClose>
              <Button
                size="sm"
                className="bg-[#fa2674] hover:bg-[#e01e65]"
                onClick={() => {
                  if (googleMapsUrl) {
                    window.open(googleMapsUrl, "_blank")
                  } else {
                    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank")
                  }
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Google Maps'te Aç
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Standard map display (for location preview before sending)
  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden border border-gray-700 mb-3">
      <MapDisplay />

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-[#171829]/80 z-10"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Location control buttons */}
      {showControls && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-10">
          <Button
            variant="outline"
            size="sm"
            className="bg-[#171829]/80 border-gray-600 hover:bg-[#171829] hover:border-gray-500 text-white"
            onClick={onRegenerate}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Yeniden Oluştur
          </Button>
          <Button size="sm" className="bg-[#fa2674] hover:bg-[#e01e65] text-white border-none" onClick={onSend}>
            <Send className="h-4 w-4 mr-2" />
            Gönder
          </Button>
        </div>
      )}
    </div>
  )
}
