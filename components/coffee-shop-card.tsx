"use client"

import Image from "next/image"
import { Star, MapPin, Wifi, Users, Clock, Coffee } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { CoffeeShop } from "@/types/coffee-shop"
import { useMemo } from "react"
import { getReviews } from "@/lib/review-store"

interface CoffeeShopCardProps {
  shop: CoffeeShop
  onClick: () => void
}

export function CoffeeShopCard({ shop, onClick }: CoffeeShopCardProps) {
  // Calculate the average rating including user reviews
  const averageRating = useMemo(() => {
    // Get user reviews from the store
    const userReviews = getReviews(shop.id)

    // If there are no reviews at all, return the original rating
    if (shop.reviews.length === 0 && userReviews.length === 0) {
      return shop.rating
    }

    // Calculate the average from all reviews
    const allReviews = [...shop.reviews, ...userReviews]
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
    return totalRating / allReviews.length
  }, [shop.id, shop.rating, shop.reviews])

  return (
    <Card
      className="group overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={shop.image || "/placeholder.svg?height=400&width=600"}
          alt={`${shop.name} coffee shop`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="line-clamp-2 text-sm">{shop.description}</p>
        </div>
        <div className="absolute top-2 right-2">
          <Badge className="bg-primary text-primary-foreground">
            <Coffee className="h-3 w-3 mr-1" />
            Coffee Shop
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-primary">{shop.name}</h3>
          <div className="flex items-center rounded-full bg-muted px-2 py-1">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 mr-1" />
            <span className="text-sm font-medium text-muted-foreground">{averageRating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center text-muted-foreground mt-1 mb-3">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span className="text-xs">
            {shop.location.address}, {shop.location.city}
          </span>
        </div>
        <div className="flex items-center text-muted-foreground mb-3">
          <Clock className="h-3.5 w-3.5 mr-1" />
          <span className="text-xs">
            {shop.hours.open} - {shop.hours.close}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {shop.amenities.wifi && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 text-xs bg-muted border-border text-muted-foreground"
            >
              <Wifi className="h-3 w-3" />
              WiFi
            </Badge>
          )}
          {shop.amenities.seating && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 text-xs bg-muted border-border text-muted-foreground"
            >
              <Users className="h-3 w-3" />
              Seating
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="default"
          className="w-full transition-all active:scale-[0.98]"
          onClick={(e) => {
            e.stopPropagation() // Prevent triggering the card's onClick
            onClick()
          }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

