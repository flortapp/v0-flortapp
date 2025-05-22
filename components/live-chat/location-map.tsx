"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, MapPin } from "lucide-react"

interface LocationMapProps {
  lat: number
  lng: number
  placeName: string
  city: string
  onClose: () => void
}

// Declare google as a global variable to avoid Typescript errors
declare global {
  interface Window {
    google?: any
    initMap?: () => void
  }
}

export function LocationMap({ lat, lng, placeName, city, onClose }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Function to handle map initialization
    window.initMap = () => {
      if (!mapRef.current) return
      setIsLoading(false)

      try {
        // Create map instance
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 15,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#000000" }, { lightness: 13 }],
            },
            {
              featureType: "administrative",
              elementType: "geometry.fill",
              stylers: [{ color: "#000000" }],
            },
            {
              featureType: "administrative",
              elementType: "geometry.stroke",
              stylers: [{ color: "#144b53" }, { lightness: 14 }, { weight: 1.4 }],
            },
            {
              featureType: "landscape",
              elementType: "all",
              stylers: [{ color: "#08304b" }],
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#0c4152" }, { lightness: 5 }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.fill",
              stylers: [{ color: "#000000" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#0b434f" }, { lightness: 25 }],
            },
            {
              featureType: "road.arterial",
              elementType: "geometry.fill",
              stylers: [{ color: "#000000" }],
            },
            {
              featureType: "road.arterial",
              elementType: "geometry.stroke",
              stylers: [{ color: "#0b3d51" }, { lightness: 16 }],
            },
            {
              featureType: "road.local",
              elementType: "geometry",
              stylers: [{ color: "#000000" }],
            },
            {
              featureType: "transit",
              elementType: "all",
              stylers: [{ color: "#146474" }],
            },
            {
              featureType: "water",
              elementType: "all",
              stylers: [{ color: "#021019" }],
            },
          ],
        })

        // Add marker
        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: placeName,
          animation: window.google.maps.Animation.DROP,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "#fa2674",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 10,
          },
        })

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="color: #000; font-weight: bold;">${placeName}</div><div style="color: #000;">${city}</div>`,
        })

        marker.addListener("click", () => {
          infoWindow.open(map, marker)
        })

        // Open info window by default
        infoWindow.open(map, marker)
      } catch (error) {
        console.error("Error initializing map:", error)
        setMapError(true)
      }
    }

    // Load Google Maps script with error handling
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script")
      // Use a static map URL instead of requiring an API key
      script.src = "https://maps.googleapis.com/maps/api/js?callback=initMap"
      script.async = true
      script.defer = true
      script.onerror = () => {
        console.error("Google Maps script failed to load")
        setMapError(true)
        setIsLoading(false)
      }
      document.head.appendChild(script)

      // Set a timeout in case the script takes too long to load
      setTimeout(() => {
        if (isLoading) {
          setMapError(true)
          setIsLoading(false)
        }
      }, 5000)
    }

    loadGoogleMapsScript()

    return () => {
      // Clean up the global initMap function
      delete window.initMap

      // Remove the script tag if it exists
      const script = document.querySelector('script[src*="maps.googleapis.com"]')
      if (script) {
        script.remove()
      }
    }
  }, [lat, lng, placeName, city, isLoading])

  // Fallback UI when there's an error loading the map
  if (mapError) {
    return (
      <div className="relative w-full h-[300px] rounded-lg overflow-hidden border border-gray-700 mb-3 bg-[#171829] flex flex-col items-center justify-center p-4">
        <MapPin className="h-16 w-16 text-[#fa2674] mb-4" />
        <div className="text-center">
          <h3 className="font-bold text-lg">{placeName}</h3>
          <p className="text-gray-400">{city}</p>
          <p className="mt-2 text-sm text-gray-500">
            Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-[#171829]/80 z-10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="relative w-full h-[300px] rounded-lg overflow-hidden border border-gray-700 mb-3 bg-[#171829] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-gray-700 mb-4"></div>
          <div className="h-4 w-32 bg-gray-700 rounded mb-2"></div>
          <div className="h-3 w-24 bg-gray-700 rounded"></div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-[#171829]/80 z-10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // Map container
  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden border border-gray-700 mb-3">
      <div ref={mapRef} className="w-full h-full"></div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-[#171829]/80 z-10"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
