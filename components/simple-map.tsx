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

// Separate Canvas component to handle the map rendering
function MapCanvas({ location, name }: { location: Location; name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }

    resizeCanvas()

    // Draw the map
    const drawMap = () => {
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
    }

    // Draw the map
    drawMap()

    // Handle window resize
    const handleResize = () => {
      resizeCanvas()
      drawMap()
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [location, name])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

export function SimpleMap({ location, name }: SimpleMapProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)

  useEffect(() => {
    const loadMap = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        setIsMapReady(true)
        setIsLoading(false)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load map"
        setError(errorMessage)
        toast.error("Map Error", {
          description: errorMessage,
        })
        setIsLoading(false)
      }
    }

    loadMap()
  }, [name])

  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden h-[300px] bg-card shadow-sm">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <Alert variant="destructive" className="w-full max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-muted-foreground flex items-center gap-2">
              <Coffee className="h-5 w-5 animate-pulse" />
              Loading map...
            </div>
          </div>
        ) : isMapReady ? (
          <MapCanvas location={location} name={name} />
        ) : null}
      </Card>
      <div className="flex items-start gap-2">
        <MapPin className="h-5 w-5 text-primary mt-0.5" />
        <div>
          <h3 className="font-medium text-primary">{name}</h3>
          <p className="text-sm text-muted-foreground">{location.address}</p>
          <p className="text-sm text-muted-foreground">
            {location.city}, {location.state} {location.zip}
          </p>
        </div>
      </div>
    </div>
  )
}

