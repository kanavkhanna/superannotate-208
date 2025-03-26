"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, AlertCircle, Coffee } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Location } from "@/types/coffee-shop"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SimpleMapProps {
  location: Location
  name: string
}

export function SimpleMap({ location, name }: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  // In a real app, you would use a mapping library like Google Maps, Mapbox, or Leaflet
  // This is a simplified representation for demonstration purposes

  useEffect(() => {
    if (!mapRef.current) return

    const loadMap = async () => {
      try {
        // Remove loading toast - not necessary for map loading

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        const canvas = document.createElement("canvas")
        canvas.width = mapRef.current.clientWidth
        canvas.height = mapRef.current.clientHeight
        mapRef.current.innerHTML = ""
        mapRef.current.appendChild(canvas)

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          throw new Error("Could not initialize canvas context")
        }

        // Draw a coffee-themed map
        // Background
        ctx.fillStyle = "#FDF6EC"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw some "streets"
        ctx.strokeStyle = "#E6C9A8"
        ctx.lineWidth = 6

        // Main streets
        for (let i = 1; i < 5; i += 2) {
          ctx.beginPath()
          ctx.moveTo(0, canvas.height * (i / 5))
          ctx.lineTo(canvas.width, canvas.height * (i / 5))
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(canvas.width * (i / 5), 0)
          ctx.lineTo(canvas.width * (i / 5), canvas.height)
          ctx.stroke()
        }

        // Secondary streets
        ctx.strokeStyle = "#F5EBE0"
        ctx.lineWidth = 3

        for (let i = 2; i < 5; i += 2) {
          ctx.beginPath()
          ctx.moveTo(0, canvas.height * (i / 5))
          ctx.lineTo(canvas.width, canvas.height * (i / 5))
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(canvas.width * (i / 5), 0)
          ctx.lineTo(canvas.width * (i / 5), canvas.height)
          ctx.stroke()
        }

        // Draw a marker in the center
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        // Pin shadow
        ctx.beginPath()
        ctx.arc(centerX, centerY + 5, 10, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
        ctx.fill()

        // Pin base
        ctx.beginPath()
        ctx.arc(centerX, centerY, 12, 0, Math.PI * 2)
        ctx.fillStyle = "#5E3A21"
        ctx.fill()

        // Pin inner circle
        ctx.beginPath()
        ctx.arc(centerX, centerY, 6, 0, Math.PI * 2)
        ctx.fillStyle = "#F9A826"
        ctx.fill()

        // Add some coffee cup icons as buildings
        const buildingColors = ["#8B5A3C", "#5E3A21", "#A67B5B", "#C4A484"]

        for (let i = 0; i < 15; i++) {
          const x = Math.random() * canvas.width
          const y = Math.random() * canvas.height

          // Don't draw buildings too close to the marker
          const distToMarker = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
          if (distToMarker < 50) continue

          // Draw a simple coffee cup
          const color = buildingColors[Math.floor(Math.random() * buildingColors.length)]
          const size = 10 + Math.random() * 15

          // Cup
          ctx.fillStyle = color
          ctx.fillRect(x, y, size, size * 1.2)

          // Handle
          ctx.beginPath()
          ctx.arc(x + size, y + size * 0.5, size * 0.4, Math.PI * 1.5, Math.PI * 0.5)
          ctx.strokeStyle = color
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // Remove success toast - not necessary for map loading
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
          toast.error("Map Error", {
            description: error.message,
          })
        }
      }
    }

    loadMap()
  }, [name])

  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden h-[300px] bg-[#FDF6EC] shadow-sm" ref={mapRef}>
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <Alert variant="destructive" className="w-full max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[#8B5A3C] flex items-center gap-2">
              <Coffee className="h-5 w-5 animate-pulse" />
              Loading map...
            </div>
          </div>
        )}
      </Card>
      <div className="flex items-start gap-2">
        <MapPin className="h-5 w-5 text-[#5E3A21] mt-0.5" />
        <div>
          <h3 className="font-medium text-[#5E3A21]">{name}</h3>
          <p className="text-sm text-[#8B5A3C]">{location.address}</p>
          <p className="text-sm text-[#8B5A3C]">
            {location.city}, {location.state} {location.zip}
          </p>
        </div>
      </div>
    </div>
  )
}

